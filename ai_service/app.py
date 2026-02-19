from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import io
import base64
import os
import traceback
from torchvision.utils import save_image
from model import Generator
import numpy as np

app = FastAPI()

# Configuration
latent_dim = 100
num_classes = 3
img_channels = 3
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Model path: resolve relative to this file so it works regardless of CWD
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'final_generator.pth')

# Load Model
model = Generator(latent_dim, num_classes, img_channels).to(device)
_model_loaded = False
try:
    if not os.path.isfile(MODEL_PATH):
        raise FileNotFoundError(f'Model file not found: {MODEL_PATH}')
    state_dict = torch.load(MODEL_PATH, map_location=device)
    # Handle checkpoints saved with DataParallel (keys prefixed with "module.")
    if list(state_dict.keys())[0].startswith('module.'):
        state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}
    model.load_state_dict(state_dict, strict=True)
    model.eval()
    _model_loaded = True
    print('Model loaded successfully.')
except Exception as e:
    traceback.print_exc()
    print(f'Error loading model: {e}. Generation will fail until the model file is available at {MODEL_PATH}')

class GenerateRequest(BaseModel):
    class_idx: int
    num_images: int = 1

@app.post('/generate')
async def generate_images(request: GenerateRequest):
    if not _model_loaded:
        raise HTTPException(
            status_code=503,
            detail=f'Model not loaded. Ensure final_generator.pth exists at {MODEL_PATH}'
        )
    if request.class_idx < 0 or request.class_idx >= num_classes:
        raise HTTPException(status_code=400, detail='Invalid class index')
    
    num_imgs = min(max(1, request.num_images), 8)
    
    try:
        with torch.no_grad():
            noise = torch.randn(num_imgs, latent_dim, 1, 1).to(device)
            labels = torch.full((num_imgs,), request.class_idx, dtype=torch.long).to(device)
            fake_images = model(noise, labels)
            
            # Convert to grid and save to buffer
            buf = io.BytesIO()
            save_image(fake_images, buf, format='PNG', normalize=True)
            byte_im = buf.getvalue()
            
            # Encode to base64
            base64_im = base64.b64encode(byte_im).decode('utf-8')
            
            return {
                'status': 'success',
                'image_base64': base64_im,
                'class_idx': request.class_idx
            }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
