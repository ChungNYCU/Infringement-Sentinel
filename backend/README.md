# Backend README

FastAPI service for Patent Infringement Checker

## 🛠 Prerequisites

- Python 3.10
- pip
- An OpenAI API Key

## 📦 Installation

1. **Clone and Navigate**
   ```bash
   git clone https://github.com/ChungNYCU/Infringement-Sentinel.git
   cd Infringement-Sentinel/backend
   ```

2. **Create Environment File**
   ```bash
   cp .env.example .env
   # Edit .env to add your OpenAI API key
   ```

3. **Install Dependencies**
   ```bash
   pip install --no-cache-dir -r requirements.txt
   ```

## 🚀 Running Locally

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Swagger UI: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py            # FastAPI app and routes
│   ├── client.py          # OpenAI integration & report persistence
│   ├── crud.py            # Data loading & fuzzy matching
│   ├── schemas.py         # Pydantic models
│   └── __init__.py
├── data/
│   ├── patents.json
│   ├── company_products.json
│   └── reports.json       # Generated analysis reports
├── Dockerfile
├── requirements.txt
└── .env.example
```

## 🛠️ Available Endpoints

- **POST /analyze**  
  Accepts `{ "patent_id": string, "company_name": string }` and returns an `AnalyzeResponse` JSON payload.

- **GET /patents/{patent_id}**  
  Returns the raw patent data object for the given publication number.

- **GET /companies/{company_name}/products**  
  Returns the product list associated with the given company name.

- **GET /patents**  
  Returns an array of all available `publication_number` values from `patents.json`.

- **GET /companies**  
  Returns an array of all company `name` values from `company_products.json`.

- **GET /reports**  
  Returns all saved infringement analysis reports (from `data/reports.json`).

## 🐳 Docker

Build and run via Docker Compose (root directory):
```bash
docker compose up --build backend
```

## 🔒 Configuration

Environment variables in `.env`:
```
OPENAI_API_KEY=YOUR_KEY_HERE
```

## 📖 License

MIT

