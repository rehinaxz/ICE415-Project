import { Users, Landmark, Globe2, Map, X, Star, TrendingUp, Calendar } from "lucide-react";

export default function CountryInfo({ country, onClose }) {
  if (!country) return null;

  return (
    <div className="w-full max-w-full bg-slate-900/95 backdrop-blur-xl border border-slate-600 rounded-2xl shadow-2xl overflow-hidden relative animate-slide-in">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-800/90 hover:bg-slate-700/90 transition-all duration-200 hover:scale-110"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      )}
      
      {/* Flag */}
      <div className="w-full h-36 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <img
          src={country.flags?.png}
          alt={`${country.name.common} flag`}
          className="w-full h-full object-cover relative z-10"
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      </div>

      {/* Header */}
      <div className="p-3 text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 relative">
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">Live Data</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{country.name.common}</h2>
        <p className="text-slate-400 text-sm leading-relaxed">{country.name.official}</p>
        <div className="mt-3 flex justify-center gap-2">
          <div className="px-3 py-1 bg-blue-500/20 rounded-full">
            <span className="text-blue-400 text-xs font-medium">{country.region}</span>
          </div>
          {country.subregion && (
            <div className="px-3 py-1 bg-purple-500/20 rounded-full">
              <span className="text-purple-400 text-xs font-medium">{country.subregion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="px-3 py-3 space-y-2">
        {/* Capital */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800/60 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Landmark className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-semibold text-slate-300">Capital</span>
          </div>
          <p className="text-white text-lg font-medium">{country.capital?.[0] || "N/A"}</p>
          {country.capital && country.capital.length > 1 && (
            <p className="text-slate-400 text-sm mt-1">
              +{country.capital.length - 1} more capital{country.capital.length > 2 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Population */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800/60 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <span className="font-semibold text-slate-300">Population</span>
          </div>
          <p className="text-white text-lg font-medium">
            {country.population?.toLocaleString() || "N/A"}
          </p>
          {country.population && country.population > 1000000000 && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs font-medium">Billion+</span>
            </div>
          )}
        </div>

        {/* Area */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800/60 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Globe2 className="w-5 h-5 text-green-400" />
            </div>
            <span className="font-semibold text-slate-300">Area</span>
          </div>
          <p className="text-white text-lg font-medium">
            {country.area?.toLocaleString() || "N/A"} km²
          </p>
          {country.area && country.area > 1000000 && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-medium">Large Country</span>
            </div>
          )}
        </div>

        {/* Region */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800/60 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Map className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="font-semibold text-slate-300">Region</span>
          </div>
          <p className="text-white text-lg font-medium">{country.region || "N/A"}</p>
        </div>

        {/* Additional Information */}
        {country.subregion && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800/60 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Map className="w-5 h-5 text-blue-400" />
              </div>
              <span className="font-semibold text-slate-300">Subregion</span>
            </div>
            <p className="text-white text-lg font-medium">{country.subregion}</p>
          </div>
        )}

        {country.currencies && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800/60 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <span className="font-semibold text-slate-300">Currency</span>
            </div>
            <p className="text-white text-lg font-medium">
              {Object.values(country.currencies)[0]?.name || "N/A"}
            </p>
          </div>
        )}

        {country.languages && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800/60 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <span className="text-2xl">🗣️</span>
              </div>
              <span className="font-semibold text-slate-300">Language</span>
            </div>
            <p className="text-white text-lg font-medium">
              {Object.values(country.languages)[0] || "N/A"}
            </p>
          </div>
        )}

        {country.timezones && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-800/60 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-semibold text-slate-300">Timezone</span>
            </div>
            <p className="text-white text-lg font-medium">
              {country.timezones[0] || "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* Coat of Arms */}
      {country.coatOfArms?.png && (
        <div className="px-3 pb-3">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-center">
            <h4 className="text-slate-300 font-semibold mb-3">Coat of Arms</h4>
            <img
              src={country.coatOfArms.png}
              alt="Coat of arms"
              className="h-20 object-contain drop-shadow-lg mx-auto"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 pb-3">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-3 border border-slate-600/50 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-green-400 text-xs font-medium">Real-time Data</p>
          </div>
          <p className="text-slate-400 text-sm">
            Powered by REST Countries API
          </p>
          <div className="mt-2 flex justify-center gap-1">
            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
