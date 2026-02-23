import { useState } from 'react';
import JSZip from 'jszip';
import { Database, Download, Plus, ImageIcon } from 'lucide-react';
import ImageCard from '../components/ImageCard';
import { useImageContext } from '../context/ImageContext';

const DISEASE_CLASSES = [
  { value: 'AKIEC', label: 'AKIEC', description: 'Actinic Keratoses and Intraepithelial Carcinoma' },
  { value: 'DF', label: 'DF', description: 'Dermatofibroma' },
  { value: 'VASC', label: 'VASC', description: 'Vascular Lesions' }
];

// Fallback sample images when no local images exist for a class
const FALLBACK_SAMPLE_IMAGES = {
  AKIEC: [
    'https://images.pexels.com/photos/5858835/pexels-photo-5858835.jpeg?w=300',
    'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?w=300',
    'https://images.pexels.com/photos/7659566/pexels-photo-7659566.jpeg?w=300',
    'https://images.pexels.com/photos/5858836/pexels-photo-5858836.jpeg?w=300'
  ],
  DF: [
    'https://images.pexels.com/photos/5858838/pexels-photo-5858838.jpeg?w=300',
    'https://images.pexels.com/photos/7659571/pexels-photo-7659571.jpeg?w=300',
    'https://images.pexels.com/photos/7659572/pexels-photo-7659572.jpeg?w=300',
    'https://images.pexels.com/photos/5858839/pexels-photo-5858839.jpeg?w=300'
  ],
  VASC: [
    'https://images.pexels.com/photos/5858841/pexels-photo-5858841.jpeg?w=300',
    'https://images.pexels.com/photos/7659577/pexels-photo-7659577.jpeg?w=300',
    'https://images.pexels.com/photos/7659578/pexels-photo-7659578.jpeg?w=300',
    'https://images.pexels.com/photos/7659579/pexels-photo-7659579.jpeg?w=300'
  ]
};

// Load images from ../images directory (organized by class: images/AKIEC/, images/DF/, etc.)
const localImageModules = import.meta.glob('../images/*/*.{png,jpg,jpeg,svg}', { eager: true });
const LOCAL_IMAGES = {};
Object.keys(localImageModules).forEach((path) => {
  const parts = path.split('/');
  const className = parts[parts.length - 2];
  if (!LOCAL_IMAGES[className]) LOCAL_IMAGES[className] = [];
  LOCAL_IMAGES[className].push(localImageModules[path].default);
});

function dataURLToBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = (arr[0].match(/:(.*?);/) || [])[1] || 'image/png';
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new Blob([u8arr], { type: mime });
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Dataset() {
  const [selectedClass, setSelectedClass] = useState('AKIEC');
  const [includeGenerated, setIncludeGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { generatedImages, generatedClass } = useImageContext();

  const currentClass = DISEASE_CLASSES.find((cls) => cls.value === selectedClass);
  const datasetImages = (LOCAL_IMAGES[selectedClass]?.length && LOCAL_IMAGES[selectedClass]) || FALLBACK_SAMPLE_IMAGES[selectedClass] || [];
  const canIncludeGenerated = generatedImages.length > 0 && generatedClass === selectedClass;
  const generatedToShow = includeGenerated && canIncludeGenerated ? generatedImages : [];
  const displayImages = [
    ...datasetImages.map((src) => ({ src, isGenerated: false })),
    ...generatedToShow.map((src) => ({ src, isGenerated: true }))
  ];
  const totalCount = displayImages.length;

  const handleDownloadSingle = (src, filename) => {
    if (src.startsWith('data:')) {
      const blob = dataURLToBlob(src);
      triggerDownload(blob, filename);
    } else {
      fetch(src, { mode: 'cors' })
        .then((res) => res.blob())
        .then((blob) => triggerDownload(blob, filename))
        .catch(() => {
          const a = document.createElement('a');
          a.href = src;
          a.download = filename;
          a.target = '_blank';
          a.rel = 'noopener';
          a.click();
        });
    }
  };

  const handleDownloadDataset = async () => {
    if (totalCount === 0) return;
    setDownloading(true);
    const ext = displayImages[0]?.src?.startsWith('data:') ? 'png' : (displayImages[0]?.src?.match(/\.(jpe?g|png|gif|webp)/i)?.[1] || 'png');
    const zip = new JSZip();
    const zipFolder = zip.folder(`dataset_${selectedClass}`);

    try {
      for (let i = 0; i < displayImages.length; i++) {
        const { src } = displayImages[i];
        const filename = `${selectedClass}_${String(i + 1).padStart(3, '0')}.${ext}`;
        let blob;
        if (src.startsWith('data:')) {
          blob = dataURLToBlob(src);
        } else {
          try {
            const res = await fetch(src, { mode: 'cors' });
            blob = res.ok ? await res.blob() : null;
          } catch {
            blob = null;
          }
        }
        if (blob) zipFolder.file(filename, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipFilename = `dataset_${selectedClass}.zip`;
      triggerDownload(zipBlob, zipFilename);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-3 rounded-full bg-white/80 shadow-sm px-5 py-2 border border-purple-100">
            <Database className="text-purple-600" size={28} />
            <span className="text-sm font-medium text-purple-700">Training Dataset</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Dataset Browser
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Browse and download real dermatological samples by class. Optionally include your generated images in the dataset view and download.
          </p>
        </header>

        {/* Class selector + options */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Filter by disease class
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {DISEASE_CLASSES.map((cls) => (
              <button
                key={cls.value}
                onClick={() => setSelectedClass(cls.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedClass === cls.value
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cls.label}
              </button>
            ))}
          </div>
          <p className="text-gray-600 text-sm mb-4">{currentClass?.description}</p>

          {/* Include generated images */}
          {generatedImages.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeGenerated}
                  onChange={(e) => setIncludeGenerated(e.target.checked)}
                  disabled={!canIncludeGenerated}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <Plus size={18} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  Add generated images to this dataset
                </span>
              </label>
              {!canIncludeGenerated && generatedClass && (
                <span className="text-xs text-gray-500">
                  (Generated images are for <strong>{generatedClass}</strong>. Select {generatedClass} to include them.)
                </span>
              )}
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total images</p>
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Resolution</p>
            <p className="text-2xl font-bold text-gray-900">128x128</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Format</p>
            <p className="text-2xl font-bold text-gray-900">PNG</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Source</p>
            <p className="text-lg font-bold text-gray-900">
              {includeGenerated && canIncludeGenerated ? 'Dataset + Generated' : 'Dataset'}
            </p>
          </div>
        </section>

        {/* Download dataset + sample grid */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Sample images
                <span className="text-gray-500 font-normal ml-2">({totalCount})</span>
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {datasetImages.length} from dataset
                {includeGenerated && canIncludeGenerated && ` · ${generatedToShow.length} generated`}
              </p>
            </div>
            <button
              onClick={handleDownloadDataset}
              disabled={totalCount === 0 || downloading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {downloading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Downloading…
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download whole dataset
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayImages.map((item, index) => (
              <div key={index} className="relative">
                <ImageCard
                  src={item.src}
                  label={item.isGenerated ? `${selectedClass} Generated ${index - datasetImages.length + 1}` : `${selectedClass} Sample ${index + 1}`}
                  onDownload={() =>
                    handleDownloadSingle(
                      item.src,
                      `${selectedClass}_${String(index + 1).padStart(3, '0')}.png`
                    )
                  }
                />
                {item.isGenerated && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-xs font-medium flex items-center gap-1">
                    <ImageIcon size={12} />
                    Generated
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
