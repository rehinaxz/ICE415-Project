import { Users, Landmark, Globe2, X, DollarSign, Clock, Languages, MapPin } from "lucide-react";

export default function CountryInfo({ country, onClose }) {
  if (!country) return null;

  // Ensure country has the required structure
  const safeCountry = {
    name: country.name || { common: 'Unknown Country', official: 'Unknown Country' },
    capital: country.capital || ['N/A'],
    population: country.population || 0,
    area: country.area || 0,
    region: country.region || 'N/A',
    currencies: country.currencies || {},
    languages: country.languages || {},
    timezones: country.timezones || []
  };

  // Function to get country code for flag API with more comprehensive mapping
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
      'Niger': 'ne',
      'Libya': 'ly',
      'Algeria': 'dz',
      'Morocco': 'ma',
      'Tunisia': 'tn',
      'Chad': 'td',
      'Mali': 'ml',
      'Burkina Faso': 'bf',
      'Senegal': 'sn',
      'Guinea': 'gn',
      'Sierra Leone': 'sl',
      'Liberia': 'lr',
      'Ghana': 'gh',
      'Togo': 'tg',
      'Benin': 'bj',
      'Cameroon': 'cm',
      'Central African Republic': 'cf',
      'Democratic Republic of the Congo': 'cd',
      'Republic of the Congo': 'cg',
      'Marshall Islands': 'mh',
      'Micronesia': 'fm',
      'Nauru': 'nr',
      'Cook Islands': 'ck',
      'French Polynesia': 'pf',
      // European countries
      'Iceland': 'is',
      'Jordan': 'jo',
      'Cyprus': 'cy',
      'Malta': 'mt',
      'Luxembourg': 'lu',
      'Liechtenstein': 'li',
      'Monaco': 'mc',
      'San Marino': 'sm',
      'Vatican City': 'va',
      'Andorra': 'ad',
      'Albania': 'al',
      'Bosnia and Herzegovina': 'ba',
      'Croatia': 'hr',
      'Serbia': 'rs',
      'Montenegro': 'me',
      'North Macedonia': 'mk',
      'Slovenia': 'si',
      'Slovakia': 'sk',
      'Lithuania': 'lt',
      'Latvia': 'lv',
      'Estonia': 'ee',
      'Moldova': 'md',
      'Belarus': 'by',
      'Georgia': 'ge',
      'Armenia': 'am',
      'Azerbaijan': 'az',
      'Kyrgyzstan': 'kg',
      'Tajikistan': 'tj',
      // Middle East
      'Lebanon': 'lb',
      'Syria': 'sy',
      'Qatar': 'qa',
      'Bahrain': 'bh',
      'Oman': 'om',
      'Yemen': 'ye',
      'Palestine': 'ps',
      // Other missing countries
      'Maldives': 'mv',
      'Bhutan': 'bt',
      'Brunei': 'bn',
      'East Timor': 'tl',
      'Timor-Leste': 'tl',
      // Additional countries
      'Greenland': 'gl',
      'Czechia': 'cz'
    };
    
    return countryCodeMap[countryName] || 'un';
  };

  const formatCurrency = (currencies) => {
    if (!currencies || Object.keys(currencies).length === 0) return "N/A";
    const currency = Object.values(currencies)[0];
    return `${currency.name} (${currency.symbol || 'N/A'})`;
  };

  const formatLanguages = (languages) => {
    const languageValues = Object.values(languages);
    if (languageValues.length === 0) return "N/A";
    return languageValues.join(", ");
  };

  const formatTimezones = (timezones) => {
    if (!timezones || !Array.isArray(timezones) || timezones.length === 0) return "N/A";
    return timezones.slice(0, 3).join(", ") + (timezones.length > 3 ? "..." : "");
  };

  const formatArea = (area) => {
    if (!area || area === 0) return "N/A";
    return `${area.toLocaleString()} km²`;
  };

  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden fixed flex flex-col transition-all duration-500 ease-out transform hover:scale-[1.02] hover:shadow-3xl hover:border-white/30"
      style={{
        top: '50%',
        right: '5vw',
        transform: 'translateY(-50%)',
        background: 'rgba(20, 24, 48, 0.85)',
        backdropFilter: 'blur(24px)',
        width: '340px',
        height: '500px',
        maxWidth: '92vw',
        maxHeight: '92vh',
        animation: 'popInScaleFade 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(80, 80, 255, 0.10), 0 0 40px 8px #312e8144',
        borderRadius: '28px',
        fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif",
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      {/* Close Button */}
      <button
        aria-label="Close country info"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'linear-gradient(90deg, #E1DED9 0%, #A9C4C4 100%)',
          border: '1px solid #000435',
          borderRadius: '50%',
          width: 36,
          height: 36,
          color: '#000435',
          fontSize: 22,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px 0 #00043522',
          transition: 'box-shadow 0.18s, background 0.18s, border-color 0.18s',
          zIndex: 20,
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.background = 'linear-gradient(90deg, #A9C4C4 0%, #E1DED9 100%)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'linear-gradient(90deg, #E1DED9 0%, #A9C4C4 100%)';
        }}
      >
        <X style={{ width: 22, height: 22, color: '#000435' }} />
      </button>
      {/* Title Section: Flag, Country Code, Name, Subtitle */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(90deg, #004466 0%, #000435 100%)', borderRadius: '28px 28px 0 0', padding: '22px 20px 16px 20px', minHeight: '120px', boxShadow: '0 4px 24px 0 #00043544' }}>
          <div className="flex flex-col items-center justify-center w-full" style={{ gap: '2px', marginTop: '2px', marginBottom: '2px' }}>
            <div className="w-14 h-9 rounded border border-white/20 overflow-hidden flex items-center justify-center" style={{ width: '56px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.10)', boxShadow: '0 2px 8px #818cf822', marginBottom: '0', marginTop: '0' }}>
              <img
                src={`https://flagcdn.com/w320/${getCountryCode(safeCountry.name.common)}.png`}
                alt={`${safeCountry.name.common} flag`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  // Show country code as fallback
                  const fallbackElement = e.target.nextElementSibling;
                  if (fallbackElement) {
                    fallbackElement.style.display = 'flex';
                  }
                }}
              />
              {/* Fallback country code display */}
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs" style={{ display: 'none', backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '6px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                <div className="text-center">
                  <div className="text-lg font-bold">{getCountryCode(safeCountry.name.common).toUpperCase()}</div>
                  <div className="text-xs opacity-80">{safeCountry.name.common}</div>
                </div>
              </div>
            </div>
            <div className="text-white text-xs font-bold tracking-widest" style={{ fontSize: '15px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif", letterSpacing: '0.14em', minWidth: '32px', textAlign: 'center', marginTop: '0', marginBottom: '0' }}>
              {getCountryCode(safeCountry.name.common).toUpperCase()}
            </div>
            <h2 className="relative z-10" style={{ fontSize: '24px', color: '#fff', fontWeight: 800, fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif", textShadow: '0 2px 12px #000435cc', margin: 0, textAlign: 'center', lineHeight: 1.1 }}>{safeCountry.name.common}</h2>
          </div>
          <p className="relative z-10 mb-2" style={{ fontSize: '15px', color: '#fff', fontWeight: 500, fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif", textShadow: '0 1px 6px #004466', textAlign: 'center', margin: 0, marginTop: '2px' }}>{safeCountry.name.official}</p>
        {/* (All flag/country code/country name markup is now in the new centered layout above) */}
      </div>

      {/* Scrollable Content */}
  <div className="flex-1 overflow-y-auto p-4" style={{ padding: '20px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
        {/* Country Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Capital */}
            <div className="transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '8px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs flex items-center gap-3" style={{ marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                <Landmark className="w-4 h-4" />
                Capital
              </div>
              <div className="text-blue-400" style={{ fontSize: '18px', fontWeight: 500, fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                {Array.isArray(safeCountry.capital) && safeCountry.capital.length > 0 ? safeCountry.capital[0] : "N/A"}
              </div>
            </div>

            {/* Population */}
            <div className="transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '8px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs flex items-center gap-3" style={{ marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                <Users className="w-4 h-4" />
                Population
              </div>
              <div className="text-green-400" style={{ fontSize: '18px', fontWeight: 500, fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                {safeCountry.population && safeCountry.population > 0 ? safeCountry.population.toLocaleString() : "N/A"}
              </div>
            </div>

            {/* Area */}
            <div className="transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '8px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs flex items-center gap-3" style={{ marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                <MapPin className="w-4 h-4" />
                Area
              </div>
              <div className="text-yellow-400" style={{ fontSize: '18px', fontWeight: 500, fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                {formatArea(safeCountry.area)}
              </div>
            </div>

            {/* Language */}
            <div className="transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '8px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs flex items-center gap-3" style={{ marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                <Languages className="w-4 h-4" />
                Language
              </div>
              <div className="text-pink-400" style={{ fontSize: '18px', fontWeight: 500, fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                {formatLanguages(safeCountry.languages)}
              </div>
            </div>

            {/* Region */}
            <div className="transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '8px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs flex items-center gap-3" style={{ marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                <Globe2 className="w-4 h-4" />
                Region
              </div>
              <div className="text-red-400" style={{ fontSize: '18px', fontWeight: 500, fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                {safeCountry.region || "N/A"}
              </div>
            </div>

            {/* Currency */}
            <div className="transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '8px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs flex items-center gap-3" style={{ marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                <DollarSign className="w-4 h-4" />
                Currency
              </div>
              <div className="text-yellow-400" style={{ fontSize: '18px', fontWeight: 500, fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                {formatCurrency(safeCountry.currencies)}
              </div>
            </div>

            {/* Timezone */}
            <div className="transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '8px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <div className="text-white/70 text-xs flex items-center gap-3" style={{ marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                <Clock className="w-4 h-4" />
                Timezone
              </div>
              <div className="text-amber-400" style={{ fontSize: '18px', fontWeight: 500, fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
                {formatTimezones(safeCountry.timezones)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-2 flex-shrink-0" style={{ fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
        <div className="border-t pt-6 text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '0 0 28px 28px' }}>
          <p className="text-white/50" style={{ fontSize: '12px', fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif" }}>
            Powered by <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">REST Countries API</span>
          </p>
        </div>
      </div>
    </div>
  );
}