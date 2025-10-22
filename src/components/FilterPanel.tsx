import { Search, Filter, X } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedModalities: string[];
  setSelectedModalities: (modalities: string[]) => void;
  selectedLicenseTypes: string[];
  setSelectedLicenseTypes: (types: string[]) => void;
  selectedHostingTypes: string[];
  setSelectedHostingTypes: (types: string[]) => void;
  selectedOCI: string[];
  setSelectedOCI: (oci: string[]) => void;
  productionOnly: boolean;
  setProductionOnly: (value: boolean) => void;
  totalResults: number;
}

export default function FilterPanel({
  searchQuery,
  setSearchQuery,
  selectedModalities,
  setSelectedModalities,
  selectedLicenseTypes,
  setSelectedLicenseTypes,
  selectedHostingTypes,
  setSelectedHostingTypes,
  selectedOCI,
  setSelectedOCI,
  productionOnly,
  setProductionOnly,
  totalResults,
}: FilterPanelProps) {
  const modalities = ['text', 'vision', 'audio', 'realtime'];
  const licenseTypes = [
    { value: 'open_source', label: 'Open Source' },
    { value: 'open_weights', label: 'Open Weights' },
    { value: 'closed_source', label: 'Closed Source' },
  ];
  const hostingTypes = [
    { value: 'api_based', label: 'API Based' },
    { value: 'self_hosted', label: 'Self Hosted' },
  ];
  const ociOptions = [
    { value: 'generative_ai', label: 'Generative AI' },
    { value: 'data_science', label: 'Data Science' },
  ];

  const toggleFilter = (value: string, selected: string[], setter: (values: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedModalities([]);
    setSelectedLicenseTypes([]);
    setSelectedHostingTypes([]);
    setSelectedOCI([]);
    setProductionOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedModalities.length > 0 ||
    selectedLicenseTypes.length > 0 ||
    selectedHostingTypes.length > 0 ||
    selectedOCI.length > 0 ||
    productionOnly;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={productionOnly}
            onChange={(e) => setProductionOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            Production Ready Only
          </span>
        </label>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Modality</h3>
          <div className="space-y-2">
            {modalities.map((modality) => (
              <label key={modality} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedModalities.includes(modality)}
                  onChange={() => toggleFilter(modality, selectedModalities, setSelectedModalities)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize">
                  {modality}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-5 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">License Type</h3>
          <div className="space-y-2">
            {licenseTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedLicenseTypes.includes(type.value)}
                  onChange={() => toggleFilter(type.value, selectedLicenseTypes, setSelectedLicenseTypes)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-5 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Hosting</h3>
          <div className="space-y-2">
            {hostingTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedHostingTypes.includes(type.value)}
                  onChange={() => toggleFilter(type.value, selectedHostingTypes, setSelectedHostingTypes)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-5 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">OCI Availability</h3>
          <div className="space-y-2">
            {ociOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedOCI.includes(option.value)}
                  onChange={() => toggleFilter(option.value, selectedOCI, setSelectedOCI)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900 text-lg">{totalResults}</span>
            <span className="ml-1">models found</span>
          </p>
        </div>
      </div>
    </div>
  );
}
