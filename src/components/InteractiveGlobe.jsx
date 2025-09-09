import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";

const InteractiveGlobe = ({ onCountryClick, countries, selectedCountry }) => {
  const globeRef = useRef();

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
        if (selectedCountry && d.properties?.name === selectedCountry.name.common) {
          console.log('Setting altitude for selected country:', d.properties.name, 'to 0.15');
          return 0.15; // Pop up height for selected country
        }
        return 0.005; // Even lower for others to make popup more visible
      }}
      polygonCapColor={(d) => {
        // Highlight selected country
        if (selectedCountry && d.properties?.name === selectedCountry.name.common) {
          console.log('Setting gold color for selected country:', d.properties.name);
          return "rgba(255, 215, 0, 0.9)"; // Gold for selected
        }
        return "rgba(0, 150, 255, 0.2)"; // Blue for others
      }}
      polygonSideColor={(d) => {
        // Highlight selected country
        if (selectedCountry && d.properties?.name === selectedCountry.name.common) {
          return "rgba(255, 215, 0, 0.5)"; // Gold sides for selected
        }
        return "rgba(0, 150, 255, 0.1)"; // Blue sides for others
      }}
      polygonStrokeColor={(d) => {
        // Highlight selected country
        if (selectedCountry && d.properties?.name === selectedCountry.name.common) {
          return "rgba(255, 215, 0, 1)"; // Gold border for selected (same as fill)
        }
        return "rgba(255, 255, 255, 1)"; // White border for others
      }}
      polygonStrokeWidth={(d) => {
        // Make selected country outline much thicker
        if (selectedCountry && d.properties?.name === selectedCountry.name.common) {
          return 8; // Much thicker border for selected
        }
        return 2; // Thinner for others
      }}
      polygonStrokeAltitude={(d) => {
        // Make stroke follow the country surface
        if (selectedCountry && d.properties?.name === selectedCountry.name.common) {
          return 0.15; // Same as country altitude
        }
        return 0.005; // Same as country altitude
      }}
      onPolygonClick={(polygon) => {
        console.log('=== CLICK DETECTED ===');
        console.log('Polygon clicked:', polygon);
        console.log('Polygon properties:', polygon?.properties);
        console.log('Country name:', polygon?.properties?.name);
        console.log('Current selectedCountry:', selectedCountry);
        onCountryClick(polygon);
      }}
      onPolygonHover={(polygon) => {
        // Simple hover effect without re-rendering
        console.log('Hovering over:', polygon?.properties?.name);
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

