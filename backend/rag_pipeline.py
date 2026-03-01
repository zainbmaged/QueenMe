from fastapi import FastAPI

import config
import os

from contextlib import asynccontextmanager
from langchain_cohere import ChatCohere, CohereEmbeddings


from vectorstore import build_vectorstore
from langchain_core.prompts import PromptTemplate

from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

rag_chain =None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global rag_chain
    os.environ["COHERE_API_KEY"] = config.COHERE_API_KEY
    
    embed = CohereEmbeddings(model="embed-english-v3.0", cohere_api_key=config.COHERE_API_KEY)

    vectorstore = build_vectorstore(config.DATA_DIR, embed, config.CHROMA_DB_DIR)
    count = vectorstore._collection.count()
    print(f"Vectorstore has {count} chunks")

    retreiver = vectorstore.as_retriever( search_type="mmr",
    search_kwargs={"k": 6, "fetch_k": 15, "lambda_mult": 0.75}
)
    
    llm = ChatCohere(
    model="command-a-03-2025",
    temperature = 0.0,# just facts no creativity
    max_tokens=500)

    prompt = PromptTemplate.from_template("""
    You are Queen's University  QA system use formal academic language.
    Answer the question using ONLY the context below.
    Donot invent course codes or names or any details not explixitly stated
    If the answer is not in the context, say "please visist queensu.ca for details".

    Context:
    {context}

    Question:
    {question}

    Answer (one short sentence based strictly on context only):
    """)

    def formate_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)



    rag_chain = ({
        "context": retreiver | formate_docs,
        "question":RunnablePassthrough(),

    }
        |prompt
        |llm
        |StrOutputParser())
    yield