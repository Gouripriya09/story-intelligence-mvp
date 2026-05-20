import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def analyze_story(text):

    prompt = f"""
    Analyze the following episodic story.

    Return ONLY valid JSON.

    Tasks:
    - Analyze pacing
    - Analyze adaptation readiness
    - Analyze retention risk
    - Analyze cliffhanger density
    - Extract ALL character names from the uploaded story
    - Estimate character importance/frequency

    Rules:
    - Use ONLY characters found in the uploaded story
    - Do NOT invent placeholder names
    - Do NOT explain anything
    - Return ONLY JSON

    JSON format:

        {{
        "pacing_score": number,
        "adaptation_readiness": string,
        "retention_risk": string,
        "cliffhanger_density": string,
        "characters": [
            {{
                "name": string,
                "frequency": number
            }}
        ]
    }}

    Story:
    {text}
    """

    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    # Remove markdown formatting
    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    return content