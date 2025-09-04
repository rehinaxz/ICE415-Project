import React, { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as topojson from "topojson-client";
import { geoCentroid } from "d3-geo";
import { Search, X } from "lucide-react";

export default function InteractiveGlobe({ onCountryClick }) {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]);
  const [hoverD, setHoverD] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [atlasError, setAtlasError] = useState("");
  const [clickPosition, setClickPosition] = useState(null);

  // Debug: Log when component mounts and when onCountryClick changes
  useEffect(() => {
    console.log('InteractiveGlobe component mounted');
    console.log('onCountryClick prop:', typeof onCountryClick);
  }, [onCountryClick]);

  // Load country polygons from topojson
  useEffect(() => {
    async function loadAtlas() {
      try {
        const res = await fetch("https://unpkg.com/world-atlas/countries-110m.json");
        const world = await res.json();
        const features = topojson.feature(world, world.objects.countries).features;
        setCountries(features);
      } catch (err) {
        console.error("Failed to load world atlas", err);
        setAtlasError("Failed to load map data.");
      }
    }
    loadAtlas();
  }, []);

  const countriesWithCentroids = useMemo(() => {
    return countries.map((f) => ({ ...f, centroid: geoCentroid(f) }));
  }, [countries]);

  const filteredCountries = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return countriesWithCentroids;
    return countriesWithCentroids.filter((c) => 
      ((c.properties.name || "").toLowerCase().includes(q))
    );
  }, [countriesWithCentroids, query]);

  // Styling helpers
  const polygonCapColor = (d) =>
    selected && d === selected
      ? "rgba(99,102,241,0.85)"
      : hoverD && d === hoverD
      ? "rgba(99,102,241,0.45)"
      : "rgba(148,163,184,0.25)";

  const polygonSideColor = () => "rgba(15,23,42,0.3)";
  const polygonStrokeColor = () => "#6366f1";

  const handleCountryClick = (d) => {
    console.log('Globe handleCountryClick called with:', d);
    console.log('Country properties:', d.properties);
    setSelected(d);
    
    // Convert to our country format and call the parent handler
    const countryData = {
      name: d.properties.NAME || d.properties.name || d.properties.NAME_EN || 'Unknown Country',
      cca3: d.properties.ISO_A3 || d.properties.ADM0_A3 || d.properties.ADMIN || 'UNK',
      cca2: d.properties.ISO_A2 || d.properties.ADM0_A3 || d.properties.ADMIN || 'UN',
      position: d.centroid,
      // Add additional properties that might be useful
      properties: d.properties
    };
    console.log('Country clicked:', countryData); // Debug log
    console.log('Calling onCountryClick with:', countryData);
    console.log('onCountryClick prop exists:', typeof onCountryClick);
    if (onCountryClick) {
      onCountryClick(countryData);
    } else {
      console.error('onCountryClick prop is not defined!');
    }
  };

  return (
    <div 
      ref={globeRef}
      className="w-full h-screen bg-slate-950 relative overflow-hidden"
      onClick={(e) => {
        console.log('Globe container clicked:', e.target);
        // Handle clicks on the globe container
        if (e.target === e.currentTarget) {
          setSelected(null);
          setClickPosition(null);
        }
      }}
    >
      {/* Search Bar - Mobile Responsive */}
      <div className="absolute z-10 left-3 right-3 sm:left-6 sm:right-6 top-3 sm:top-6 pointer-events-none">
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-slate-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 border border-slate-700/50 pointer-events-auto max-w-md shadow-2xl">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
          <input
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm placeholder:text-slate-400 text-white font-medium"
            placeholder="Search countries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button 
              onClick={() => setQuery("")} 
              className="rounded-lg hover:bg-slate-800/50 p-1 sm:p-1.5 transition-colors duration-200" 
              title="Clear search"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300" />
            </button>
          )}
        </div>
      </div>

      {/* Error Message - Mobile Responsive */}
      {atlasError && (
        <div className="absolute z-20 left-3 right-3 sm:left-6 sm:right-auto top-20 sm:top-24 bg-red-900/90 text-red-100 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-red-800/50 pointer-events-auto backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
            <span className="truncate">{atlasError}</span>
          </div>
        </div>
      )}

      {/* Globe Test Button */}
      <div className="absolute z-20 top-20 right-4 bg-green-500 text-white p-2 rounded text-xs">
        Globe Active
        <button 
          onClick={() => {
            console.log('Globe test button clicked');
            const testCountry = { name: 'Test Country', cca3: 'TST', cca2: 'TS' };
            if (onCountryClick) {
              onCountryClick(testCountry);
            } else {
              console.error('onCountryClick is not defined!');
            }
          }}
          className="ml-2 bg-blue-500 px-1 py-0.5 rounded text-xs"
        >
          Test
        </button>
      </div>

      {/* Globe */}
      <Globe
        backgroundColor="#0f172a"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereAltitude={0.15}
        atmosphereColor="#3b82f6"
        polygonsData={filteredCountries}
        polygonAltitude={(d) => (selected && d === selected ? 0.06 : 0.005)}
        polygonCapColor={polygonCapColor}
        polygonSideColor={polygonSideColor}
        polygonStrokeColor={polygonStrokeColor}
        polygonStrokeWidth={1.2}
        polygonLabel={(d) => `
          <div style="
            padding: 8px 12px; 
            background: rgba(15, 23, 42, 0.95); 
            color: white; 
            border-radius: 8px; 
            font-size: 14px;
            font-weight: 500;
            border: 1px solid rgba(59, 130, 246, 0.3);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(8px);
          ">
            ${d.properties.name}
          </div>
        `}
        onPolygonHover={(d) => {
          console.log('Hovering over polygon:', d?.properties?.name);
          setHoverD(d);
        }}
        onPolygonClick={(d, event) => {
          console.log('Polygon clicked directly:', d, event);
          console.log('Country data from click:', d?.properties);
          if (d && d.properties) {
            handleCountryClick(d);
          } else {
            console.error('Invalid country data received:', d);
          }
        }}
        polygonsTransitionDuration={400}
        enablePointerInteraction={true}
        lineHoverPrecision={0.05}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}