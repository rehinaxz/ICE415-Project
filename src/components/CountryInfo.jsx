import { useState, useEffect } from 'react';

export default function CountryInfo({ country, onClose }) {
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
      
      console.log('Fetching data for country:', country); // Debug log
      
      // Try multiple methods to find the country
      if (country.cca3 && country.cca3 !== '-99') {
        // First try with 3-letter country code
        apiUrl = `https://restcountries.com/v3.1/alpha/${country.cca3}`;
        response = await fetch(apiUrl);
        console.log('Trying with cca3:', country.cca3, 'Status:', response.status);
      }
      
      if (!response || !response.ok) {
        // Try with 2-letter country code
        if (country.cca2 && country.cca2 !== '-99') {
          apiUrl = `https://restcountries.com/v3.1/alpha/${country.cca2}`;
          response = await fetch(apiUrl);
          console.log('Trying with cca2:', country.cca2, 'Status:', response.status);
        }
      }
      
      if (!response || !response.ok) {
        // Try with country name (partial match)
        if (country.name) {
          apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(country.name)}`;
          response = await fetch(apiUrl);
          console.log('Trying with name (partial):', country.name, 'Status:', response.status);
        }
      }
      
      if (!response || !response.ok) {
        // Try with country name (exact match)
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
      console.log('Successfully fetched country data:', data[0]); // Debug log
      setCountryData(data[0]);
    } catch (err) {
      console.error('Error fetching country data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!country) return null;

  return (
    <div className="fixed top-6 right-6 w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl z-50 animate-in slide-in-from-right duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{country.name}</h2>
            <p className="text-slate-300 text-sm mt-1">Country Information</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800/50 rounded-lg"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-600 border-t-blue-500"></div>
              <span className="text-slate-300 text-sm font-medium">Loading country data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-red-300 font-medium">Error</span>
            </div>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Country Data */}
        {countryData && (
          <div className="space-y-6 text-white">
            {/* Flag */}
            <div className="flex justify-center mb-6">
              <div className="relative bg-slate-800/30 rounded-xl p-3 border border-slate-700/50">
                <img
                  src={countryData.flags?.png}
                  alt={`${countryData.name?.common} flag`}
                  className="w-24 h-16 object-contain rounded-lg border border-slate-600/30 shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                {countryData.coatOfArms?.png && (
                  <img
                    src={countryData.coatOfArms.png}
                    alt={`${countryData.name?.common} coat of arms`}
                    className="absolute -bottom-1 -right-1 w-6 h-6 object-contain bg-slate-800 rounded-full p-0.5 border border-slate-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Official Name</span>
                <p className="font-semibold text-white mt-1">{countryData.name?.official}</p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Capital</span>
                <p className="font-semibold text-white mt-1">{countryData.capital?.[0] || 'N/A'}</p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Population</span>
                <p className="font-semibold text-white mt-1">
                  {countryData.population?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Area</span>
                <p className="font-semibold text-white mt-1">
                  {countryData.area ? `${countryData.area.toLocaleString()} km²` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Region & Subregion */}
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
              <span className="text-slate-300 text-xs uppercase tracking-wide">Region</span>
              <p className="font-semibold text-white mt-1">{countryData.region || 'N/A'}</p>
              {countryData.subregion && (
                <>
                  <span className="text-slate-300 text-xs uppercase tracking-wide mt-3 block">Subregion</span>
                  <p className="font-semibold text-white mt-1">{countryData.subregion}</p>
                </>
              )}
            </div>

            {/* Languages */}
            {countryData.languages && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Languages</span>
                <p className="font-semibold text-white mt-1">
                  {Object.values(countryData.languages).join(', ')}
                </p>
              </div>
            )}

            {/* Currencies */}
            {countryData.currencies && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Currencies</span>
                <p className="font-semibold text-white mt-1">
                  {Object.values(countryData.currencies)
                    .map(currency => `${currency.name} (${currency.symbol})`)
                    .join(', ')}
                </p>
              </div>
            )}

            {/* Timezones */}
            {countryData.timezones && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Timezones</span>
                <p className="font-semibold text-white mt-1">
                  {countryData.timezones.slice(0, 3).join(', ')}
                  {countryData.timezones.length > 3 && '...'}
                </p>
              </div>
            )}

            {/* Borders */}
            {countryData.borders && countryData.borders.length > 0 && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Bordering Countries</span>
                <p className="font-semibold text-white mt-1">
                  {countryData.borders.slice(0, 5).join(', ')}
                  {countryData.borders.length > 5 && '...'}
                </p>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {countryData.independent !== undefined && (
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                  <span className="text-slate-300 text-xs uppercase tracking-wide">Independent</span>
                  <p className="font-semibold text-white mt-1">
                    {countryData.independent ? 'Yes' : 'No'}
                  </p>
                </div>
              )}
              
              {countryData.unMember !== undefined && (
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                  <span className="text-slate-300 text-xs uppercase tracking-wide">UN Member</span>
                  <p className="font-semibold text-white mt-1">
                    {countryData.unMember ? 'Yes' : 'No'}
                  </p>
                </div>
              )}
            </div>

            {/* Driving Side */}
            {countryData.car && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <span className="text-slate-300 text-xs uppercase tracking-wide">Driving Side</span>
                <p className="font-semibold text-white mt-1">
                  {countryData.car.side || 'Unknown'}
                </p>
              </div>
            )}

            {/* Source Information */}
            <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/30">
              <p className="text-slate-400 text-xs text-center">
                Data provided by REST Countries API
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
