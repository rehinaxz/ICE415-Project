import React, { useState, useEffect, useRef } from 'react';
import InteractiveGlobe from '../components/InteractiveGlobe';
import CountryInfo from '../components/CountryInfo';

export default function GlobePage() {
  const [countries, setCountries] = useState({ features: [] });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const countryInfoRef = useRef(null);

  useEffect(() => {
    // Fetch GeoJSON data and simplified country data
    const fetchCountries = async () => {
      try {
        // Always fetch GeoJSON first
        const geoJsonResponse = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const geoJsonData = await geoJsonResponse.json();
        
        // Fetch data from REST Countries API with field filtering
        console.log('🚀 Fetching country data from REST Countries API...');
        let countriesData = [];
        
        try {
          // Try REST Countries API v3.1 with field filtering
          console.log('📡 Attempting to fetch from REST Countries API v3.1 with field filtering...');
          const response = await fetch('https://restcountries.com/v3.1/all?fields=name,population,languages,capital,region,currencies,timezones,area');
          
          if (response.ok) {
            countriesData = await response.json();
            console.log('✅ Successfully fetched', countriesData.length, 'countries from REST Countries API v3.1');
          } else {
            throw new Error(`API returned status: ${response.status}`);
          }
        } catch (error) {
          console.warn('⚠️ REST Countries API v3.1 failed:', error.message);
          
          try {
            // Try REST Countries API v2 as fallback
            console.log('📡 Trying REST Countries API v2...');
            const response = await fetch('https://restcountries.com/v2/all');
            
            if (response.ok) {
              const v2Data = await response.json();
              // Convert v2 format to v3 format for consistency
              countriesData = v2Data.map(country => ({
                name: {
                  common: country.name,
                  official: country.name
                },
                capital: country.capital ? [country.capital] : [],
                population: country.population,
                area: country.area,
                region: country.region,
                currencies: country.currencies,
                languages: country.languages,
                timezones: country.timezones || []
              }));
              console.log('✅ Successfully fetched', countriesData.length, 'countries from REST Countries API v2');
            } else {
              throw new Error(`API v2 returned status: ${response.status}`);
            }
          } catch (v2Error) {
            console.error('❌ Both REST Countries API versions failed:', v2Error.message);
            console.log('🔄 Using minimal fallback data...');
            
            // If API fails completely, return empty array - we'll handle this in the UI
            countriesData = [];
            console.log('❌ No API data available - countries will show basic info only');
          }
        }
        
        // Create a map of country names to country data for quick lookup
        const countryMap = new Map();
        console.log('🗺️ Creating country map with', countriesData.length, 'countries');
        
        countriesData.forEach(country => {
          if (country.name?.common) {
            // Add multiple variations for better matching
            const variations = [
              country.name.common.toLowerCase(),
              country.name.official?.toLowerCase(),
              country.name.common.toLowerCase().replace(/\s+/g, ''),
              country.name.common.toLowerCase().replace(/[^a-z]/g, ''),
              // Add common name variations
              ...(country.name.common.includes('United States') ? ['usa', 'america', 'us'] : []),
              ...(country.name.common.includes('United Kingdom') ? ['uk', 'britain', 'england'] : []),
              ...(country.name.common.includes('South Korea') ? ['korea', 'south korea'] : []),
              ...(country.name.common.includes('North Korea') ? ['north korea', 'dprk'] : []),
              ...(country.name.common.includes('Czech Republic') ? ['czechia'] : []),
              ...(country.name.common.includes('Republic of the Congo') ? ['congo'] : []),
              ...(country.name.common.includes('Democratic Republic of the Congo') ? ['drc', 'congo'] : []),
              ...(country.name.common.includes('Ivory Coast') ? ['cote divoire'] : []),
              ...(country.name.common.includes('Cape Verde') ? ['cabo verde'] : []),
              ...(country.name.common.includes('East Timor') ? ['timor leste'] : []),
              ...(country.name.common.includes('Swaziland') ? ['eswatini'] : []),
              ...(country.name.common.includes('Macedonia') ? ['north macedonia'] : []),
              ...(country.name.common.includes('Myanmar') ? ['burma'] : []),
              ...(country.name.common.includes('Vatican') ? ['holy see'] : [])
            ].filter(Boolean);
            
            variations.forEach(variation => {
              if (variation && !countryMap.has(variation)) {
                countryMap.set(variation, country);
              }
            });
          }
        });
        
        if (countriesData.length > 0) {
          console.log('📊 Fallback includes countries like:', countriesData.slice(0, 5).map(c => c.name?.common || 'Unknown').join(', '), '...');
        } else {
          console.log('📊 No API data available - using GeoJSON names only');
        }
        
        // Process GeoJSON features and match with country data
        const features = geoJsonData.features.map(feature => {
          const countryName = feature.properties?.NAME || feature.properties?.name || feature.properties?.ADMIN || 'Unknown Country';
          let countryData = null;
          
          // Try to find matching country data
          const searchTerms = [
            countryName.toLowerCase(),
            countryName.toLowerCase().replace(/\s+/g, ''),
            countryName.toLowerCase().replace(/[^a-z]/g, ''),
            // Handle special cases
            ...(countryName.toLowerCase().includes('united states') ? ['usa', 'america'] : []),
            ...(countryName.toLowerCase().includes('united kingdom') ? ['uk', 'britain'] : []),
            ...(countryName.toLowerCase().includes('south korea') ? ['korea'] : []),
            ...(countryName.toLowerCase().includes('czech') ? ['czechia'] : []),
            ...(countryName.toLowerCase().includes('congo') ? ['congo'] : []),
            ...(countryName.toLowerCase().includes('ivory coast') ? ['cote divoire'] : []),
            ...(countryName.toLowerCase().includes('cape verde') ? ['cabo verde'] : []),
            ...(countryName.toLowerCase().includes('east timor') ? ['timor leste'] : []),
            ...(countryName.toLowerCase().includes('swaziland') ? ['eswatini'] : []),
            ...(countryName.toLowerCase().includes('macedonia') ? ['north macedonia'] : []),
            ...(countryName.toLowerCase().includes('myanmar') ? ['burma'] : []),
            ...(countryName.toLowerCase().includes('vatican') ? ['holy see'] : [])
          ];
          
          for (const term of searchTerms) {
            if (countryMap.has(term)) {
              countryData = countryMap.get(term);
              break;
            }
          }
          
          // Special case for USA
          if (!countryData && (countryName.toLowerCase().includes('united states') ||
                              countryName.toLowerCase().includes('usa') ||
                              countryName.toLowerCase().includes('america'))) {
            countryData = countryMap.get('united states');
          }
          
          // If no API data found, create basic country data from GeoJSON
          if (!countryData) {
            countryData = {
              name: {
                common: countryName,
                official: countryName
              },
              capital: ['N/A'],
              population: 0,
              area: 0,
              region: 'N/A',
              currencies: {},
              languages: {},
              timezones: []
            };
          }
          
          return {
            ...feature,
            properties: {
              ...feature.properties,
              name: countryName,
              countryData: countryData
            }
          };
        });
        
        console.log('🌍 Processed', features.length, 'countries with', features.filter(f => f.properties.countryData).length, 'having detailed data');
        console.log('📋 Sample countries with data:', features.filter(f => f.properties.countryData).slice(0, 3).map(f => ({
          name: f.properties.name,
          hasData: !!f.properties.countryData,
          dataKeys: f.properties.countryData ? Object.keys(f.properties.countryData) : []
        })));
        setCountries({ features });
        setLoading(false);
      } catch (error) {
        console.error('Error processing data:', error);
        // Even if there's an error, try to set basic features to keep globe working
        try {
          const geoJsonResponse = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
          const geoJsonData = await geoJsonResponse.json();
          const basicFeatures = geoJsonData.features.map(feature => ({
            ...feature,
            properties: {
              ...feature.properties,
              name: feature.properties?.NAME || feature.properties?.name || feature.properties?.ADMIN || 'Unknown Country'
            }
          }));
          setCountries({ features: basicFeatures });
          console.log('Loaded basic features as fallback:', basicFeatures.length);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryClick = (countryData) => {
    console.log('=== COUNTRY CLICKED ===');
    console.log('Country data received:', countryData);
    console.log('Country name:', countryData?.name?.common);
    setSelectedCountry(countryData);
  };

  const handleCloseCountryInfo = () => {
    setSelectedCountry(null);
  };

  // Handle background clicks from the globe
  const handleGlobeBackgroundClick = () => {
    if (selectedCountry) {
      console.log('Globe background click - closing panel');
      setSelectedCountry(null);
    }
  };

  // Add keyboard listener for closing panel
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape' && selectedCountry) {
        console.log('Escape key pressed - closing panel');
        setSelectedCountry(null);
      }
    };

    if (selectedCountry) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [selectedCountry]);

  return (
    <div 
      className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
      onClick={(e) => {
        // Only close if clicking directly on the main container background
        if (e.target === e.currentTarget && selectedCountry) {
          console.log('Main container background click - closing panel');
          setSelectedCountry(null);
        }
      }}
    >
      {/* Globe Container */}
      <div 
        className="flex-1 max-w-[calc(100vw-320px)] globe-container"
        onDoubleClick={() => {
          if (selectedCountry) {
            console.log('Double click on globe container - closing panel');
            setSelectedCountry(null);
          }
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
        style={{ paddingTop: '40px', width: '300px', minWidth: '300px' }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on panel from bubbling up
      >
        <CountryInfo 
          country={selectedCountry} 
          onClose={handleCloseCountryInfo}
        />
      </div>
    </div>
  );
}