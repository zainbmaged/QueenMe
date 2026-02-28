# QueenMe
The project aims to build a Retrieval-Augmented Generation (RAG) based assistant that  will provide answers to undergraduates, graduate students and researchers, from a limited set of  text files for Queens’ public academics information, using a pretrained foundational model. 
- **Backend**: FastAPI, LangChain, Cohere, ChromaDB
- **Frontend**: React, TypeScript, Tailwind CSS, Vite

# Installation Steps

### prerequiest 
- IDE like vscode
- Python 3.11
- Download and install Python 3.11 from the official website:
<https://www.python.org/downloads/release/python-3110/>
-Go to Cohere offcial website and create an account and a free api key
<https://dashboard.cohere.com/api-keys>

### Create & Activate Python Virtual Environment

Linux/macOS:

```py -3.11 -m venv venv
source venv/bin/activate
```

Windows (PowerShell):

```py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
```

You should see (venv) at the start of your terminal prompt.```

### Backend terminal
```bash
cd backend
pip install -r requirements.txt
```
Add your cohere api key to the  `.env` file in the backend folder:
```
COHERE_API_KEY=your_key_here
```
```bash
uvicorn main:app --reload
```

### Frontend terminal
```bash
cd queenme-ui
```
```
npm install
```
```
npm run dev
```
