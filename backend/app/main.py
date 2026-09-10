import os
from typing import Annotated

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI, OpenAIError
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(title="Chatbot IA API", version="1.0.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: Annotated[str, Field(min_length=1, max_length=4000)]


class ChatResponse(BaseModel):
    reply: str


@app.get("/api/health")
def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "provider_configured": bool(os.getenv("OPENAI_API_KEY")),
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "cole_sua_chave_aqui":
        raise HTTPException(
            status_code=503,
            detail="Configure OPENAI_API_KEY no arquivo backend/.env antes de conversar.",
        )

    client = OpenAI(api_key=api_key)
    try:
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            instructions=(
                "Voce e um assistente prestativo, claro e objetivo. "
                "Responda em portugues do Brasil, salvo se o usuario pedir outro idioma."
            ),
            input=request.message.strip(),
            store=False,
        )
    except OpenAIError as exc:
        raise HTTPException(
            status_code=502,
            detail="Nao foi possivel obter uma resposta da API de IA.",
        ) from exc

    reply = response.output_text.strip()
    if not reply:
        raise HTTPException(status_code=502, detail="A API de IA retornou uma resposta vazia.")
    return ChatResponse(reply=reply)

