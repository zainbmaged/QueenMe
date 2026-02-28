# QueenMe
The project aims to build a Retrieval-Augmented Generation (RAG) based assistant that  will provide answers to undergraduates, graduate students and researchers, from a limited set of  text files for Queens’ public academics information, using a pretrained foundational model. 
- **Backend**: FastAPI, LangChain, Cohere, ChromaDB
- **Frontend**: React, TypeScript, Tailwind CSS, Vite

# Installation Steps

### Backend
```bash
cd backend
pip install -r requirements.txt
```
Create a `.env` file in the backend folder:
```
COHERE_API_KEY=your_key_here
```
```bash
uvicorn main:app --reload
```

### Frontend
```bash
cd queenme-ui
npm install
npm run dev
```
