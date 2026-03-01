

import chromadb
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

import os
from langchain_chroma import Chroma
from data_loader import load_data, build_embeddings

from langchain_community.vectorstores.utils import filter_complex_metadata

COLLECTION_NAME = "queens_admissions_individual_chunks"
def build_vectorstore(Edata_dir: str, embed, chroma_dir: str) -> Chroma:
   
    client = chromadb.PersistentClient(path=chroma_dir)

    existing_collections = [c.name for c in client.list_collections()]
    if COLLECTION_NAME in existing_collections:
        collection = client.get_collection(name=COLLECTION_NAME)
        if collection.count() > 0:
            print(f"Found existing vectorstore with {collection.count()} chunks. Loading it...")
            # persist directory exists and is not empty, load existing vectorstore
            return Chroma(
                client=client,
                embedding_function=embed,
                collection_name = COLLECTION_NAME,
            )
        else:
            print(f"Found existing collection '{COLLECTION_NAME}' but it is empty. Rebuilding vectorstore...")
            client.delete_collection(name=COLLECTION_NAME)
    print("Building vectorstore from data...")
    data = load_data(Edata_dir)
    if not data:
        raise ValueError(f"No data found in directory: {Edata_dir}")
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=300, separators=["\n\n", "\n",".", " ", ""])

    documents =[]
    for record in data:
        text , cleaned_meta = build_embeddings(record)
        documents.append( Document(page_content=text, metadata=cleaned_meta) )
    print(f"Created {len(documents)} individual documents from {len(data)} records.")

    chunks = text_splitter.split_documents(documents)
    print(f"Generated {len(chunks)} chunks from the documents.")

    cleaned_chunks = filter_complex_metadata(chunks)

    vectorstore = Chroma.from_texts(
        texts=[chunk.page_content for chunk in cleaned_chunks],
        embedding=embed,
        metadatas=[chunk.metadata for chunk in cleaned_chunks],
        client=client,
        collection_name = COLLECTION_NAME,
    )

    return vectorstore

    