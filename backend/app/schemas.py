from pydantic import BaseModel
from typing import List

class AnalyzeRequest(BaseModel):
    patent_id: str
    company_name: str

class ClaimRef(BaseModel):
    num: str
    text: str

class ProductAnalysis(BaseModel):
    product_name: str
    infringement_likelihood: str
    relevant_claims: List[ClaimRef]
    explanation: str
    specific_features: List[str]

class AnalyzeResponse(BaseModel):
    analysis_id: str
    patent_id: str
    company_name: str
    analysis_date: str
    top_infringing_products: List[ProductAnalysis]
    overall_risk_assessment: str
