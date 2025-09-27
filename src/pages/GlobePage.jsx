// src/pages/GlobePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import InteractiveGlobe from "../components/InteractiveGlobe";
import CountryInfo from "../components/CountryInfo";

export default function GlobePage() {
  const [countries, setCountries] = useState({ features: [] });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const countryInfoRef = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const geoJsonResponse = await fetch(
          "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
        );
        const geoJsonData = await geoJsonResponse.json();

        console.log("🚀 Fetching country data from REST Countries API...");
        let countriesData = [];

        try {
          console.log(
            "📡 Attempting to fetch from REST Countries API v3.1 with field filtering..."
          );
          const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,population,languages,capital,region,currencies,timezones,area"
          );

          if (response.ok) {
            countriesData = await response.json();
            console.log(
              "✅ Successfully fetched",
              countriesData.length,
              "countries from REST Countries API v3.1"
            );
          } else {
            throw new Error(`API returned status: ${response.status}`);
          }
        } catch (error) {
          console.warn("⚠️ REST Countries API v3.1 failed:", error.message);
          countriesData = [];
        }

        const countryMap = new Map();
        countriesData.forEach((country) => {
          if (country.name?.common) {
            const variations = [
              country.name.common.toLowerCase(),
              country.name.official?.toLowerCase(),
            ].filter(Boolean);

            variations.forEach((variation) => {
              if (variation && !countryMap.has(variation)) {
                countryMap.set(variation, country);
              }
            });
          }
        });

        const features = geoJsonData.features.map((feature) => {
          const countryName =
            feature.properties?.NAME ||
            feature.properties?.name ||
            feature.properties?.ADMIN ||
            "Unknown Country";
          let countryData = null;

          const searchTerm = countryName.toLowerCase();
          if (countryMap.has(searchTerm)) {
            countryData = countryMap.get(searchTerm);
          }

          if (!countryData) {
            countryData = {
              name: {
                common: countryName,
                official: countryName,
              },
              capital: ["N/A"],
              population: 0,
              area: 0,
              region: "N/A",
              currencies: {},
              languages: {},
              timezones: [],
            };
          }

          return {
            ...feature,
            properties: {
              ...feature.properties,
              name: countryName,
              countryData: countryData,
            },
          };
        });

        setCountries({ features });
        setLoading(false);
      } catch (error) {
        console.error("Error processing data:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryClick = (countryData) => {
    console.log("=== COUNTRY CLICKED ===");
    console.log("Country name:", countryData?.name?.common);
    setSelectedCountry(countryData);
  };

  const handleCloseCountryInfo = () => {
    setSelectedCountry(null);
  };

  const handleGlobeBackgroundClick = () => {
    if (selectedCountry) {
      setSelectedCountry(null);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape" && selectedCountry) {
        setSelectedCountry(null);
      }
    };

    if (selectedCountry) {
      document.addEventListener("keydown", handleKeyPress);
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [selectedCountry]);

  return (
    <div
      className="relative flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
      onClick={(e) => {
        if (e.target === e.currentTarget && selectedCountry) {
          setSelectedCountry(null);
        }
      }}
    >
      {/* Floating Back button */}
      <div className="absolute top-4 left-4 z-50 pointer-events-auto">
  <Link to="/" className="btn-arcade">Back to Home</Link>
</div>

      {/* Globe Container */}
      <div
        className="flex-1 max-w-[calc(100vw-320px)] globe-container relative z-0"
        onDoubleClick={() => {
          if (selectedCountry) setSelectedCountry(null);
        }}
      >
        <InteractiveGlobe
          countries={countries}
          onCountryClick={handleCountryClick}
          selectedCountry={selectedCountry}
          loading={loading}
          onBackgroundClick={handleGlobeBackgroundClick}
        />
      </div>

      {/* Country Information Panel */}
      <div
        ref={countryInfoRef}
        className="bg-transparent"
        style={{ paddingTop: "40px", width: "300px", minWidth: "300px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <CountryInfo
          country={selectedCountry}
          onClose={handleCloseCountryInfo}
        />
      </div>
    </div>
  );
}
