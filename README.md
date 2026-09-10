# Chatbot com Inteligencia Artificial

Aplicacao de teste com React no frontend, FastAPI no backend e integracao com a OpenAI Responses API.

## Estrutura

```text
chatbot_ia/
  backend/
    app/main.py
    requirements.txt
    .env.example
  frontend/
    src/App.jsx
    src/main.jsx
    src/styles.css
    package.json
```

## Como executar

### 1. Backend

No PowerShell, dentro da pasta `backend`:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Preencha `OPENAI_API_KEY` no arquivo `backend/.env` e inicie a API:

```powershell
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

Em outro terminal, dentro da pasta `frontend`:

```powershell
npm install
npm run dev
```

Abra o endereco mostrado pelo Vite, normalmente `http://localhost:5173`.

O backend tambem possui `GET /api/health` para verificar se a aplicacao esta online. A chave da OpenAI permanece exclusivamente no backend.

