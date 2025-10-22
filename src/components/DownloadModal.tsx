import { X, Download, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useState } from 'react';
import type { LLMModel } from '../lib/supabase';

interface DownloadModalProps {
  model: LLMModel;
  onClose: () => void;
}

export default function DownloadModal({ model, onClose }: DownloadModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDownload = async () => {
    if (!model.model_id) return;

    setIsDownloading(true);
    setDownloadStatus('downloading');
    setErrorMessage('');

    try {
      const response = await fetch(`https://huggingface.co/${model.model_id}/resolve/main/config.json`);

      if (!response.ok) {
        throw new Error('Failed to fetch model configuration');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${model.model_id.replace('/', '_')}_config.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadStatus('success');

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus('error');
      setErrorMessage('Failed to download model. Please try accessing the model directly on Hugging Face.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getDownloadCommand = () => {
    if (!model.model_id) return '';
    return `# Using Hugging Face CLI
huggingface-cli download ${model.model_id}

# Or using Python transformers
from transformers import AutoModel, AutoTokenizer
model = AutoModel.from_pretrained("${model.model_id}")
tokenizer = AutoTokenizer.from_pretrained("${model.model_id}")`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Download Model</h2>
            <p className="text-sm text-gray-600 mt-1">{model.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isDownloading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {downloadStatus === 'idle' && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Model Information</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><span className="font-medium">Model ID:</span> {model.model_id}</p>
                  <p><span className="font-medium">Provider:</span> {model.provider}</p>
                  <p><span className="font-medium">License:</span> {model.license_type.replace(/_/g, ' ')}</p>
                  {model.parameters && (
                    <p><span className="font-medium">Size:</span> {model.parameters}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Download Options</h3>

                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-mono">Command Line</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getDownloadCommand());
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="text-xs text-gray-100 font-mono whitespace-pre-wrap">
                    {getDownloadCommand()}
                  </pre>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Requirements
                  </h4>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>Hugging Face account and authentication token</li>
                    <li>Sufficient disk space for model files</li>
                    {model.best_gpu.length > 0 && (
                      <li>Recommended GPU: {model.best_gpu[0].replace(/_/g, ' ')}</li>
                    )}
                    <li>Python 3.8+ and transformers library</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download Config
                </button>
                <a
                  href={`https://huggingface.co/${model.model_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Visit Hugging Face
                </a>
              </div>
            </>
          )}

          {downloadStatus === 'downloading' && (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Downloading...</h3>
              <p className="text-sm text-gray-600">Fetching model configuration from Hugging Face</p>
            </div>
          )}

          {downloadStatus === 'success' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Download Complete!</h3>
              <p className="text-sm text-gray-600">Model configuration downloaded successfully</p>
            </div>
          )}

          {downloadStatus === 'error' && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Download Failed</h3>
              <p className="text-sm text-gray-600 mb-4">{errorMessage}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setDownloadStatus('idle');
                    setErrorMessage('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
                <a
                  href={`https://huggingface.co/${model.model_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open on Hugging Face
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
