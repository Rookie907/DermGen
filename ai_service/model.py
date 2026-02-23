#model.py
import torch
import torch.nn as nn
from torchvision.utils import save_image
import os
import random
 
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
 
# ===== YOUR GENERATOR =====
class Generator(nn.Module):
    def __init__(self, latent_dim, num_classes, img_channels):
        super().__init__()
        self.label_embed = nn.Embedding(num_classes, num_classes)
        self.net = nn.Sequential(
            nn.ConvTranspose2d(latent_dim + num_classes, 512, 4, 1, 0),
            nn.BatchNorm2d(512),
            nn.ReLU(True),
            nn.ConvTranspose2d(512, 256, 4, 2, 1),
            nn.BatchNorm2d(256),
            nn.ReLU(True),
            nn.ConvTranspose2d(256, 128, 4, 2, 1),
            nn.BatchNorm2d(128),
            nn.ReLU(True),
            nn.ConvTranspose2d(128, 64, 4, 2, 1),
            nn.BatchNorm2d(64),
            nn.ReLU(True),
            nn.ConvTranspose2d(64, 32, 4, 2, 1),
            nn.BatchNorm2d(32),
            nn.ReLU(True),
            nn.ConvTranspose2d(32, 16, 4, 2, 1),
            nn.BatchNorm2d(16),
            nn.ReLU(True),
            nn.Conv2d(16, img_channels, 3, 1, 1),
            nn.Tanh()
        )
 
    def forward(self, noise, labels):
        # make sure labels are long tensor
        labels = labels.long()
        label_embedding = self.label_embed(labels).unsqueeze(2).unsqueeze(3)
        x = torch.cat([noise, label_embedding], dim=1)
        return self.net(x)
 
# ===== LOAD MODEL FUNCTION =====
def load_generator():
    LATENT_DIM = 100
    NUM_CLASSES = 3
    IMG_CHANNELS = 3
 
    model = Generator(LATENT_DIM, NUM_CLASSES, IMG_CHANNELS).to(device)
 
    # Absolute path to weights
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    WEIGHTS_PATH = os.path.join(BASE_DIR, "weights", "generator.pth")
 
    if not os.path.exists(WEIGHTS_PATH):
        raise FileNotFoundError(f"Generator weights not found at {WEIGHTS_PATH}")
 
    model.load_state_dict(torch.load(WEIGHTS_PATH, map_location=device))
    model.eval()
    return model
 
# ===== IMAGE GENERATION FUNCTION =====
def generate_images(disease_class: int, count: int):
    # Load model only once
    global generator
    if "generator" not in globals():
        generator = load_generator()
 
    LATENT_DIM = 100  # must match generator
 
    # Create output folder
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
 
    paths = []
    for i in range(count):
        noise = torch.randn(1, LATENT_DIM, 1, 1).to(device)
        label = torch.tensor([disease_class]).to(device)
        with torch.no_grad():
            img = generator(noise, label)
        path = os.path.join(OUTPUT_DIR, f"img_{random.randint(0,999999)}.png")
        save_image((img + 1) / 2, path)
        paths.append(path)
    return paths