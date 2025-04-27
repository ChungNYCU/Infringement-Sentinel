import os
import json
from typing import List, Dict, Optional
from fuzzywuzzy import process

BASE_DIR = os.path.dirname(os.path.dirname(__file__)) + "/data/"

with open(os.path.join(BASE_DIR, "patents.json"), "r", encoding="utf-8") as f:
    PATENTS = json.load(f)
with open(os.path.join(BASE_DIR, "company_products.json"), "r", encoding="utf-8") as f:
    COMPANIES = json.load(f)["companies"]


def get_patent(patent_id: str) -> Optional[Dict]:
    return next((p for p in PATENTS if p["publication_number"] == patent_id), None)


def get_company_products(company_name: str) -> Optional[List[Dict]]:
    # Fuzzy match against known company names
    all_names = [c["name"] for c in COMPANIES]
    match, score = process.extractOne(company_name, all_names)
    if score < 70:
        return None
    company = next((c for c in COMPANIES if c["name"] == match), None)
    return company.get("products") if company else None
