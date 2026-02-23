from fastapi import FastAPI
from pydantic import BaseModel
import base64
 
# Pulling directly from model.py
from model import generate_images
 
app = FastAPI()
 
# ===== STARTUP MESSAGE =====
@app.on_event("startup")
async def startup_event():
    print("\n" + "="*60)
    print("🚀 FASTAPI SERVER IS LIVE AND RUNNING WITHOUT ISSUES! 🚀")
    print("🧠 Ready to generate DermGen images.")
    print("="*60 + "\n")
 
class GenerateRequest(BaseModel):
    disease: int
    count: int
 
@app.post("/generate")
def generate(req: GenerateRequest):
    images = generate_images(req.disease, req.count)
    encoded_images = []
    for img_path in images:
        with open(img_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            encoded_images.append(encoded)
    return {"images": encoded_images}