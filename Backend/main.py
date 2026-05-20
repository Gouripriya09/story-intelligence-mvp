from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ai_service import analyze_story
import json

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Story Intelligence API Running"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    # Read uploaded file
    contents = await file.read()

    # Convert bytes to text
    text = contents.decode("utf-8")

    # Send to AI
    ai_response = analyze_story(text)

    try:

        cleaned_response = ai_response.strip()

    # Remove markdown wrappers if present
        cleaned_response = cleaned_response.replace("```json", "")
        cleaned_response = cleaned_response.replace("```", "")
        cleaned_response = cleaned_response.strip()

        parsed_response = json.loads(cleaned_response)

        return parsed_response

    except Exception as e:

        return {
        "error": "Invalid AI response",
        "details": str(e),
        "raw_response": ai_response
    }