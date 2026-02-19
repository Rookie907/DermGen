import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, latent_dim, num_classes, img_channels):
        super(Generator, self).__init__()
        self.label_emb = nn.Embedding(num_classes, num_classes)

        self.main = nn.Sequential(
            # Input is (latent_dim + num_classes) x 1 x 1
            nn.ConvTranspose2d(latent_dim + num_classes, 512, 4, 1, 0, bias=False),
            nn.BatchNorm2d(512),
            nn.ReLU(True),
            # state size. 512 x 4 x 4
            nn.ConvTranspose2d(512, 256, 4, 2, 1, bias=False),
            nn.BatchNorm2d(256),
            nn.ReLU(True),
            # state size. 256 x 8 x 8
            nn.ConvTranspose2d(256, 128, 4, 2, 1, bias=False),
            nn.BatchNorm2d(128),
            nn.ReLU(True),
            # state size. 128 x 16 x 16
            nn.ConvTranspose2d(128, 64, 4, 2, 1, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU(True),
            # state size. 64 x 32 x 32
            nn.ConvTranspose2d(64, img_channels, 4, 2, 1, bias=False),
            nn.Tanh()
            # final state size. img_channels x 64 x 64
        )

    def forward(self, noise, labels):
        label_embedding = self.label_emb(labels)
        label_embedding = label_embedding.unsqueeze(2).unsqueeze(3)
        x = torch.cat([noise, label_embedding], dim=1)
        return self.main(x)

import torch
import os

# Configuration constants
LATENT_DIM = 100
NUM_CLASSES = 3
IMG_CHANNELS = 3
device = torch.device('cpu')

# Instantiate the new Generator
from model import Generator
model = Generator(LATENT_DIM, NUM_CLASSES, IMG_CHANNELS).to(device)

drive_weight_path = '/content/drive/MyDrive/cgan_output/final_generator.pth'
local_weight_path = 'final-generator.pth'

if os.path.exists(drive_weight_path):
    state_dict = torch.load(drive_weight_path, map_location=device)
    model.load_state_dict(state_dict)
    print('Architecture check passed: Weights successfully loaded into the 64px Generator model.')
    torch.save(model.state_dict(), local_weight_path)
    print(f'Success: Aligned weights saved locally to {local_weight_path}')
else:
    print(f'Error: Drive weight file not found.')
