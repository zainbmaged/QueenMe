import os
from dotenv import load_dotenv
load_dotenv()
COHERE_API_KEY= os.getenv("COHERE_API_KEY")
DATA_DIR = "docs"
# for persisting the vector database to disk
CHROMA_DB_DIR = "./chroma_db"