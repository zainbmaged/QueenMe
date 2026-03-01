from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from data_loader import build_embeddings

from vectorstore import build_vectorstore
import rag_pipeline
from routes.query import QueryRequest

from rag_pipeline import lifespan 
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #specify react for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    build_vectorstore() 

@app.post("/ask")
async def ask(query: QueryRequest):

    if rag_pipeline.rag_chain is None:
        raise ValueError("RAG chain is not initialized yet. Please try again .")

    if not query.question.strip():
        raise ValueError("Question cannot be empty.")
    
    answer = rag_pipeline.rag_chain.invoke(query.question)
    return { "question": query.question,"answer": answer}