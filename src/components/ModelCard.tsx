import { Download, ExternalLink, Cpu, Database, Zap, Clock, Calendar } from 'lucide-react';
import type { LLMModel } from '../lib/supabase';

interface ModelCardProps {
  model: LLMModel;
  onDownload: (model: LLMModel) => void;
}

export default function ModelCard({ model, onDownload }: ModelCardProps) {
  const hasDownloadable = model.model_id !== null;

  const getModalityColor = (modality: string) => {
    const colors: Record<string, string> = {
      text: 'bg-blue-100 text-blue-800',
      vision: 'bg-green-100 text-green-800',
      audio: 'bg-orange-100 text-orange-800',
      realtime: 'bg-red-100 text-red-800',
    };
    return colors[modality] || 'bg-gray-100 text-gray-800';
  };

  const getLicenseColor = (license: string) => {
    const colors: Record<string, string> = {
      open_source: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      open_weights: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      closed_source: 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return colors[license] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatLicenseType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatOCI = (oci: string) => {
    return oci === 'generative_ai' ? 'Generative AI' : 'Data Science';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{model.name}</h3>
              {model.is_production_ready && (
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                  Production Ready
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">{model.provider}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${getLicenseColor(model.license_type)}`}>
            {formatLicenseType(model.license_type)}
          </div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">{model.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {model.modality.map((mod) => (
            <span
              key={mod}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getModalityColor(mod)}`}
            >
              {mod.charAt(0).toUpperCase() + mod.slice(1)}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-100">
          {model.parameters && (
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Parameters</p>
                <p className="text-sm font-bold text-gray-900">{model.parameters}</p>
              </div>
            </div>
          )}
          {model.context_window && (
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Context Window</p>
                <p className="text-sm font-bold text-gray-900">{model.context_window.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {model.oci_availability.length > 0 && !model.oci_availability.includes('none') && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              OCI Availability
            </p>
            <div className="flex flex-wrap gap-2">
              {model.oci_availability.map((oci) => (
                <span
                  key={oci}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200"
                >
                  {formatOCI(oci)}
                </span>
              ))}
            </div>
          </div>
        )}

        {model.best_gpu.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Recommended GPUs</p>
            <div className="flex flex-wrap gap-2">
              {model.best_gpu.slice(0, 3).map((gpu) => (
                <span
                  key={gpu}
                  className="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200"
                >
                  {gpu.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {Object.keys(model.performance_metrics).length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Performance Benchmarks</p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(model.performance_metrics).slice(0, 3).map(([key, value]) => (
                <div key={key} className="text-center">
                  <p className="text-xs text-gray-600 uppercase font-medium">{key}</p>
                  <p className="text-base font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {model.pricing && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 font-medium">Pricing:</span>
            <span className="text-gray-900 font-semibold">{model.pricing}</span>
          </div>
        )}

        {model.release_date && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 font-medium">Released:</span>
            <span className="text-gray-900 font-semibold">
              {new Date(model.release_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        )}

        <div className="flex gap-2 mt-5">
          {hasDownloadable && (
            <button
              onClick={() => onDownload(model)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Model
            </button>
          )}
          {model.model_card_url && (
            <a
              href={model.model_card_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 ${
                hasDownloadable ? 'flex-shrink-0' : 'flex-1'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              Model Card
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
