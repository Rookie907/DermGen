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

    const baseUrl = (process.env.AI_SERVICE_URL || 'http://localhost:8000').replace(/\/generate\/?$/, '');
    const generateUrl = `${baseUrl}/generate`;

    // Map disease class to class index (AI service only supports 3 classes: 0, 1, 2)
    // For now, map first 3 classes: AKIEC=0, BCC=1, BKL=2
    const classMap = { 'AKIEC': 0, 'BCC': 1, 'BKL': 2, 'DF': 0, 'MEL': 1, 'NV': 2, 'VASC': 0 };
    const classIdx = classMap[diseaseClass] ?? 0;

    const response = await axios.post(generateUrl, {
      class_idx: classIdx,
      num_images: parseInt(count)
    }, {
      timeout: 60000
    });

    // AI service returns array of base64 images
    const imagesBase64 = response.data?.images_base64 || response.data?.image_base64;
    if (!imagesBase64) {
      return res.status(502).json({
        error: 'Invalid response from AI service',
        details: 'Missing images_base64 in response'
      });
    }

    // Handle both array response and single image (backward compatibility)
    const imageList = Array.isArray(imagesBase64) ? imagesBase64 : [imagesBase64];
    
    // Convert each base64 string to data URI
    const imageDataUris = imageList.map(base64Image => 
      `data:image/png;base64,${base64Image}`
    );
    
    // Store metadata for all images
    const imageRecords = imageDataUris.map(imageDataUri => ({
      class: diseaseClass,
      path: imageDataUri
    }));
    addImages(imageRecords);

    res.json({
      success: true,
      images: imageDataUris
    });

  } catch (error) {
    const aiDetail = error.response?.data?.detail;
    const message = error.response?.data?.detail || error.message;
    console.error('Error generating images:', message, aiDetail ? '(from AI service)' : '');

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'AI service is not available. Please ensure the FastAPI service is running on port 8000.'
      });
    }

    const status = error.response?.status ?? 500;
    res.status(status).json({
      error: 'Failed to generate images',
      details: message
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
