import axios from 'axios';
import { addImages, getImages } from '../store/imageStore.js';

export const generateImages = async (req, res) => {
  try {
    const { class: diseaseClass, count } = req.body;

    if (!diseaseClass || !count) {
      return res.status(400).json({ error: 'Disease class and count are required' });
    }

    const validClasses = ['AKIEC', 'BCC', 'BKL', 'DF', 'MEL', 'NV', 'VASC'];
    if (!validClasses.includes(diseaseClass)) {
      return res.status(400).json({ error: 'Invalid disease class' });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({ error: 'Count must be between 1 and 20' });
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    
    // Map disease class to class index (AI service only supports 3 classes: 0, 1, 2)
    // For now, map first 3 classes: AKIEC=0, BCC=1, BKL=2
    const classMap = { 'AKIEC': 0, 'BCC': 1, 'BKL': 2, 'DF': 0, 'MEL': 1, 'NV': 2, 'VASC': 0 };
    const classIdx = classMap[diseaseClass] ?? 0;
    
    const response = await axios.post(`${aiServiceUrl}/generate`, {
      class_idx: classIdx,
      num_images: parseInt(count)
    }, {
      timeout: 60000
    });

    // AI service returns base64 image, convert to file paths
    // For now, return the base64 data URI so frontend can display it
    // In production, you'd save the image to disk and return paths
    const base64Image = response.data.image_base64;
    const imageDataUri = `data:image/png;base64,${base64Image}`;
    
    // Store metadata (using data URI as path for now)
    const imageRecords = [{
      class: diseaseClass,
      path: imageDataUri
    }];
    addImages(imageRecords);

    res.json({
      success: true,
      images: [imageDataUri]
    });

  } catch (error) {
    console.error('Error generating images:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'AI service is not available. Please ensure the FastAPI service is running on port 8000.'
      });
    }

    res.status(500).json({
      error: 'Failed to generate images',
      details: error.message
    });
  }
};

export const getImagesHandler = async (req, res) => {
  try {
    const { class: diseaseClass } = req.query;

    const filter = diseaseClass ? { class: diseaseClass } : {};
    const images = getImages(filter, 50);

    res.json({
      success: true,
      images
    });

  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).json({
      error: 'Failed to fetch images',
      details: error.message
    });
  }
};
