import os
import uuid
import json
from datetime import date
import openai
from dotenv import load_dotenv
from fastapi import HTTPException
from .schemas import AnalyzeResponse, ClaimRef

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError(
        "OPENAI_API_KEY not set. Please provide it in .env or environment variables.")
openai.api_key = api_key


def generate_prompt(patent: dict, products: list) -> str:
    """
    Construct the prompt for the LLM, including full claim texts.
    """
    # Ensure claims is a list of dicts
    raw_claims = patent.get("claims", [])
    if isinstance(raw_claims, str):
        try:
            claims_data = json.loads(raw_claims)
        except json.JSONDecodeError:
            claims_data = []
    else:
        claims_data = raw_claims

    # Build claims context: "00001: claim text..."
    claims_context = []
    for c in claims_data:
        num = c.get("num")
        text = c.get("text", "").strip().replace("\n", " ")
        if num and text:
            claims_context.append(f"{num}: {text}")
    claims_block = "\n".join(claims_context)

    # List of product names
    product_names = [p.get("name") for p in products]

    # Combine into prompt
    prompt = (
        f"Here are all the claims for patent {patent.get('publication_number')}:\n"
        f"{claims_block}\n\n"
        f"Based on the above claims and the following products: {product_names}, "
        f"select the top two infringing products and return the result as pure JSON "
        f"matching the AnalyzeResponse model. Do not include any extra text."
    )
    return prompt


def call_llm_analysis(patent: dict, products: list) -> AnalyzeResponse:
    """
    Call the OpenAI API using function calling to get structured infringement analysis.
    """
    prompt = generate_prompt(patent, products)

    # Define the function schema based on AnalyzeResponse model
    analysis_schema = AnalyzeResponse.schema(by_alias=True)
    function_def = {
        "name": "analyze_response",
        "description": "Generates a structured infringement analysis response",
        "parameters": analysis_schema
    }

    # Call the API with function_call
    resp = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": (
                "You are a patent infringement analysis assistant. "
                "Return only structured JSON via function_call. "
                "For each product explanation, clearly describe how the product implements core and secondary claim elements with detail. "
                "For overall_risk_assessment, provide a complete sentence explaining the risk level and reasons, e.g. 'High risk of infringement due to ...'."
            )},
            {"role": "user", "content": prompt},
        ],
        functions=[function_def],
        function_call={"name": "analyze_response"},
        temperature=0
    )

    message = resp.choices[0].message
    function_call = getattr(message, 'function_call', None)
    if function_call and function_call.name == 'analyze_response':
        raw_args = function_call.arguments
        try:
            data = json.loads(raw_args)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=502, detail=f"Failed to parse function_call.arguments as JSON: {raw_args}")
    else:
        raise HTTPException(
            status_code=502, detail="LLM did not return results via function_call.")

    # Enrich relevant_claims with actual claim text from patent
    raw_claims = patent.get("claims", [])
    if isinstance(raw_claims, str):
        try:
            raw_claims = json.loads(raw_claims)
        except json.JSONDecodeError:
            raw_claims = []
    # Build lookup with numeric keys (strip leading zeros)
    claim_lookup = {}
    for c in raw_claims:
        if isinstance(c, dict) and c.get('num'):
            try:
                key = str(int(c['num']))
                claim_lookup[key] = c.get('text', '')
            except (ValueError, TypeError):
                claim_lookup[c.get('num')] = c.get('text', '')

    for prod in data.get('top_infringing_products', []):
        enriched = []
        for ref in prod.get('relevant_claims', []):
            num = ref.get('num')
            lookup_key = str(int(num)) if num and num.isdigit() else num
            text = claim_lookup.get(lookup_key, '')
            enriched.append({"num": num, "text": text})
        prod['relevant_claims'] = enriched

    # Fill in any missing required fields
    data['analysis_id'] = str(uuid.uuid4())
    data.setdefault('patent_id', patent.get('publication_number'))
    data.setdefault('company_name', products[0].get('name'))
    data['analysis_date'] = date.today().isoformat()

    # Persist report
    import pathlib
    reports_path = pathlib.Path(__file__).parent.parent / "data" / "reports.json"
    reports_path.parent.mkdir(exist_ok=True)
    existing = []
    if reports_path.exists():
        with open(reports_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
    existing.append(data)
    with open(reports_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    # Validate and return the response model
    try:
        result = AnalyzeResponse(**data)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Data validation error: {e}\nData: {data}")
    return result
