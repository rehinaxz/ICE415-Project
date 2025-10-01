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
            "https://restcountries.com/v3.1/all?fields=name,population,languages,capital,region,currencies,timezones,area,cca2,cca3"
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
              // Add common name variations
              country.name.common.toLowerCase().replace(/\s+/g, ' '),
              country.name.official?.toLowerCase().replace(/\s+/g, ' '),
            ].filter(Boolean);

            // Add specific variations for USA
            if (country.name.common.toLowerCase().includes('united states')) {
              variations.push('united states of america', 'usa', 'us');
              console.log('🇺🇸 USA data found:', country);
            }
            
            // Add specific variations for other problematic countries
            if (country.name.common.toLowerCase().includes('eswatini')) {
              variations.push('swaziland');
            }
            if (country.name.common.toLowerCase().includes('timor-leste')) {
              variations.push('east timor', 'timor-leste');
            }
            if (country.name.common.toLowerCase().includes('united kingdom')) {
              variations.push('england', 'great britain', 'britain', 'uk');
            }
            if (country.name.common.toLowerCase().includes('russian federation')) {
              variations.push('russia');
            }
            if (country.name.common.toLowerCase().includes('people\'s republic of china')) {
              variations.push('china');
            }
            if (country.name.common.toLowerCase().includes('republic of korea')) {
              variations.push('south korea', 'korea');
            }
            if (country.name.common.toLowerCase().includes('democratic people\'s republic of korea')) {
              variations.push('north korea');
            }
            if (country.name.common.toLowerCase().includes('united states')) {
              variations.push('america', 'usa', 'us');
            }

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
          const normalizedSearchTerm = searchTerm.replace(/\s+/g, ' ').trim();
          
          if (countryMap.has(searchTerm)) {
            countryData = countryMap.get(searchTerm);
          } else if (countryMap.has(normalizedSearchTerm)) {
            countryData = countryMap.get(normalizedSearchTerm);
          } else {
            // Try partial matching for common cases
            for (const [key, value] of countryMap.entries()) {
              if (key.includes(searchTerm) || searchTerm.includes(key)) {
                countryData = value;
                break;
              }
            }
          }

          if (!countryData) {
            // Special handling for disputed territories and regions
            let specialData = null;
            if (countryName.toLowerCase().includes('west bank')) {
              specialData = {
                name: { common: "Palestine", official: "State of Palestine" },
                capital: ["Ramallah"],
                population: 5000000,
                area: 6220,
                region: "Asia",
                subregion: "Western Asia",
                currencies: { ILS: { name: "Israeli Shekel", symbol: "₪" } },
                languages: { ara: "Arabic", heb: "Hebrew" },
                timezones: ["UTC+02:00"],
                cca2: "PS",
                cca3: "PSE"
              };
            } else if (countryName.toLowerCase().includes('antarctica')) {
              specialData = {
                name: { common: "Antarctica", official: "Antarctica" },
                capital: ["No permanent capital"],
                population: 0,
                area: 14000000,
                region: "Antarctica",
                subregion: "Antarctica",
                currencies: {},
                languages: {},
                timezones: ["UTC+00:00"],
                cca2: "AQ",
                cca3: "ATA"
              };
            } else if (countryName.toLowerCase().includes('united nations') || countryName.toLowerCase().includes('un country')) {
              specialData = {
                name: { common: "United Nations", official: "United Nations" },
                capital: ["New York (Headquarters)"],
                population: 0,
                area: 0,
                region: "International Organization",
                subregion: "Global",
                currencies: {},
                languages: { eng: "English", fra: "French", spa: "Spanish", rus: "Russian", ara: "Arabic", zho: "Chinese" },
                timezones: ["UTC-05:00"],
                cca2: "UN",
                cca3: "UNO"
              };
            }
            
            countryData = specialData || {
              name: {
                common: countryName,
                official: countryName,
              },
              capital: ["N/A"],
              population: 0,
              area: 0,
              region: "N/A",
              subregion: "N/A",
              currencies: {},
              languages: {},
              timezones: [],
              cca2: "XX",
              cca3: "XXX"
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
        
        // Comprehensive country data validation
        console.log('🔍 Validating country data...');
        const validationResults = features.map(feature => {
          const countryData = feature.properties.countryData;
          const hasValidData = countryData && 
            countryData.name && 
            countryData.name.common && 
            countryData.capital && 
            countryData.population > 0;
          
          // Check for specific data quality issues
          const issues = [];
          if (!countryData) issues.push('No country data');
          if (!countryData?.name?.common) issues.push('Missing country name');
          
          // Special handling for Antarctica and other non-countries
          const isAntarctica = countryData?.name?.common?.toLowerCase().includes('antarctica');
          const isUnitedNations = countryData?.name?.common?.toLowerCase().includes('united nations');
          const isSpecialTerritory = isAntarctica || isUnitedNations;
          
          if (!isSpecialTerritory) {
            if (!countryData?.capital || countryData.capital.length === 0) issues.push('Missing capital');
            if (!countryData?.population || countryData.population === 0) issues.push('Missing population');
            if (!countryData?.region || countryData.region === 'N/A') issues.push('Missing region');
            if (!countryData?.languages || Object.keys(countryData.languages).length === 0) issues.push('Missing languages');
            if (!countryData?.currencies || Object.keys(countryData.currencies).length === 0) issues.push('Missing currencies');
          }
          
          if (issues.length > 0) {
            console.warn(`⚠️ Issues for ${feature.properties.name}:`, issues.join(', '));
          }
          
          return {
            name: feature.properties.name,
            hasValidData,
            issues,
            data: countryData
          };
        });
        
        const validCountries = validationResults.filter(r => r.hasValidData).length;
        const totalCountries = validationResults.length;
        const countriesWithIssues = validationResults.filter(r => r.issues.length > 0);
        
        console.log(`✅ Data validation: ${validCountries}/${totalCountries} countries have complete data`);
        console.log(`⚠️ Countries with issues: ${countriesWithIssues.length}`);
        
        // Log major countries status
        const majorCountries = ['United States', 'China', 'India', 'Brazil', 'Russia', 'United Kingdom', 'France', 'Germany', 'Japan'];
        majorCountries.forEach(countryName => {
          const result = validationResults.find(r => r.name === countryName);
          if (result) {
            console.log(`🌍 ${countryName}: ${result.hasValidData ? '✅ Complete' : '❌ Issues: ' + result.issues.join(', ')}`);
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error processing data:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryClick = (countryData) => {
    console.log('🌍 Country clicked:', countryData);
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
      {/* Back button with proper margins */}
      <div className="absolute z-[9999] top-4 left-4">
        <Link 
          to="/" 
          className="btn-arcade"
          style={{
            margin: "20px",
          }}
        >
          Back to Home
        </Link>
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
