import { Download } from 'lucide-react';

export default function ImageCard({ src, label, onDownload }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {src ? (
          <img
            src={src}
            alt={label || 'Generated image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-4 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {onDownload && (
          <button
            onClick={onDownload}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Download image"
          >
            <Download size={18} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
