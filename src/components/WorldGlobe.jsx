// src/components/WorldGlobe.jsx
import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as topojson from "topojson-client";
import PropTypes from "prop-types";

/**
 * Props:
 * - onCountryClick(polyFeature, countryName) : function called when a country is clicked
 * - focus: [lat, lng]   : optional, auto-fly camera to these coords
 * - label: [lat, lng]   : optional, show a small "You are here" label
 * - height: number      : canvas height (default 520)
 */
const WorldGlobe = ({ onCountryClick, focus, label, height = 520 }) => {
  const globeRef = useRef();
  const [countriesPoly, setCountriesPoly] = useState([]);
  const [loadErr, setLoadErr] = useState(null);

  // Load country polygons from world-atlas
  useEffect(() => {
    (async () => {
      try {
        const topo = await (
          await fetch("https://unpkg.com/world-atlas@2/countries-110m.json")
        ).json();
        const polys =
          topojson.feature(topo, topo.objects.countries)?.features || [];
        setCountriesPoly(polys);
      } catch (e) {
        console.error("WorldGlobe: failed to load polygons", e);
        setLoadErr(e);
      }
    })();
  }, []);

  // Fly to focus point if provided
  useEffect(() => {
    if (!globeRef.current || !focus) return;
    const [lat, lng] = focus;
    globeRef.current.pointOfView({ lat, lng, altitude: 1.8 }, 1200);
  }, [focus]);

  if (loadErr) {
    return (
      <div
        style={{
          height,
          display: "grid",
          placeItems: "center",
          color: "#fff",
          borderRadius: 16,
          background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(255,255,255,.1)",
        }}
      >
        Failed to load globe data.
      </div>
    );
  }

  return (
    <div
      style={{
        height,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,.35)",
      }}
    >
      <Globe
        ref={globeRef}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        // Optional single label (e.g., current focus)
        labelsData={label ? [{ lat: label[0], lng: label[1], text: "You are here" }] : []}
        labelText={(d) => d.text}
        labelSize={1.2}
        // Country polygons
        polygonsData={countriesPoly}
        polygonAltitude={0.02}
        polygonCapColor={() => "rgba(124, 58, 237, 0.25)"}   // violet-ish cap
        polygonSideColor={() => "rgba(124, 58, 237, 0.35)"}  // violet-ish side
        polygonStrokeColor={() => "rgba(255,255,255,.3)"}
        onPolygonClick={(poly) => onCountryClick?.(poly, poly?.properties?.name)}
      />
    </div>
  );
};

WorldGlobe.propTypes = {
  onCountryClick: PropTypes.func,
  focus: PropTypes.array, // [lat, lng]
  label: PropTypes.array, // [lat, lng]
  height: PropTypes.number,
};

export default WorldGlobe;
