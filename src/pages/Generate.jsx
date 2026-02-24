import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import ImageCard from '../components/ImageCard';
import axios from 'axios';
import { useImageContext } from "../context/ImageContext";

const DISEASE_CLASSES = [
  { value: 'AKIEC', label: 'AKIEC - Actinic Keratoses' },
  { value: 'DF', label: 'DF - Dermatofibroma' },
  { value: 'VASC', label: 'VASC - Vascular Lesions' }
];

export default function Generate() {
  const [selectedClass, setSelectedClass] = useState('AKIEC');
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const { generatedImages, setGeneratedImages, setGeneratedClass } = useImageContext();
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (count < 1 || count > 20) {
      setError('Please enter a number between 1 and 20');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImages([]);

    try {
      const response = await axios.post('http://localhost:5000/api/generate', {
        class: selectedClass,
        count: parseInt(count)
      });

      const images = response.data?.images || [];
      setGeneratedImages(images);
      setGeneratedClass(selectedClass);

    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Failed to generate images. Make sure backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageDataUri, index) => {
    const link = document.createElement('a');
    link.href = imageDataUri;
    link.download = `${selectedClass}_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Generate Synthetic Images
          </h1>
          <p className="text-gray-600">
            Create synthetic skin lesion images using conditional GAN
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disease Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {DISEASE_CLASSES.map((cls) => (
                <option key={cls.value} value={cls.value}>
                  {cls.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Images
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter number of images (1-20)"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Images
              </>
            )}
          </button>
        </div>

        {generatedImages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Generated Results ({generatedImages.length} images)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {generatedImages.map((imageDataUri, index) => (
                <ImageCard
                  key={index}
                  src={imageDataUri}
                  label={`${selectedClass} #${index + 1}`}
                  onDownload={() => handleDownload(imageDataUri, index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}