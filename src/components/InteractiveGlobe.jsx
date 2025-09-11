import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";

const InteractiveGlobe = ({ onCountryClick, countries, selectedCountry, onBackgroundClick }) => {
  const globeRef = useRef();
  const [hoveredCountry, setHoveredCountry] = useState(null);

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

  return (
    <Globe
      ref={globeRef}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries.features}
      polygonAltitude={(d) => {
        // Make selected country pop up to 0.15
        if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
          console.log('🎯 Setting altitude for selected country:', d.properties.name, 'vs', selectedCountry.name.common, 'to 0.15');
          return 0.15; // Pop up height for selected country
        }
        // Make hovered country slightly raised
        if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
          console.log('👆 Setting altitude for hovered country:', d.properties.name, 'vs', hoveredCountry, 'to 0.01');
          return 0.01; // Slightly raised for hovered country
        }
        return 0.005; // Even lower for others to make popup more visible
      }}
      polygonCapColor={(d) => {
        // Highlight selected country
        if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
          console.log('Setting gold color for selected country:', d.properties.name);
          return "rgba(255, 215, 0, 0.9)"; // Gold for selected
        }
        // Highlight hovered country
        if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
          return "rgba(255, 165, 0, 0.6)"; // Orange for hovered
        }
        return "rgba(0, 150, 255, 0.2)"; // Blue for others
      }}
      polygonSideColor={(d) => {
        // Highlight selected country
        if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
          return "rgba(255, 215, 0, 0.5)"; // Gold sides for selected
        }
        // Highlight hovered country
        if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
          return "rgba(255, 165, 0, 0.3)"; // Orange sides for hovered
        }
        return "rgba(0, 150, 255, 0.1)"; // Blue sides for others
      }}
      polygonStrokeColor={(d) => {
        // Highlight selected country
        if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
          return "rgba(255, 215, 0, 1)"; // Gold border for selected
        }
        // Highlight hovered country
        if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
          return "rgba(255, 165, 0, 1)"; // Orange border for hovered
        }
        return "rgba(255, 255, 255, 1)"; // White border for others
      }}
      polygonStrokeWidth={(d) => {
        // Make selected country outline much thicker
        if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
          return 8; // Much thicker border for selected
        }
        // Make hovered country outline thicker
        if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
          return 5; // Thicker border for hovered
        }
        return 2; // Thinner for others
      }}
      polygonStrokeAltitude={(d) => {
        // Make stroke follow the country surface
        if (selectedCountry && isCountryMatch(d.properties?.name, selectedCountry.name.common)) {
          return 0.15; // Same as country altitude
        }
        if (hoveredCountry && isCountryMatch(d.properties?.name, hoveredCountry)) {
          return 0.08; // Same as hovered altitude
        }
        return 0.005; // Same as country altitude
      }}
      onPolygonClick={(polygon) => {
        console.log('=== COUNTRY CLICK DETECTED ===');
        console.log('Polygon clicked:', polygon);
        console.log('Polygon properties:', polygon?.properties);
        console.log('Country name:', polygon?.properties?.name);
        console.log('Country data:', polygon?.properties?.countryData);
        console.log('Current selectedCountry:', selectedCountry);
        
        // Pass the country data instead of the polygon
        if (polygon?.properties?.countryData) {
          console.log('Calling onCountryClick with:', polygon.properties.countryData.name);
          onCountryClick(polygon.properties.countryData);
        } else {
          console.warn('No country data found for:', polygon?.properties?.name);
        }
      }}
      onGlobeReady={() => {
        console.log('Globe is ready');
      }}
      onPolygonHover={(polygon) => {
        // Set hovered country for visual feedback
        if (polygon?.properties?.name) {
          setHoveredCountry(polygon.properties.name);
          console.log('Hovering over:', polygon.properties.name);
        }
      }}
      polygonsTransitionDuration={300}
      width={window.innerWidth}
      height={window.innerHeight}
      backgroundColor="rgba(0,0,0,0)"
      enablePointerInteraction={true}
      showPolygonStroke={true}
      showPolygonCap={true}
      // Removed problematic properties that were causing material.dispose errors
    />
  );
};

export default InteractiveGlobe;

