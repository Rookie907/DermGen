import { useState, useEffect } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';

const DISEASE_CLASSES = ['AKIEC', 'BCC', 'BKL', 'DF', 'MEL', 'NV', 'VASC'];

const FALLBACK_IMAGES = {
  AKIEC: 'https://images.pexels.com/photos/5858835/pexels-photo-5858835.jpeg?w=300',
  BCC: 'https://images.pexels.com/photos/5858836/pexels-photo-5858836.jpeg?w=300',
  BKL: 'https://images.pexels.com/photos/5858837/pexels-photo-5858837.jpeg?w=300',
  DF: 'https://images.pexels.com/photos/5858838/pexels-photo-5858838.jpeg?w=300',
  MEL: 'https://images.pexels.com/photos/5858839/pexels-photo-5858839.jpeg?w=300',
  NV: 'https://images.pexels.com/photos/5858840/pexels-photo-5858840.jpeg?w=300',
  VASC: 'https://images.pexels.com/photos/5858841/pexels-photo-5858841.jpeg?w=300'
};

// Import all images from ../images directory
const localImageModules = import.meta.glob('../images/*/*.{png,jpg,jpeg,svg}', { eager: true });

// Organize images by class
const LOCAL_IMAGES = {};

Object.keys(localImageModules).forEach((path) => {
  const parts = path.split('/');
  const className = parts[parts.length - 2];

  if (!LOCAL_IMAGES[className]) {
    LOCAL_IMAGES[className] = [];
  }

  LOCAL_IMAGES[className].push(localImageModules[path].default);
});

export default function Compare() {
  const [selectedClass, setSelectedClass] = useState('AKIEC');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { generatedImages } = useImageContext();

  // Get images for the selected class
  const classImages = LOCAL_IMAGES[selectedClass]?.length
    ? LOCAL_IMAGES[selectedClass]
    : [FALLBACK_IMAGES[selectedClass]];

  const currentImage = classImages[currentImageIndex] || classImages[0];

  // Reset index when class changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedClass]);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % classImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + classImages.length) % classImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Compare Real vs Synthetic
          </h1>
          <p className="text-gray-600">
            Side-by-side comparison of real and AI-generated images
          </p>
        </div>

        {/* Class Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Disease Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {DISEASE_CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Section */}
        <div className="grid md:grid-cols-2 gap-8 justify-items-center">

          {/* REAL IMAGE CARD */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Real Image</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Original
              </span>
            </div>

            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative group">
              <img
                src={currentImage}
                alt={`Real ${selectedClass}`}
                className="w-full h-full object-cover"
              />

              {classImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} className="text-gray-800" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} className="text-gray-800" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    {currentImageIndex + 1} / {classImages.length}
                  </div>
                </>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Source: {LOCAL_IMAGES[selectedClass]?.length ? 'Training Dataset (Local)' : 'Training Dataset (Remote)'}</p>
              <p>Class: {selectedClass}</p>
            </div>
          </div>

          {/* SYNTHETIC IMAGE CARD */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Synthetic Image</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Generated
              </span>
            </div>

            {generatedImages.length > 0 ? (
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={
                    generatedImages[0].startsWith('data:')
                      ? generatedImages[0]
                      : `http://localhost:5000${generatedImages[0]}`
                  }
                  alt={`Synthetic`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <RefreshCw size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Generate images in the Generate page</p>
                  <p className="text-sm">to compare with real samples</p>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Source: Conditional GAN</p>
              <p>Class: {selectedClass}</p>
            </div>
          </div>

        </div>

        {/* Metrics Section */}
        {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Comparison Metrics
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 mb-1">Visual Similarity</p>
              <p className="text-2xl font-bold text-blue-600">92%</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 mb-1">Feature Accuracy</p>
              <p className="text-2xl font-bold text-blue-600">88%</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 mb-1">Realism Score</p>
              <p className="text-2xl font-bold text-blue-600">90%</p>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
}
