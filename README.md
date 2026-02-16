# DermaGen – Conditional GAN Web Platform for Rare Skin Lesion Image Synthesis

A full-stack React + Node + AI microservice application that generates synthetic skin lesion images using a trained Conditional GAN model.

## Architecture

```
Frontend (React + Tailwind)
         |
         | REST API
         |
Backend (Node.js + Express)
         |
         | HTTP call
         |
AI Service (Python + FastAPI)
         |
Conditional GAN (PyTorch)
         |
Generated Images
```

## Features

- **Generate Page**: Create synthetic skin lesion images for 7 different disease classes
- **Compare Page**: Side-by-side comparison of real vs synthetic images
- **Dataset Page**: Browse real dermatological training data
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **RESTful API**: Clean separation between frontend, backend, and AI service

## Disease Classes Supported

1. **AKIEC** - Actinic Keratoses and Intraepithelial Carcinoma
2. **BCC** - Basal Cell Carcinoma
3. **BKL** - Benign Keratosis-like Lesions
4. **DF** - Dermatofibroma
5. **MEL** - Melanoma
6. **NV** - Melanocytic Nevi
7. **VASC** - Vascular Lesions

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express
- Axios

### AI Service
- Python 3.9+
- FastAPI
- PyTorch
- Pillow
- NumPy

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn**
- **pip** (Python package manager)

## Installation & Setup

### 1. Clone or Extract the Project

Navigate to the project directory:

```bash
cd dermagen
```

### 2. Setup Backend (Node.js + Express)

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

You should see:
```
🚀 Server is running on http://localhost:5000
```

Keep this terminal running.

### 3. Setup AI Service (Python + FastAPI)

Open a new terminal and navigate to the AI service folder:

```bash
cd ai_service
```

Create a virtual environment (recommended):

```bash
python -m venv venv
```

Activate the virtual environment:

#### On macOS/Linux:
```bash
source venv/bin/activate
```

#### On Windows:
```bash
venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI service:

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

The AI service will use a randomly initialized generator if no pre-trained model is available.

Keep this terminal running.

### 4. Setup Frontend (React + Vite)

Open a new terminal and navigate to the project root:

```bash
cd frontend
```

Or if you're in the project root, the frontend is the main directory.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

You should see:
```
VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to `http://localhost:5173`

## Usage

### Generating Images

1. Navigate to the **Generate** page from the navigation bar
2. Select a disease class from the dropdown (e.g., AKIEC, BCC, MEL)
3. Enter the number of images to generate (1-20)
4. Click "Generate Images"
5. Wait for the AI service to generate the images
6. View and download the generated images

### Comparing Images

1. Navigate to the **Compare** page
2. Select a disease class to compare
3. View real dataset images side-by-side with synthetic examples

### Browsing Dataset

1. Navigate to the **Dataset** page
2. Filter by disease class
3. Browse through real training images

## API Endpoints

### Backend API (Port 5000)

#### Generate Images
```http
POST /api/generate
Content-Type: application/json

{
  "class": "AKIEC",
  "count": 5
}
```

Response:
```json
{
  "success": true,
  "images": [
    "/synthetic/akiec_1_1234.png",
    "/synthetic/akiec_2_5678.png"
  ]
}
```

#### Get Generated Images
```http
GET /api/images?class=AKIEC
```

#### Health Check
```http
GET /health
```

### AI Service API (Port 8000)

#### Generate Images
```http
POST /generate
Content-Type: application/json

{
  "class": "MEL",
  "count": 3
}
```

#### Health Check
```http
GET /health
```

#### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## Project Structure

```
dermagen/
│
├── frontend/                 # React frontend (current directory)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ImageCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Generate.jsx
│   │   │   ├── Compare.jsx
│   │   │   └── Dataset.jsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js + Express backend
│   ├── controllers/
│   │   └── generateController.js
│   ├── store/
│   │   └── imageStore.js     # In-memory image metadata
│   ├── routes/
│   │   └── generate.js
│   ├── public/
│   │   └── synthetic/       # Generated images stored here
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── ai_service/               # Python FastAPI AI service
│   ├── model/
│   │   ├── cgan.py          # GAN architecture
│   │   └── generator.pt     # Pre-trained model weights
│   ├── synthetic/           # Generated images
│   ├── main.py              # FastAPI app
│   ├── generate.py          # Image generation logic
│   └── requirements.txt
│
└── README.md
```

## Training Your Own Model

The provided generator uses a randomly initialized model. To train your own Conditional GAN:

1. Prepare a dataset of skin lesion images organized by class
2. Implement training loop in a new file (e.g., `train.py`)
3. Train the model and save weights to `ai_service/model/generator.pt`
4. Restart the AI service to load the new model

Example model saving:
```python
torch.save(generator.state_dict(), 'model/generator.pt')
```

## Troubleshooting

### AI Service Connection Issues

**Error**: `AI service is not available`

**Solution**:
1. Ensure the FastAPI service is running on port 8000
2. Check if port 8000 is available
3. Verify the AI service URL in `backend/.env`

### Port Already in Use

**Error**: `Port XXXX is already in use`

**Solution**:
```bash
# Find and kill the process using the port
lsof -ti:5000 | xargs kill  # Backend
lsof -ti:8000 | xargs kill  # AI Service
lsof -ti:5173 | xargs kill  # Frontend
```

### Python Package Installation Issues

**Error**: Issues installing PyTorch

**Solution**: Install PyTorch separately first:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### CORS Issues

If you encounter CORS errors, ensure:
1. Backend has CORS enabled (already configured)
2. AI service has CORS middleware (already configured)
3. Requests are made to correct URLs

## Performance Notes

- Initial image generation may take 2-5 seconds per image
- GPU acceleration will significantly speed up generation
- Image metadata is kept in memory (resets on server restart)
- Generated images are stored in `backend/public/synthetic/`

## Development Tips

### Running in Development Mode

All three services support hot-reload during development:

- **Frontend**: Vite provides instant HMR
- **Backend**: Use `npm run dev` with nodemon
- **AI Service**: Use `--reload` flag with uvicorn

### Debugging

Enable debug logs:

**Backend**:
```javascript
console.log('Debug info:', data);
```

**AI Service**:
```python
print(f"Debug: {variable}")
```

## Production Deployment

For production deployment:

1. **Frontend**: Build optimized bundle
   ```bash
   npm run build
   ```

2. **Backend**: Use PM2 or similar process manager
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

3. **AI Service**: Use Gunicorn with uvicorn workers
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

4. **Environment Variables**: Set appropriate production URLs and secrets

## License

MIT License - feel free to use this project for educational and research purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `http://localhost:8000/docs`
3. Check terminal logs for detailed error messages

## Acknowledgments

- Built with React, Node.js, Express, FastAPI, and PyTorch
- Inspired by medical imaging research and GANs for data augmentation
- Uses Conditional GAN architecture for class-specific image generation
