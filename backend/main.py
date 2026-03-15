# from fastapi import FastAPI
# from pydantic import BaseModel
# from groq import Groq
# import os
# from dotenv import load_dotenv

# load_dotenv()

# app = FastAPI()

# client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# class Query(BaseModel):
#     message: str

# @app.post("/ask")
# async def ask_ai(query: Query):

#     response = client.chat.completions.create(
#         model="llama3-8b-8192",
#         messages=[
#             {"role": "system", "content": "You are VoxAgent, a helpful multilingual voice assistant."},
#             {"role": "user", "content": query.message}
#         ]
#     )

#     return {
#         "response": response.choices[0].message.content
#     }
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq, GroqError
import os
from dotenv import load_dotenv

# Load environment variables from the .env file located next to this script
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=dotenv_path)

# Initialize FastAPI
app = FastAPI()

# Get API key from environment variables
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError(f"GROQ_API_KEY not found in environment variables. Make sure your .env file exists at {dotenv_path} and is loaded.")

# Initialize Groq client
client = Groq(api_key=api_key)

# Define the request model
class Query(BaseModel):
    message: str

# POST endpoint to interact with the AI
@app.post("/ask")
async def ask_ai(query: Query):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are VoxAgent, a helpful multilingual voice assistant."},
                {"role": "user", "content": query.message}
            ]
        )
        return {"response": response.choices[0].message.content}

    except GroqError as e:
        raise HTTPException(status_code=500, detail=str(e))