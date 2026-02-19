import torch
import io
import base64
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
import torchvision.transforms as transforms
from model import Generator
import os

app = FastAPI(title="Conditional GAN Medical Image Generator")

# Configuration constants
LATENT_DIM = 100
NUM_CLASSES = 3
IMG_CHANNELS = 3
LOCAL_MODEL_PATH = "final-generator.pth"
DRIVE_MODEL_PATH = "/content/drive/MyDrive/cgan_output/final_generator.pth"

# Initialize and load model
device = torch.device("cpu")
gen = Generator(LATENT_DIM, NUM_CLASSES, IMG_CHANNELS).to(device)

def load_weights():
    # Priority 1: Local path (for deployment)
    if os.path.exists(LOCAL_MODEL_PATH):
        gen.load_state_dict(torch.load(LOCAL_MODEL_PATH, map_location=device))
        print(f"Loaded local weights from {LOCAL_MODEL_PATH}")
    # Priority 2: Drive path (for setup)
    elif os.path.exists(DRIVE_MODEL_PATH):
        weights = torch.load(DRIVE_MODEL_PATH, map_location=device)
        gen.load_state_dict(weights)
        torch.save(gen.state_dict(), LOCAL_MODEL_PATH)
        print(f"Loaded weights from Drive and saved locally to {LOCAL_MODEL_PATH}")
    else:
        print("Warning: No weights found. Server will fail on inference.")

load_weights()
gen.eval()

class GenerateRequest(BaseModel):
    class_idx: int
    num_images: int = 1

@app.post("/generate")
async def generate_image(request: GenerateRequest):
    if request.class_idx < 0 or request.class_idx >= NUM_CLASSES:
        raise HTTPException(status_code=400, detail=f"Invalid class_idx. Must be between 0 and {NUM_CLASSES-1}")
    
    num_imgs = min(max(1, request.num_images), 20)  # Limit to 1-20 images

    with torch.no_grad():
        # Generate multiple images at once
        noise = torch.randn(num_imgs, LATENT_DIM, 1, 1, device=device)
        labels = torch.full((num_imgs,), request.class_idx, dtype=torch.long, device=device)
        fake_images = gen(noise, labels)

        # De-normalize from [-1, 1] to [0, 1]
        fake_images = (fake_images * 0.5 + 0.5).clamp(0, 1)

        # Convert each image to base64 separately
        image_base64_list = []
        for i in range(num_imgs):
            img_tensor = fake_images[i].cpu()
            img_pil = transforms.ToPILImage()(img_tensor)
            
            # Encode to Base64
            buffered = io.BytesIO()
            img_pil.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            image_base64_list.append(img_str)

    return {
        "status": "success",
        "class_idx": request.class_idx,
        "images_base64": image_base64_list,
        "num_images": len(image_base64_list)
    }
