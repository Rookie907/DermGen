from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import io
import base64
from torchvision.utils import save_image
from model import Generator
import numpy as np

app = FastAPI()

# Configuration
latent_dim = 100
num_classes = 3
img_channels = 3
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load Model
model = Generator(latent_dim, num_classes, img_channels).to(device)
try:
    model.load_state_dict(torch.load('final_generator.pth', map_location=device))
    model.eval()
    print('Model loaded successfully.')
except Exception as e:
    print(f'Error loading model: {e}')

class GenerateRequest(BaseModel):
    class_idx: int
    num_images: int = 1

@app.post('/generate')
async def generate_images(request: GenerateRequest):
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
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
