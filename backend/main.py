
import requests
from fastapi import UploadFile, File
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq, GroqError
import os
from dotenv import load_dotenv
from rag import load_rag
# Load environment variables from the .env file located next to this script
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=dotenv_path)

# Initialize FastAPI
app = FastAPI()
origins = [
    "http://localhost:5173",  # your frontend URL
    "http://127.0.0.1:3000",
    # add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # allow POST, OPTIONS, etc.
    allow_headers=["*"],
)
# Get API key from environment variables
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError(f"GROQ_API_KEY not found in environment variables. Make sure your .env file exists at {dotenv_path} and is loaded.")


query_engine = load_rag()
# Initialize Groq client
client = Groq(api_key=api_key)

# Define the request model
class Query(BaseModel):
    message: str
chat_history = []

@app.post("/ask")
async def ask_ai(query: Query):
    try:
        # ✅ Step 1: Get RAG context
        rag_response = query_engine.query(query.message)
        context = str(rag_response)

        # ✅ Step 2: Add user message to history
        chat_history.append({
            "role": "user",
            "content": query.message
        })

        # ✅ Step 3: Send history + context
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are VoxAgent.
Use the context below to answer.
IMPORTANT:
- Answer in max 2 lines
- Be direct
- No explanation
-if later asked explain in detail then go in a bit detail but still concise
Context:
{context}
"""
                }
            ] + chat_history
        )

        answer = response.choices[0].message.content

        # ✅ Step 4: Save assistant reply
        chat_history.append({
            "role": "assistant",
            "content": answer
        })

        return {"response": answer}

    except GroqError as e:
        raise HTTPException(status_code=500, detail=str(e))

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

@app.post("/voice")
async def voice_ai(file: UploadFile = File(...)):
    try:
        # =========================
        # 1. STT + TRANSLATE (BEST API)
        # =========================
        stt_response = requests.post(
            "https://api.sarvam.ai/speech-to-text-translate",
            headers={
                "api-subscription-key": SARVAM_API_KEY
            },
            files={
                "file": (file.filename, await file.read(), file.content_type)
            },
            timeout=30
        )

        if stt_response.status_code != 200:
            raise Exception(f"STT failed: {stt_response.text}")

        stt_data = stt_response.json()

        user_text = stt_data.get("transcript", "").strip()
        lang_code = stt_data.get("language_code") or "en-IN"

        if not user_text:
            return {"response": "Could not understand audio"}
        print("STT RAW:", stt_response.text)
        # =========================
        # 2. RAG + LLM (ENGLISH ONLY)
        # =========================
        rag_response = query_engine.query(user_text)
        context = str(rag_response)

        chat_history.append({
            "role": "user",
            "content": user_text
        })

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are VoxAgent.
Use the context below to answer.

Context:
{context}

IMPORTANT:
- Answer concisely (max 3-4 lines)
"""
                }
            ] + chat_history
        )

        answer_en = response.choices[0].message.content

        chat_history.append({
            "role": "assistant",
            "content": answer_en
        })

        # =========================
        # 3. TRANSLATE BACK (if needed)
        # =========================
        final_answer = answer_en

        if lang_code != "en-IN":
            translate_res = requests.post(
                "https://api.sarvam.ai/translate",
                headers={
                    "api-subscription-key": SARVAM_API_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "input": answer_en,
                    "source_language_code": "en-IN",
                    "target_language_code": lang_code
                },
                timeout=20
            )

            if translate_res.status_code == 200:
                final_answer = translate_res.json().get("translated_text", answer_en)

        # =========================
        # 4. TTS
        # =========================
        tts_response = requests.post(
            "https://api.sarvam.ai/text-to-speech",
            headers={
                "api-subscription-key": SARVAM_API_KEY,
                "Content-Type": "application/json"
            },
            json={
                "text": final_answer,
                "target_language_code": lang_code,
                "model": "bulbul:v3"
            },
            timeout=20
        )

        if tts_response.status_code != 200:
            raise Exception(f"TTS failed: {tts_response.text}")

        tts_data = tts_response.json()
        audio_base64 = tts_data["audios"][0]
        print("TTS RAW:", tts_response.text)
        # =========================
        # FINAL RESPONSE
        # =========================
        return {
            "transcript": user_text,
            "response": final_answer,
            "audio": audio_base64,
            "language": lang_code
        }

    except Exception as e:
        print("🔥 ERROR:", str(e))   # <-- ADD THIS
        raise HTTPException(status_code=500, detail=str(e))