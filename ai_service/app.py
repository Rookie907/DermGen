from typing import Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64

# Pulling directly from model.py
from model import generate_images

app = FastAPI()

# Enable CORS so browser preflight (OPTIONS) requests succeed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== STARTUP MESSAGE =====
@app.on_event("startup")
async def startup_event():
    # Use plain ASCII so Windows consoles without UTF-8 encoding don't crash
    print("\n" + "=" * 60)
    print("FASTAPI SERVER IS LIVE AND RUNNING WITHOUT ISSUES!")
    print("Ready to generate DermGen images.")
    print("=" * 60 + "\n")


class GenerateRequest(BaseModel):
    # Accept either string label (e.g. "AKIEC") or integer class index
    disease: Union[int, str]
    count: int


@app.post("/generate")
def generate(req: GenerateRequest):
    # Map possible string labels to integer indices expected by the model
    mapping = {
        "AKIEC": 0,
        "DF": 1,
        "VASC": 2,
    }

    if isinstance(req.disease, str):
        disease_idx = mapping.get(req.disease)
        if disease_idx is None:
            raise HTTPException(status_code=400, detail=f"Invalid disease class: {req.disease}")
    else:
        disease_idx = req.disease

    images = generate_images(disease_idx, req.count)
    encoded_images = []
    for img_path in images:
        with open(img_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            encoded_images.append(encoded)
    return {"images": encoded_images}