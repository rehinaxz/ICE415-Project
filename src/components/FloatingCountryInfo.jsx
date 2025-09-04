import { useState, useEffect } from 'react';

export default function FloatingCountryInfo({ country, onClose, position }) {
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (country) {
      fetchCountryData(country);
    }
  }, [country]);

  const fetchCountryData = async (country) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      let apiUrl;
      
      console.log('Fetching data for country:', country);
      
      // Try multiple methods to find the country
      if (country.cca3 && country.cca3 !== '-99') {
        apiUrl = `https://restcountries.com/v3.1/alpha/${country.cca3}`;
        response = await fetch(apiUrl);
        console.log('Trying with cca3:', country.cca3, 'Status:', response.status);
      }
      
      if (!response || !response.ok) {
        if (country.cca2 && country.cca2 !== '-99') {
          apiUrl = `https://restcountries.com/v3.1/alpha/${country.cca2}`;
          response = await fetch(apiUrl);
          console.log('Trying with cca2:', country.cca2, 'Status:', response.status);
        }
      }
      
      if (!response || !response.ok) {
        if (country.name) {
          apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(country.name)}`;
          response = await fetch(apiUrl);
          console.log('Trying with name (partial):', country.name, 'Status:', response.status);
        }
      }
      
      if (!response || !response.ok) {
        if (country.name) {
          apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(country.name)}?fullText=true`;
          response = await fetch(apiUrl);
          console.log('Trying with name (exact):', country.name, 'Status:', response.status);
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`Country "${country.name || country.cca3 || country.cca2}" not found in REST Countries API`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched country data:', data[0]);
      setCountryData(data[0]);
    } catch (err) {
      console.error('Error fetching country data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!country) return null;

  // Calculate position for the floating container
  const containerStyle = {
    position: 'absolute',
    left: position ? `${position.x}px` : '50%',
    top: position ? `${position.y}px` : '50%',
    transform: position ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)',
    zIndex: 1000,
    maxWidth: '400px',
    minWidth: '320px',
  };

  return (
    <div 
      className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 max-w-sm"
      style={containerStyle}
    >
      {/* Arrow pointing to the country */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-700/50"></div>
      
      <div className="p-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-base font-bold text-white">{country.name}</h3>
            <p className="text-slate-300 text-xs">Country Information</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800/50 rounded-lg"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-600 border-t-blue-500"></div>
              <span className="text-slate-300 text-xs font-medium">Loading...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
              <span className="text-red-300 font-medium text-xs">Error</span>
            </div>
            <p className="text-red-200 text-xs">{error}</p>
          </div>
        )}

        {/* Country Data */}
        {countryData && (
          <div className="space-y-3 text-white">
            {/* Flag */}
            <div className="flex justify-center mb-2">
              <div className="relative bg-slate-800/30 rounded-lg p-1.5 border border-slate-700/50 max-w-fit">
                <img
                  src={countryData.flags?.png}
                  alt={`${countryData.name?.common} flag`}
                  className="w-12 h-8 object-contain rounded border border-slate-600/30 shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                {countryData.coatOfArms?.png && (
                  <img
                    src={countryData.coatOfArms.png}
                    alt={`${countryData.name?.common} coat of arms`}
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 object-contain bg-slate-800 rounded-full p-0.5 border border-slate-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="bg-slate-800/30 rounded-lg p-1.5 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Capital</span>
                <p className="font-semibold text-white mt-0.5 text-xs">{countryData.capital?.[0] || 'N/A'}</p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-1.5 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Population</span>
                <p className="font-semibold text-white mt-0.5 text-xs">
                  {countryData.population?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-1.5 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Area</span>
                <p className="font-semibold text-white mt-0.5 text-xs">
                  {countryData.area ? `${countryData.area.toLocaleString()} km²` : 'N/A'}
                </p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-1.5 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Region</span>
                <p className="font-semibold text-white mt-0.5 text-xs">{countryData.region || 'N/A'}</p>
              </div>
            </div>

            {/* Languages */}
            {countryData.languages && (
              <div className="bg-slate-800/30 rounded-lg p-1.5 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Languages</span>
                <p className="font-semibold text-white mt-0.5 text-xs">
                  {Object.values(countryData.languages).slice(0, 2).join(', ')}
                  {Object.values(countryData.languages).length > 2 && '...'}
                </p>
              </div>
            )}

            {/* Currencies */}
            {countryData.currencies && (
              <div className="bg-slate-800/30 rounded-lg p-1.5 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Currencies</span>
                <p className="font-semibold text-white mt-0.5 text-xs">
                  {Object.values(countryData.currencies)
                    .slice(0, 1)
                    .map(currency => `${currency.name} (${currency.symbol})`)
                    .join(', ')}
                </p>
              </div>
            )}

            {/* Source */}
            <div className="bg-slate-800/20 rounded-lg p-1.5 border border-slate-700/30">
              <p className="text-slate-400 text-xs text-center">
                Data from REST Countries API
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
