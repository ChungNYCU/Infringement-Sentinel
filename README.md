# Infringement-Sentinel

A two-service application that analyzes potential patent infringement of company products.

- **Backend**: FastAPI + OpenAI function-calling endpoints (`/analyze`, `/patents`, `/companies`, `/reports`)
- **Frontend**: Next.js + Tailwind CSS + shadcn/ui for interactive UI with dropdowns and report cards
- **Containerized** via Docker Compose

---

## 🚀 Quickstart

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChungNYCU/Infringement-Sentinel.git
   cd Infringement-Sentinel
   ```

2. **Configure backend environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and set OPENAI_API_KEY
   cd ..
   ```

3. **Build & run all services**
   ```bash
   docker compose up --build
   ```
   - Backend available at http://localhost:8000
   - Frontend available at http://localhost:3000

4. **Stop the services**
   ```bash
   docker compose down
   ```

---

## 📁 Project Structure

```
/
├── backend/               # FastAPI service
│   ├── app/               # source code
│   ├── data/              # patents.json, company_products.json, reports.json
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/              # Next.js service
│   ├── components/        # shared UI components
│   ├── app/               # Next.js pages
│   ├── public/
│   ├── next.config.js
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

---

## 📦 How It Works

- **Analyze**: Frontend posts `{ patent_id, company_name }` to `/api/analyze`.
  - Backend loads patent & products, calls OpenAI → returns structured JSON.
  - Frontend renders a report card.

- **Reports**: Each analysis is persisted in `backend/data/reports.json`.
  - Frontend provides a `/reports` page to list and toggle detailed reports.

---

## 🔧 Requirements

- Docker & Docker Compose (v2 CLI: `docker compose`)
- (Optional) Python 3.10, Node 18, npm/yarn for local development

---

## 📝 License

MIT

