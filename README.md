# VoxAgent

VoxAgent is an AI-powered voice and text assistant that leverages Retrieval-Augmented Generation (RAG) to provide context-aware, bilingual responses. The agent supports regional languages and English, utilizing advanced Speech-To-Text (STT) and Text-To-Speech (TTS) capabilities.

## Features

- **Text & Voice Interactions**: Communicate via text or voice.
- **RAG Integration**: Analyzes internal documents (`backend/docs`) to provide accurate, context-aware responses.
- **Multilingual Support**: Real-time STT and translation for multiple regional languages to English and back.
- **High-Performance AI**: Uses Groq (GPT OSS 20B) for ultra-fast completions.
- **Voice APIs**: Sarvam AI API integration for state-of-the-art regional voice synthesis and transcription.

## Tech Stack

- **Backend**: FastAPI, Python
- **AI/LLM**: Groq API (GPT OSS 20B), LlamaIndex
- **Embeddings**: BAAI/bge-small-en (via HuggingFace)
- **Voice Processing**: Sarvam AI API
- **Frontend**: React + Vite

## Prerequisites

- Python 3.9+
- Node.js & npm
- [Groq API Key](https://console.groq.com/)
- [Sarvam AI API Key](https://dashboard.sarvam.ai/)

## Project Structure

```
VoxAgent/
├── backend/
│   ├── docs/          # Place your knowledge base documents here for RAG
│   ├── storage/       # Vector index is stored here
│   ├── main.py        # FastAPI server and endpoints
│   ├── rag.py         # LlamaIndex retrieval pipeline
│   └── .env           # Backend environment variables
└── frontend/
    └── voxagent-ui/   # React frontend application
```

## Setup & Installation

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   > Note: You may need additional requirements for LlamaIndex which are not completely listed in `requirements.txt`.
   ```bash
   pip install fastapi uvicorn python-multipart requests python-dotenv groq llama-index llama-index-llms-groq llama-index-embeddings-huggingface
   ```
4. Create a `.env` file in the `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   SARVAM_API_KEY=your_sarvam_api_key_here
   ```
5. Place your reference documents (PDFs, TXT, etc.) into `backend/docs/`.
6. Start the FastAPI backend:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   > The index will be generated automatically the first time you run the app.

### 2. Frontend Setup

1. Navigate to the frontend UI directory:
   ```bash
   cd frontend/voxagent-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /ask`: Accepts a JSON payload `{"message": "string"}` and returns a concise, RAG-augmented text response.
- `POST /voice`: Accepts an audio `file` upload. Returns the STT transcript, generated response, base64 audio string for TTS, and the recognized language.

## Troubleshooting

- **No index generated**: Ensure your `backend/docs/` folder has readable files and that you have `llama-index` properly configured.
- **Environment Keys**: Ensure `.env` is inside the `backend/` directory and contains both `GROQ_API_KEY` and `SARVAM_API_KEY`.