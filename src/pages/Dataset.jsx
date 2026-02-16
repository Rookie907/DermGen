import { useState } from 'react';
import { Database } from 'lucide-react';
import ImageCard from '../components/ImageCard';

const DISEASE_CLASSES = [
  { value: 'AKIEC', label: 'AKIEC', description: 'Actinic Keratoses and Intraepithelial Carcinoma' },
  { value: 'BCC', label: 'BCC', description: 'Basal Cell Carcinoma' },
  { value: 'BKL', label: 'BKL', description: 'Benign Keratosis-like Lesions' },
  { value: 'DF', label: 'DF', description: 'Dermatofibroma' },
  { value: 'MEL', label: 'MEL', description: 'Melanoma' },
  { value: 'NV', label: 'NV', description: 'Melanocytic Nevi' },
  { value: 'VASC', label: 'VASC', description: 'Vascular Lesions' }
];

const SAMPLE_DATASET_IMAGES = {
  AKIEC: [
    'https://images.pexels.com/photos/5858835/pexels-photo-5858835.jpeg?w=300',
    'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?w=300',
    'https://images.pexels.com/photos/7659566/pexels-photo-7659566.jpeg?w=300',
    'https://images.pexels.com/photos/5858836/pexels-photo-5858836.jpeg?w=300'
  ],
  BCC: [
    'https://images.pexels.com/photos/5858836/pexels-photo-5858836.jpeg?w=300',
    'https://images.pexels.com/photos/7659567/pexels-photo-7659567.jpeg?w=300',
    'https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?w=300',
    'https://images.pexels.com/photos/5858837/pexels-photo-5858837.jpeg?w=300'
  ],
  BKL: [
    'https://images.pexels.com/photos/5858837/pexels-photo-5858837.jpeg?w=300',
    'https://images.pexels.com/photos/7659569/pexels-photo-7659569.jpeg?w=300',
    'https://images.pexels.com/photos/7659570/pexels-photo-7659570.jpeg?w=300',
    'https://images.pexels.com/photos/5858838/pexels-photo-5858838.jpeg?w=300'
  ],
  DF: [
    'https://images.pexels.com/photos/5858838/pexels-photo-5858838.jpeg?w=300',
    'https://images.pexels.com/photos/7659571/pexels-photo-7659571.jpeg?w=300',
    'https://images.pexels.com/photos/7659572/pexels-photo-7659572.jpeg?w=300',
    'https://images.pexels.com/photos/5858839/pexels-photo-5858839.jpeg?w=300'
  ],
  MEL: [
    'https://images.pexels.com/photos/5858839/pexels-photo-5858839.jpeg?w=300',
    'https://images.pexels.com/photos/7659573/pexels-photo-7659573.jpeg?w=300',
    'https://images.pexels.com/photos/7659574/pexels-photo-7659574.jpeg?w=300',
    'https://images.pexels.com/photos/5858840/pexels-photo-5858840.jpeg?w=300'
  ],
  NV: [
    'https://images.pexels.com/photos/5858840/pexels-photo-5858840.jpeg?w=300',
    'https://images.pexels.com/photos/7659575/pexels-photo-7659575.jpeg?w=300',
    'https://images.pexels.com/photos/7659576/pexels-photo-7659576.jpeg?w=300',
    'https://images.pexels.com/photos/5858841/pexels-photo-5858841.jpeg?w=300'
  ],
  VASC: [
    'https://images.pexels.com/photos/5858841/pexels-photo-5858841.jpeg?w=300',
    'https://images.pexels.com/photos/7659577/pexels-photo-7659577.jpeg?w=300',
    'https://images.pexels.com/photos/7659578/pexels-photo-7659578.jpeg?w=300',
    'https://images.pexels.com/photos/7659579/pexels-photo-7659579.jpeg?w=300'
  ]
};

export default function Dataset() {
  const [selectedClass, setSelectedClass] = useState('AKIEC');

  const currentClass = DISEASE_CLASSES.find(cls => cls.value === selectedClass);
  const currentImages = SAMPLE_DATASET_IMAGES[selectedClass] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Database className="text-purple-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-900">
              Training Dataset
            </h1>
          </div>
          <p className="text-gray-600">
            Browse real dermatological images used to train the GAN model
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Disease Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {DISEASE_CLASSES.map((cls) => (
              <option key={cls.value} value={cls.value}>
                {cls.label} - {cls.description}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">{currentClass?.label}</h2>
          <p className="text-purple-100 mb-4">{currentClass?.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-purple-100 mb-1">Total Images</p>
              <p className="text-2xl font-bold">{currentImages.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-purple-100 mb-1">Resolution</p>
              <p className="text-2xl font-bold">256x256</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-purple-100 mb-1">Format</p>
              <p className="text-2xl font-bold">JPG</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-purple-100 mb-1">Quality</p>
              <p className="text-2xl font-bold">High</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Sample Images ({currentImages.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentImages.map((imageSrc, index) => (
              <ImageCard
                key={index}
                src={imageSrc}
                label={`${selectedClass} Sample ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
