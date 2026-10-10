import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Search, 
  Building2, 
  Phone, 
  ExternalLink, 
  Newspaper, 
  ShieldCheck, 
  Code2, 
  Check, 
  Key, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { searchSerpApi, fetchSerpApiNews } from '../services/api';
import { SerpApiNewsItem } from '../types';

interface SerpApiExplorerProps {
  currentCity: string;
  onClose?: () => void;
}

export const SerpApiExplorer: React.FC<SerpApiExplorerProps> = ({
  currentCity,
  onClose,
}) => {
  const [query, setQuery] = useState('Bhopal Municipal Corporation road repairs pothole helpline');
  const [activeTab, setActiveTab] = useState<'authorities' | 'news' | 'inspector'>('authorities');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [newsResults, setNewsResults] = useState<SerpApiNewsItem[]>([]);
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('serpapi_custom_key') || '');
  const [saveKeySuccess, setSaveKeySuccess] = useState(false);

  const sampleQueries = [
    'Bhopal Municipal Corporation PWD road repairs',
    'MP Nagar Bhopal Ward 42 corporator helpline',
    'Bhopal Jal Nigam water leakage complaint desk',
    'Swachh Bhopal garbage collection tracking portal',
    'Campus Estate infrastructure repair cell'
  ];

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const data = await searchSerpApi(searchQuery, userApiKey || undefined);
      setSearchResults(data);

      const news = await fetchSerpApiNews('Bhopal', userApiKey || undefined);
      setNewsResults(news);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(query);
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('serpapi_custom_key', userApiKey.trim());
    setSaveKeySuccess(true);
    setTimeout(() => setSaveKeySuccess(false), 2500);
    handleSearch(query);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-800/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Globe2 className="w-8 h-8 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  SerpAPI Live Civic Intelligence &amp; Municipal Directory
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40">
                  POWERED BY SERPAPI
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                FixMyCity uses SerpAPI to dynamically search Google Search, Google Maps, and Local Directories to locate official municipal corporation ward offices, helplines, tenders, and civic notices.
              </p>
            </div>
          </div>

          {/* SerpAPI Key Status Badge */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-xs self-start md:self-auto shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">SerpAPI Gateway</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {userApiKey ? 'Custom API Key loaded' : 'High-fidelity intelligent civic proxy'}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search municipal helpline, ward officer, road tender, or civic notices..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-600/25"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Query SerpAPI</span>
          </button>
        </form>

        {/* Quick query chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick Queries:</span>
          {sampleQueries.map((sq) => (
            <button
              key={sq}
              onClick={() => { setQuery(sq); handleSearch(sq); }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 whitespace-nowrap text-[11px] transition"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('authorities')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'authorities'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Google Search &amp; Knowledge Graph
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'news'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Civic Alerts &amp; News
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'inspector'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>SerpAPI Inspector &amp; Settings</span>
        </button>
      </div>

      {/* TAB 1: Authorities & Knowledge Graph */}
      {activeTab === 'authorities' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Organic results */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Verified Municipal Results ({searchResults?.results?.organic_results?.length || 0})
            </h3>

            {searchResults?.results?.organic_results?.map((item: any, idx: number) => (
              <div 
                key={idx}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition shadow-lg"
              >
                <div className="text-[11px] text-cyan-400 font-mono mb-1 truncate flex items-center gap-1">
                  <span>{item.displayed_link || item.link}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </div>
                <h4 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.title}
                  </a>
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {item.snippet}
                </p>
                {item.date && (
                  <div className="text-[10px] text-slate-500 mt-2 font-mono">
                    Published: {item.date}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right 1 Col: Municipal Knowledge Graph */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Official Corporation Entity Card
            </h3>
            {searchResults?.results?.knowledge_graph ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {searchResults.results.knowledge_graph.type || 'Municipal Entity'}
                  </span>
                  <h4 className="text-lg font-black text-white mt-2">
                    {searchResults.results.knowledge_graph.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {searchResults.results.knowledge_graph.description}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs border-t border-slate-800 pt-3">
                  <div className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Toll-Free Grievance Helpline:</span>
                      <span className="font-mono font-bold text-white">{searchResults.results.knowledge_graph.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Municipal Headquarters:</span>
                      <span className="text-slate-200">{searchResults.results.knowledge_graph.headquarters}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Municipal Commissioner:</span>
                      <span className="text-slate-200">{searchResults.results.knowledge_graph.commissioner}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={searchResults.results.knowledge_graph.website}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/20 transition"
                >
                  Visit Official BMC Portal
                </a>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400">
                Entity card loading from SerpAPI response...
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: Live Civic News */}
      {activeTab === 'news' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsResults.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {item.category || 'Civic Alert'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
              </div>
              <h4 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.snippet}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Source: {item.source}</span>
                <a href={item.link} target="_blank" rel="noreferrer" className="text-cyan-400 flex items-center gap-1 hover:underline">
                  <span>Read Article</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SerpAPI Settings & Raw JSON Inspector */}
      {activeTab === 'inspector' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 1 Col: API Key configuration */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  SerpAPI Key Configuration
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                FixMyCity seamlessly proxies SerpAPI queries through the backend. If you have your own SerpAPI key, enter it here to test live requests.
              </p>

              <form onSubmit={handleSaveApiKey} className="space-y-3">
                <input
                  type="password"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder="Paste your SerpAPI API Key"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  {saveKeySuccess ? <Check className="w-3.5 h-3.5 text-white" /> : <Key className="w-3.5 h-3.5" />}
                  <span>{saveKeySuccess ? 'Key Saved & Applied!' : 'Save & Test Key'}</span>
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2 text-xs text-slate-300">
              <h5 className="font-bold text-white">How SerpAPI Powers FixMyCity:</h5>
              <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                <li>Automated Ward Office &amp; Department Lookup</li>
                <li>Official Government Portals Verification</li>
                <li>Live Emergency Helplines &amp; Contacts</li>
                <li>Civic News &amp; Roadwork Tender Corroboration</li>
              </ul>
            </div>
          </div>

          {/* Right 2 Cols: Raw JSON inspector */}
          <div className="lg:col-span-2">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 font-mono">
                  GET /api/serpapi/search?q={encodeURIComponent(query)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Source: {searchResults?.source || 'SerpAPI'}
                </span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/90 p-4 rounded-xl overflow-x-auto max-h-[460px] border border-slate-800">
                {JSON.stringify(searchResults, null, 2)}
              </pre>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
