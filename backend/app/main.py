from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json
import pathlib

from .schemas import AnalyzeRequest, AnalyzeResponse
from .crud import get_patent, get_company_products, PATENTS, COMPANIES
from .client import call_llm_analysis

app = FastAPI(title="Patent Infringement Checker")

# Enable CORS to allow browser preflight (OPTIONS) and cross-origin calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    """
    Endpoint to analyze patent infringement risk for a given company.
    """
    patent = get_patent(request.patent_id)
    if not patent:
        raise HTTPException(status_code=404, detail="Patent not found.")

    products = get_company_products(request.company_name)
    if products is None:
        raise HTTPException(status_code=404, detail="Company not found.")

    return call_llm_analysis(patent, products)


@app.get("/patents/{patent_id}")
async def read_patent(patent_id: str):
    """
    Retrieve raw patent data by publication number.
    """
    patent = get_patent(patent_id)
    if not patent:
        raise HTTPException(status_code=404, detail="Patent not found.")
    return patent


@app.get("/companies/{company_name}/products")
async def read_products(company_name: str):
    """
    Retrieve product list for a given company.
    """
    products = get_company_products(company_name)
    if products is None:
        raise HTTPException(status_code=404, detail="Company not found.")
    return products


@app.get("/reports", response_model=List[AnalyzeResponse])
async def list_reports():
    """
    Retrieve all saved infringement analysis reports.
    """
    path = pathlib.Path(__file__).parent.parent / "data" / "reports.json"
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/patents")
async def list_patents():
    return [p["publication_number"] for p in PATENTS]


@app.get("/companies")
async def list_companies():
    return [c["name"] for c in COMPANIES]
