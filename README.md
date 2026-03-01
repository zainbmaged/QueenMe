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
- Go to Cohere offcial website and create an account and a free api key
<https://dashboard.cohere.com/api-keys
install Node.js from official site **check add to Path box in installation window **
<https://nodejs.org/en> 

### Clone repo

- git clone <https://github.com/zainbmaged/QueenMe>
- cd  yoursavedfolderpath/QueenMe

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
Create .env file in backend folder Add your cohere api key to the  `.env` file in the backend folder:
```
COHERE_API_KEY= "Your Cohere API Key Here"
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
### In any browser open the local path usually http://localhost:5173/
Try asking any questions samples provided at the github repo

## Sample Questions with the expected answer

1.What faculties offers Artificial Intelligence related courses?

The faculties of Arts and Science and Smith Engineering offer Artificial Intelligence related courses.

2.Is there any scholarships or financial aids?

Queen’s University offers various scholarships, bursaries, and financial aid programs, including needs-based assistance, merit-based awards, and support for specific student groups such as Indigenous and first-generation students.

3.what is the transfer credits policies for undergraduates?

Transfer credit policies for undergraduates at Queen's University include non-removable credits once applied, credit limits set by each School or Faculty, assessments by the relevant Undergraduate Chair, non-appealable outcomes, potential minimum grade thresholds, and mandatory disclosure of prior post-secondary studies.

4.Can I apply if my English proficiency does not meet the required level in undergraduate?

Applicants who do not meet the English language proficiency requirements but are academically competitive may be considered for the QBridge program, which prepares students for Queen's undergraduate studies.

5.What are the honors programs and how long did they take?

Honours Programs are typically 4 years with a major-focused curriculum.

6.What are the policies for transferring credit?

Transfer credit policies at Queen's University include finality of applied credits, credit limits set by each School or Faculty, non-appealable assessment outcomes, mandatory disclosure of prior post-secondary studies, and requirements for detailed electronic course descriptions.

7.what programs offers political sciences program?

The programs that offer political sciences are Political Studies and Politics, Philosophy and Economics at the undergraduate level, and Political Studies (M.A., PhD) and Political and Legal Thought (M.A. specialization) at the graduate level.

8.How to apply to queens university?

There are three ways to apply to Queen's University: through the Ontario Universities' Application Centre (OUAC), the Common App Application Centre, or the Queen's International Application Portal, depending on the applicant's location and circumstances.

9.what are the papers required to apply as an international student?

International students applying to Queen's University must submit official transcripts in the original language along with a certified translation, and demonstrate English language proficiency through a recognized test.
