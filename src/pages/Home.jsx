import { Brain, ImagePlus, Database, GitCompare } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            DermaGen
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Conditional GAN for Rare Skin Lesion Synthesis
          </p>
          <p className="text-lg text-gray-500">
            Generate synthetic dermatological images using deep learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Powered
            </h3>
            <p className="text-gray-600 text-sm">
              Uses Conditional GAN architecture to generate realistic skin lesions
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <ImagePlus className="text-cyan-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              7 Disease Classes
            </h3>
            <p className="text-gray-600 text-sm">
              Generate images for AKIEC, BCC, BKL, DF, MEL, NV, and VASC
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <GitCompare className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Compare Results
            </h3>
            <p className="text-gray-600 text-sm">
              Side-by-side comparison of real vs synthetic images
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Database className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dataset Browser
            </h3>
            <p className="text-gray-600 text-sm">
              Explore real dermatological training data by class
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What is a Conditional GAN?
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            A Conditional Generative Adversarial Network (cGAN) is a type of deep learning model that generates
            synthetic data conditioned on specific labels or attributes. In DermaGen, the model learns from real
            dermatological images to create new synthetic skin lesion images that match specific disease classes.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The system consists of two neural networks: a generator that creates synthetic images and a discriminator
            that evaluates their realism. Through adversarial training, the generator learns to produce increasingly
            realistic images that are virtually indistinguishable from real medical images.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Supported Disease Classes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <span className="font-semibold">AKIEC</span> - Actinic Keratoses and Intraepithelial Carcinoma
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <span className="font-semibold">BCC</span> - Basal Cell Carcinoma
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <span className="font-semibold">BKL</span> - Benign Keratosis-like Lesions
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <span className="font-semibold">DF</span> - Dermatofibroma
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <span className="font-semibold">MEL</span> - Melanoma
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <span className="font-semibold">NV</span> - Melanocytic Nevi
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <span className="font-semibold">VASC</span> - Vascular Lesions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
