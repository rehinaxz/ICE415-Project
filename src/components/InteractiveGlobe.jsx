import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";

const InteractiveGlobe = ({ onCountryClick, countries, selectedCountry, onBackgroundClick }) => {
  const globeRef = useRef();
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoverLabel, setHoverLabel] = useState(null); // { name, x, y }

  // Function to match country names with better accuracy
  const isCountryMatch = (polygonName, countryName) => {
    if (!polygonName || !countryName) return false;
    
    const polyLower = polygonName.toLowerCase();
    const countryLower = countryName.toLowerCase();
    
    // Direct match
    if (polyLower === countryLower) {
      console.log('✅ Direct match:', polygonName, '===', countryName);
      return true;
    }
    
    // Handle special cases
    const specialCases = {
      'united states of america': 'united states',
      'united states': 'united states of america',
      'usa': 'united states',
      'america': 'united states',
      'democratic republic of the congo': 'dr congo',
      'dr congo': 'democratic republic of the congo',
      'drc': 'democratic republic of the congo',
      'republic of the congo': 'congo',
      'congo': 'republic of the congo',
      'united kingdom': 'uk',
      'uk': 'united kingdom',
      'britain': 'united kingdom',
      'south korea': 'korea',
      'korea': 'south korea',
      'north korea': 'korea, democratic people\'s republic of',
      'korea, democratic people\'s republic of': 'north korea',
      'czech republic': 'czechia',
      'czechia': 'czech republic',
      'ivory coast': 'côte d\'ivoire',
      'côte d\'ivoire': 'ivory coast',
      'cape verde': 'cabo verde',
      'cabo verde': 'cape verde',
      'east timor': 'timor-leste',
      'timor-leste': 'east timor',
      'swaziland': 'eswatini',
      'eswatini': 'swaziland',
      'macedonia': 'north macedonia',
      'north macedonia': 'macedonia',
      'myanmar': 'burma',
      'burma': 'myanmar'
    };
    
    // Check special cases
    if (specialCases[polyLower] === countryLower || specialCases[countryLower] === polyLower) {
      console.log('✅ Special case match:', polygonName, '===', countryName);
      return true;
    }
    
    // Check if one contains the other (for partial matches)
    if (polyLower.includes(countryLower) || countryLower.includes(polyLower)) {
      console.log('✅ Contains match:', polygonName, 'contains', countryName);
      return true;
    }
    
    // Check for "United States" variations
    if ((polyLower.includes('united states') || polyLower.includes('usa') || polyLower.includes('america')) &&
        (countryLower.includes('united states') || countryLower.includes('usa') || countryLower.includes('america'))) {
      console.log('✅ USA variation match:', polygonName, '===', countryName);
      return true;
    }
    
    console.log('❌ No match found:', polygonName, 'vs', countryName);
    return false;
  };

  useEffect(() => {
    if (globeRef.current) {
      // Auto-rotate the globe
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      
      // Set initial camera position
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
    }
  }, []);

  // Mouse move handler to update label position
  const handleMouseMove = (event) => {
    if (hoveredCountry) {
      const globeRect = globeRef.current?.parentElement?.getBoundingClientRect();
      setHoverLabel({
        name: hoveredCountry,
        x: event.clientX - (globeRect?.left || 0),
        y: event.clientY - (globeRect?.top || 0)
      });
    }
  };

  useEffect(() => {
    if (hoveredCountry) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      setHoverLabel(null);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
    // eslint-disable-next-line
  }, [hoveredCountry]);

  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={countries.features}
        polygonAltitude={(d) => {
          if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
            return 0.15;
          }
          if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
            return 0.01;
          }
          return 0.005;
        }}
        polygonCapColor={(d) => {
          if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
            return "rgba(255, 215, 0, 0.9)";
          }
          if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
            return "rgba(255, 165, 0, 0.6)";
          }
          return "rgba(0, 150, 255, 0.2)";
        }}
        polygonSideColor={(d) => {
          if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
            return "rgba(255, 215, 0, 0.5)";
          }
          if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
            return "rgba(255, 165, 0, 0.3)";
          }
          return "rgba(0, 150, 255, 0.1)";
        }}
        polygonStrokeColor={(d) => {
          if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
            return "rgba(255, 215, 0, 1)";
          }
          if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
            return "rgba(255, 165, 0, 1)";
          }
          return "rgba(255, 255, 255, 1)";
        }}
        polygonStrokeWidth={(d) => {
          if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
            return 8;
          }
          if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
            return 5;
          }
          return 2;
        }}
        polygonStrokeAltitude={(d) => {
          if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
            return 0.15;
          }
          if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
            return 0.08;
          }
          return 0.005;
        }}
        onPolygonClick={(polygon) => {
          // When a country is clicked, clear hover state so label disappears
          setHoveredCountry(null);
          setHoverLabel(null);
          if (polygon?.properties?.countryData) {
            onCountryClick(polygon.properties.countryData);
          }
        }}
        onGlobeReady={() => {
          // Globe is ready
        }}
        onPolygonHover={(polygon) => {
          if (polygon?.properties?.name) {
            setHoveredCountry(polygon.properties.name);
          } else {
            setHoveredCountry(null);
          }
        }}
        polygonsTransitionDuration={300}
        width={window.innerWidth}
        height={window.innerHeight}
        backgroundColor="rgba(0,0,0,0)"
        enablePointerInteraction={true}
        showPolygonStroke={true}
        showPolygonCap={true}
      />
      {/* Floating country label */}
      {hoverLabel && (
        <div
          style={{
            position: 'absolute',
            left: hoverLabel.x + 12,
            top: hoverLabel.y - 18,
            pointerEvents: 'none',
            background: 'rgba(0,0,0,0.82)',
            color: '#00ffff',
            padding: '6px 14px',
            borderRadius: 8,
            fontFamily: "'Quicksand', 'Inter', 'Segoe UI', Arial, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 12px rgba(0,255,255,0.18)',
            zIndex: 30,
            whiteSpace: 'nowrap',
            border: '1.5px solid #00ffff',
            textShadow: '0 0 6px #00ffff88',
            transition: 'opacity 0.18s',
            opacity: 1,
          }}
        >
          {hoverLabel.name}
        </div>
      )}
    </div>
  );
};

export default InteractiveGlobe;

