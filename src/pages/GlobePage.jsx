import { useState, useEffect } from 'react';
import InteractiveGlobe from '../components/Globe';

export default function GlobePage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testCounter, setTestCounter] = useState(0);

  // Debug: Monitor selectedCountry changes
  useEffect(() => {
    console.log('selectedCountry state changed to:', selectedCountry);
  }, [selectedCountry]);

  const handleCountryClick = (country) => {
    console.log('Country clicked in GlobePage:', country);
    setSelectedCountry(country);
  };

  const fetchCountryData = async (country) => {
    if (!country) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data for country:', country);
      
      // Try multiple API endpoints for better compatibility
      const endpoints = [];
      
      // Only add alpha endpoints if we have valid codes
      if (country.cca3 && country.cca3 !== 'UNK') {
        endpoints.push(`https://restcountries.com/v3.1/alpha/${country.cca3}`);
      }
      if (country.cca2 && country.cca2 !== 'UN' && country.cca2 !== country.cca3) {
        endpoints.push(`https://restcountries.com/v3.1/alpha/${country.cca2}`);
      }
      
      // Always try name-based endpoints
      if (country.name && country.name !== 'Unknown Country') {
        endpoints.push(`https://restcountries.com/v3.1/name/${encodeURIComponent(country.name)}?fullText=true`);
        endpoints.push(`https://restcountries.com/v3.1/name/${encodeURIComponent(country.name)}`);
      }
      
      console.log('Endpoints to try:', endpoints);
      
      let data = null;
      let lastError = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint);
          console.log(`Response status: ${response.status}`);
          
          if (response.ok) {
            data = await response.json();
            console.log('Data received:', data);
            break;
          } else {
            console.log(`Failed with status: ${response.status}`);
            lastError = new Error(`HTTP ${response.status}`);
          }
        } catch (err) {
          console.log(`Error with endpoint ${endpoint}:`, err);
          lastError = err;
        }
      }
      
      if (data && data.length > 0) {
        setCountryData(data[0]);
        console.log('Country data set successfully:', data[0]);
      } else {
        throw lastError || new Error('No data received from any endpoint');
      }
      
    } catch (err) {
      console.error('Error fetching country data:', err);
      setError(`Failed to fetch data for ${country.name}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch country data when selectedCountry changes
  useEffect(() => {
    if (selectedCountry) {
      fetchCountryData(selectedCountry);
    }
  }, [selectedCountry]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-gray-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">🌍</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interactive World Globe</h1>
              <p className="text-gray-700 text-sm font-medium">Click on any country to explore detailed information</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>195 Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Interactive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Globe Component */}
      <InteractiveGlobe onCountryClick={handleCountryClick} />

      {/* Country Info Panel */}
      {selectedCountry && (
        <div 
          className="fixed top-6 right-6 w-[420px] max-h-[85vh] bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-2xl rounded-2xl p-8 border border-gray-200 shadow-2xl overflow-y-auto z-[99999] transform transition-all duration-300 ease-out"
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            width: '420px',
            maxHeight: '85vh',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(203, 213, 225, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(203, 213, 225, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            overflowY: 'auto',
            zIndex: 99999
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedCountry(null)}
            className="absolute top-5 right-5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
                <span className="text-gray-700 font-medium">Loading country data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
          )}

          {!loading && !error && countryData ? (
            <div className="space-y-6">
              {/* Country Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {countryData.name?.common || selectedCountry.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {countryData.name?.official}
                </p>
              </div>

              {/* Flag */}
              {countryData.flags?.png && (
                <div className="flex justify-center">
                  <img
                    src={countryData.flags.png}
                    alt={`Flag of ${countryData.name?.common}`}
                    className="w-40 h-28 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                  />
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-lg">
                <h3 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-3">
                  <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></span>
                  <span className="text-gray-900">Basic Information</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-blue-200">
                    <span className="text-gray-700 font-medium">Capital:</span>
                    <span className="text-gray-900 font-semibold">{countryData.capital?.[0] || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-blue-200">
                    <span className="text-gray-700 font-medium">Population:</span>
                    <span className="text-gray-900 font-semibold">{countryData.population?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-blue-200">
                    <span className="text-gray-700 font-medium">Area:</span>
                    <span className="text-gray-900 font-semibold">{countryData.area?.toLocaleString()} km²</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-blue-200">
                    <span className="text-gray-700 font-medium">Region:</span>
                    <span className="text-gray-900 font-semibold">{countryData.region || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-blue-200">
                    <span className="text-gray-700 font-medium">Subregion:</span>
                    <span className="text-gray-900 font-semibold">{countryData.subregion || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Languages */}
              {countryData.languages && Object.keys(countryData.languages).length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-lg">
                  <h3 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"></span>
                    <span className="text-gray-900">Languages</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(countryData.languages).map(([code, name]) => (
                      <span key={code} className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-xl text-sm font-semibold border border-green-300 shadow-sm">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Currencies */}
              {countryData.currencies && Object.keys(countryData.currencies).length > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-lg">
                  <h3 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-sm"></span>
                    <span className="text-gray-900">Currencies</span>
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(countryData.currencies).map(([code, currency]) => (
                      <div key={code} className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-yellow-200">
                        <span className="text-gray-700 font-medium">{currency.name}</span>
                        <span className="text-gray-900 font-semibold">({code}) {currency.symbol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timezones */}
              {countryData.timezones && countryData.timezones.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-lg">
                  <h3 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-sm"></span>
                    <span className="text-gray-900">Timezones</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {countryData.timezones.slice(0, 6).map((timezone, index) => (
                      <span key={index} className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-4 py-2 rounded-xl text-sm font-semibold border border-purple-300 shadow-sm">
                        {timezone}
                      </span>
                    ))}
                    {countryData.timezones.length > 6 && (
                      <span className="text-gray-600 text-sm font-medium bg-gray-100 px-3 py-2 rounded-xl">+{countryData.timezones.length - 6} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Bordering Countries */}
              {countryData.borders && countryData.borders.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200 shadow-lg">
                  <h3 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"></span>
                    <span className="text-gray-900">Bordering Countries ({countryData.borders.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {countryData.borders.slice(0, 8).map((border, index) => (
                      <span key={index} className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 px-4 py-2 rounded-xl text-sm font-semibold border border-red-300 shadow-sm">
                        {border}
                      </span>
                    ))}
                    {countryData.borders.length > 8 && (
                      <span className="text-gray-600 text-sm font-medium bg-gray-100 px-3 py-2 rounded-xl">+{countryData.borders.length - 8} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200 shadow-lg">
                <h3 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-3">
                  <span className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full shadow-sm"></span>
                  <span className="text-gray-900">Additional Information</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-cyan-200">
                    <span className="text-gray-700 font-medium">Country Code (ISO 3166-1):</span>
                    <span className="text-gray-900 font-semibold">{countryData.cca2 || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-cyan-200">
                    <span className="text-gray-700 font-medium">Country Code (ISO 3166-1 alpha-3):</span>
                    <span className="text-gray-900 font-semibold">{countryData.cca3 || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-cyan-200">
                    <span className="text-gray-700 font-medium">Top Level Domain:</span>
                    <span className="text-gray-900 font-semibold">{countryData.tld?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-cyan-200">
                    <span className="text-gray-700 font-medium">Independent:</span>
                    <span className="text-gray-900 font-semibold">{countryData.independent ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/80 rounded-lg p-3 border border-cyan-200">
                    <span className="text-gray-700 font-medium">UN Member:</span>
                    <span className="text-gray-900 font-semibold">{countryData.unMember ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : !loading && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Country Selected</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Name:</span>
                    <span className="font-semibold">{selectedCountry.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">CCA3:</span>
                    <span className="font-semibold">{selectedCountry.cca3}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">CCA2:</span>
                    <span className="font-semibold">{selectedCountry.cca2}</span>
                  </div>
                </div>
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-800 font-medium">{error}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Debug Panel - Enhanced version */}
      <div className="fixed top-4 left-4 bg-gradient-to-br from-white/95 to-gray-50/95 text-gray-900 p-4 rounded-xl z-[9999] border border-gray-200 shadow-xl backdrop-blur-sm">
        <div className="text-sm font-bold mb-2 text-gray-900">Debug Panel</div>
        <div className="text-xs mb-1 text-gray-600">Selected: <span className="text-gray-900 font-semibold">{selectedCountry ? selectedCountry.name : 'None'}</span></div>
        <div className="text-xs mb-3 text-gray-600">Data: <span className={`font-semibold ${countryData ? 'text-green-600' : 'text-red-600'}`}>{countryData ? '✓ Loaded' : '✗ Loading'}</span></div>
        <button
          onClick={() => {
            const testCountry = { name: 'United States', cca3: 'USA', cca2: 'US' };
            setSelectedCountry(testCountry);
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-3 py-2 rounded-lg text-xs font-semibold text-white shadow-sm transition-all duration-200"
        >
          Test USA
        </button>
      </div>
    </div>
  );
}