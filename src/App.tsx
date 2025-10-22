import { useEffect, useState, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { supabase, type LLMModel } from './lib/supabase';
import ModelCard from './components/ModelCard';
import FilterPanel from './components/FilterPanel';
import DownloadModal from './components/DownloadModal';

function App() {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<LLMModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [selectedLicenseTypes, setSelectedLicenseTypes] = useState<string[]>([]);
  const [selectedHostingTypes, setSelectedHostingTypes] = useState<string[]>([]);
  const [selectedOCI, setSelectedOCI] = useState<string[]>([]);
  const [productionOnly, setProductionOnly] = useState(false);

  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null);

  // Fetch models from Supabase
  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('llm_models')
        .select('*')
        .order('release_date', { ascending: false });

      if (error) throw error;

      setModels(data || []);
      setFilteredModels(data || []);
    } catch (error) {
      console.error('Error loading models:', error);
      setErrorMessage('Failed to load models. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...models];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.provider.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query)
      );
    }

    if (selectedModalities.length) {
      filtered = filtered.filter((model) =>
        selectedModalities.every((m) => model.modality.includes(m))
      );
    }

    if (selectedLicenseTypes.length) {
      filtered = filtered.filter((model) =>
        selectedLicenseTypes.includes(model.license_type)
      );
    }

    if (selectedHostingTypes.length) {
      filtered = filtered.filter((model) =>
        selectedHostingTypes.some((t) => model.hosting_type.includes(t))
      );
    }

    if (selectedOCI.length) {
      filtered = filtered.filter((model) =>
        selectedOCI.some((oci) => model.oci_availability.includes(oci))
      );
    }

    if (productionOnly) {
      filtered = filtered.filter((model) => model.is_production_ready);
    }

    setFilteredModels(filtered);
  }, [
    models,
    searchQuery,
    selectedModalities,
    selectedLicenseTypes,
    selectedHostingTypes,
    selectedOCI,
    productionOnly,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle download modal
  const handleDownload = (model: LLMModel) => {
    setSelectedModel(model);
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f004d] via-[#7b1fa2] to-[#ff4081] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white font-medium text-sm sm:text-base">Loading models...</p>
        </div>
      </div>
    );
  }

  // Error UI
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-100 flex items-center justify-center">
        <p className="text-red-600 font-medium text-sm sm:text-base">{errorMessage}</p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f004d] via-[#7b1fa2] to-[#ff4081] pt-6 font-sans">
      {/* Header */}
      <header className="px-4 sm:px-10 md:px-20 lg:px-36 py-4 sm:py-6 flex justify-between items-center">
        <img src="/dwlogo.png" className="h-6 sm:h-8" alt="DeepWeaver" />
        <img src="/OracleVector.png" className="h-4 sm:h-5" alt="Oracle" />
      </header>

      <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-36 pb-4">
        <hr className="border-white/30" />
      </div>

      {/* Page Title */}
      <div className="mt-4 sm:mt-6 ml-4 sm:ml-10 md:ml-20 lg:ml-36">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/dwicon.png" className="h-5 sm:h-8" alt="LLM Icon" />
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide">
            LLM Model Selector
          </h1>
        </div>
        <p className="text-white/80 text-xs sm:text-sm md:text-lg mt-1 sm:mt-2 font-light">
          Find and compare <span className="font-semibold">the best production-ready LLMs</span>
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-10 md:px-20 lg:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Filters */}
          <aside className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-lg border border-white/20">
            <FilterPanel
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedModalities={selectedModalities}
              setSelectedModalities={setSelectedModalities}
              selectedLicenseTypes={selectedLicenseTypes}
              setSelectedLicenseTypes={setSelectedLicenseTypes}
              selectedHostingTypes={selectedHostingTypes}
              setSelectedHostingTypes={setSelectedHostingTypes}
              selectedOCI={selectedOCI}
              setSelectedOCI={setSelectedOCI}
              productionOnly={productionOnly}
              setProductionOnly={setProductionOnly}
              totalResults={filteredModels.length}
            />
          </aside>

          {/* Models List */}
          <section className="lg:col-span-3">
            {filteredModels.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg border border-white/20 text-center">
                <p className="text-white/80 text-sm sm:text-base font-medium">No models found.</p>
                <p className="text-white/50 text-xs sm:text-sm mt-1">Try adjusting filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filteredModels.map((model) => (
                  <ModelCard key={model.id} model={model} onDownload={handleDownload} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Download Modal */}
      {selectedModel && (
        <DownloadModal model={selectedModel} onClose={() => setSelectedModel(null)} />
      )}
    </div>
  );
}

export default App;
