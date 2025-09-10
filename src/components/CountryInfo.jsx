import { Users, Landmark, Globe2, X, DollarSign, Clock, Languages } from "lucide-react";

export default function CountryInfo({ country, onClose }) {
  if (!country) return null;

  // Ensure country has the required structure
  const safeCountry = {
    name: country.name || { common: 'Unknown Country', official: 'Unknown Country' },
    capital: country.capital || ['N/A'],
    population: country.population || 0,
    region: country.region || 'N/A',
    currencies: country.currencies || {},
    languages: country.languages || {},
    timezones: country.timezones || []
  };

  // Function to get country code for flag API
  const getCountryCode = (countryName) => {
    const countryCodeMap = {
      'United States': 'us',
      'China': 'cn',
      'Brazil': 'br',
      'India': 'in',
      'Russia': 'ru',
      'Canada': 'ca',
      'Australia': 'au',
      'Germany': 'de',
      'France': 'fr',
      'United Kingdom': 'gb',
      'Japan': 'jp',
      'South Korea': 'kr',
      'Italy': 'it',
      'Spain': 'es',
      'Mexico': 'mx',
      'Argentina': 'ar',
      'South Africa': 'za',
      'Nigeria': 'ng',
      'Egypt': 'eg',
      'Philippines': 'ph',
      'Indonesia': 'id',
      'Thailand': 'th',
      'Vietnam': 'vn',
      'Malaysia': 'my',
      'Singapore': 'sg',
      'New Zealand': 'nz',
      'Netherlands': 'nl',
      'Belgium': 'be',
      'Switzerland': 'ch',
      'Austria': 'at',
      'Sweden': 'se',
      'Norway': 'no',
      'Denmark': 'dk',
      'Finland': 'fi',
      'Poland': 'pl',
      'Czech Republic': 'cz',
      'Hungary': 'hu',
      'Romania': 'ro',
      'Bulgaria': 'bg',
      'Greece': 'gr',
      'Turkey': 'tr',
      'Israel': 'il',
      'Saudi Arabia': 'sa',
      'United Arab Emirates': 'ae',
      'Iran': 'ir',
      'Iraq': 'iq',
      'Afghanistan': 'af',
      'Pakistan': 'pk',
      'Bangladesh': 'bd',
      'Sri Lanka': 'lk',
      'Nepal': 'np',
      'Myanmar': 'mm',
      'Cambodia': 'kh',
      'Laos': 'la',
      'Mongolia': 'mn',
      'North Korea': 'kp',
      'Taiwan': 'tw',
      'Hong Kong': 'hk',
      'Macau': 'mo',
      'Sudan': 'sd',
      'Niger': 'ne'
    };
    
    return countryCodeMap[countryName] || 'un';
  };

  const formatCurrency = (currencies) => {
    if (!currencies || Object.keys(currencies).length === 0) return "N/A";
    const currency = Object.values(currencies)[0];
    if (!currency || !currency.name) return "N/A";
    return `${currency.name} (${currency.symbol || 'N/A'})`;
  };

  const formatLanguages = (languages) => {
    if (!languages || Object.keys(languages).length === 0) return "N/A";
    const languageValues = Object.values(languages);
    if (languageValues.length === 0) return "N/A";
    return languageValues.join(", ");
  };

  const formatTimezones = (timezones) => {
    if (!timezones || !Array.isArray(timezones) || timezones.length === 0) return "N/A";
    return timezones.slice(0, 3).join(", ") + (timezones.length > 3 ? "..." : "");
  };

  return (
    <div className="w-96 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative animate-slide-in mr-6 flex flex-col max-h-[90vh]" style={{ marginTop: '80px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-all duration-200 hover:scale-110"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      )}
      
      {/* Header */}
      <div className="p-5 relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #dc2626 50%, #fbbf24 100%)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full"></div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
        </div>
        
        {/* Live Indicator */}
        <div className="absolute top-5 right-5 flex items-center gap-1.5 text-white/90 text-xs font-medium">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Live Data
        </div>
        
        {/* Flag */}
        <div className="w-10 h-6 rounded mb-3 border border-white/20 overflow-hidden relative z-10" style={{ width: '40px', height: '26px', borderRadius: '4px' }}>
          <img
            src={`https://flagcdn.com/w320/${getCountryCode(safeCountry.name.common)}.png`}
            alt={`${safeCountry.name.common} flag`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        {/* Country Name */}
        <h2 className="text-white font-bold mb-1 relative z-10" style={{ fontSize: '24px' }}>{safeCountry.name.common}</h2>
        <p className="text-white/80 relative z-10" style={{ fontSize: '14px' }}>{safeCountry.name.official}</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ padding: '24px' }}>
        {/* Country Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Capital */}
            <div className="rounded-xl p-4 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <Landmark className="w-4 h-4" />
                Capital
              </div>
              <div className="text-blue-400 font-semibold" style={{ fontSize: '18px' }}>
                {Array.isArray(safeCountry.capital) && safeCountry.capital.length > 0 ? safeCountry.capital[0] : "N/A"}
              </div>
            </div>

            {/* Population */}
            <div className="rounded-xl p-4 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Population
              </div>
              <div className="text-green-400 font-semibold" style={{ fontSize: '18px' }}>
                {safeCountry.population && safeCountry.population > 0 ? safeCountry.population.toLocaleString() : "N/A"}
              </div>
            </div>

            {/* Language */}
            <div className="rounded-xl p-4 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Language
              </div>
              <div className="text-pink-400 font-semibold" style={{ fontSize: '18px' }}>
                {formatLanguages(safeCountry.languages)}
              </div>
            </div>

            {/* Region */}
            <div className="rounded-xl p-4 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <Globe2 className="w-4 h-4" />
                Region
              </div>
              <div className="text-red-400 font-semibold" style={{ fontSize: '18px' }}>
                {safeCountry.region || "N/A"}
              </div>
            </div>

            {/* Currency */}
            <div className="rounded-xl p-4 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Currency
              </div>
              <div className="text-yellow-400 font-semibold" style={{ fontSize: '18px' }}>
                {formatCurrency(safeCountry.currencies)}
              </div>
            </div>

            {/* Timezone */}
            <div className="rounded-xl p-4 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timezone
              </div>
              <div className="text-amber-400 font-semibold" style={{ fontSize: '18px' }}>
                {formatTimezones(safeCountry.timezones)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-4 flex-shrink-0">
        <div className="border-t pt-4 text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <p className="text-white/50" style={{ fontSize: '11px' }}>
            Powered by <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">REST Countries API</span>
          </p>
        </div>
      </div>
    </div>
  );
}