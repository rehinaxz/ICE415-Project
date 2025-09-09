import React, { useState, useEffect } from 'react';
import InteractiveGlobe from '../components/InteractiveGlobe';
import CountryInfo from '../components/CountryInfo';

export default function GlobePage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState({ features: [] });
  const [loading, setLoading] = useState(true);
  const [clickPopup, setClickPopup] = useState(null);
  
  // Monitor selectedCountry changes
  useEffect(() => {
    if (selectedCountry) {
      console.log('Country selected:', selectedCountry.name?.common);
    }
  }, [selectedCountry]);

  useEffect(() => {
    // Fetch GeoJSON data and optionally REST Countries API data
    const fetchCountries = async () => {
      try {
        // Always fetch GeoJSON first
        const geoJsonResponse = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const geoJsonData = await geoJsonResponse.json();
        
        // Try to fetch country data from multiple sources
        let countriesData = [];
        console.log('🚀 Starting country data fetch process...');
        try {
          // Try multiple approaches to get country data
          console.log('Attempting to fetch comprehensive country data...');
          
          // Try REST Countries API v3.1 first
          let countriesResponse = await fetch('https://restcountries.com/v3.1/all');
          
          if (!countriesResponse.ok) {
            // Try REST Countries API v2
            console.warn('REST Countries v3.1 failed, trying v2...');
            countriesResponse = await fetch('https://restcountries.com/v2/all');
          }
          
          if (!countriesResponse.ok) {
            // Try alternative API endpoints
            console.warn('REST Countries failed, trying alternative endpoints...');
            try {
              // Try individual country endpoints to build comprehensive data
              const majorCountries = [
                'usa', 'canada', 'mexico', 'brazil', 'argentina', 'chile', 'colombia', 'peru', 'venezuela', 'ecuador',
                'france', 'germany', 'united-kingdom', 'italy', 'spain', 'russia', 'poland', 'netherlands', 'sweden', 'norway',
                'china', 'india', 'japan', 'indonesia', 'pakistan', 'bangladesh', 'south-korea', 'thailand', 'vietnam', 'philippines',
                'nigeria', 'ethiopia', 'egypt', 'south-africa', 'kenya', 'tanzania', 'algeria', 'sudan', 'uganda', 'morocco',
                'australia', 'new-zealand', 'papua-new-guinea', 'fiji', 'solomon-islands'
              ];
              
              const countryPromises = majorCountries.map(async (country) => {
                try {
                  const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
                  if (response.ok) {
                    const data = await response.json();
                    return data[0]; // Return first result
                  }
                } catch (e) {
                  console.warn(`Failed to fetch ${country}:`, e);
                }
                return null;
              });
              
              const results = await Promise.all(countryPromises);
              console.log('Individual country fetch results:', results.length, 'total,', results.filter(r => r !== null).length, 'successful');
              countriesData = results.filter(country => country !== null);
              console.log('Fetched individual country data:', countriesData.length, 'countries');
              
        // If no countries were successfully fetched, set to empty array to trigger fallback
        if (countriesData.length === 0) {
          console.log('No individual countries fetched successfully, will use fallback data');
          countriesData = [];
        } else {
          console.log('Some individual countries fetched successfully, but forcing fallback anyway since APIs are unreliable');
          countriesData = [];
        }
            } catch (altError) {
              console.warn('Alternative approach failed:', altError);
              // Ensure countriesData is empty so fallback triggers
              countriesData = [];
              console.log('🔧 Set countriesData to empty array in altError catch block');
            }
          } else {
            countriesData = await countriesResponse.json();
            console.log('Successfully fetched country data:', countriesData.length, 'countries');
          }
        } catch (apiError) {
          console.warn('Could not fetch country data from any API, using comprehensive fallback data...', apiError);
          // Ensure countriesData is empty so fallback triggers
          countriesData = [];
          console.log('🔧 Set countriesData to empty array in catch block');
        }
        
        // If no API data, create comprehensive fallback data with many countries
        console.log('🔍 Checking if fallback should trigger. countriesData.length:', countriesData.length);
        console.log('🔍 countriesData type:', typeof countriesData, 'isArray:', Array.isArray(countriesData));
        
        // Force fallback if countriesData is empty or undefined
        if (!countriesData || countriesData.length === 0) {
          console.log('✅ Creating comprehensive fallback country data...');
          console.log('🔧 Forcing fallback because countriesData is empty or undefined');
          countriesData = [
            // Americas
            { name: { common: 'Brazil', official: 'Federative Republic of Brazil' }, capital: ['Brasília'], population: 212559417, area: 8515767, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/br.png' } },
            { name: { common: 'Canada', official: 'Canada' }, capital: ['Ottawa'], population: 38005238, area: 9984670, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/ca.png' } },
            { name: { common: 'United States', official: 'United States of America' }, capital: ['Washington, D.C.'], population: 329484123, area: 9833517, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/us.png' } },
            { name: { common: 'Argentina', official: 'Argentine Republic' }, capital: ['Buenos Aires'], population: 45376763, area: 2780400, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/ar.png' } },
            { name: { common: 'Mexico', official: 'United Mexican States' }, capital: ['Mexico City'], population: 128932753, area: 1964375, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/mx.png' } },
            { name: { common: 'Chile', official: 'Republic of Chile' }, capital: ['Santiago'], population: 19116209, area: 756102, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/cl.png' } },
            { name: { common: 'Colombia', official: 'Republic of Colombia' }, capital: ['Bogotá'], population: 50882884, area: 1141748, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/co.png' } },
            { name: { common: 'Peru', official: 'Republic of Peru' }, capital: ['Lima'], population: 32971846, area: 1285216, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/pe.png' } },
            { name: { common: 'Venezuela', official: 'Bolivarian Republic of Venezuela' }, capital: ['Caracas'], population: 28435943, area: 916445, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/ve.png' } },
            { name: { common: 'Ecuador', official: 'Republic of Ecuador' }, capital: ['Quito'], population: 17643060, area: 276841, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/ec.png' } },
            { name: { common: 'United States', official: 'United States of America' }, capital: ['Washington, D.C.'], population: 329484123, area: 9833517, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/us.png' } },
            
            // Europe
            { name: { common: 'France', official: 'French Republic' }, capital: ['Paris'], population: 67391582, area: 551695, region: 'Europe', subregion: 'Western Europe', flags: { png: 'https://flagcdn.com/w320/fr.png' } },
            { name: { common: 'Germany', official: 'Federal Republic of Germany' }, capital: ['Berlin'], population: 83240525, area: 357114, region: 'Europe', subregion: 'Western Europe', flags: { png: 'https://flagcdn.com/w320/de.png' } },
            { name: { common: 'United Kingdom', official: 'United Kingdom of Great Britain and Northern Ireland' }, capital: ['London'], population: 67215293, area: 242900, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/gb.png' } },
            { name: { common: 'Italy', official: 'Italian Republic' }, capital: ['Rome'], population: 59554023, area: 301336, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/it.png' } },
            { name: { common: 'Spain', official: 'Kingdom of Spain' }, capital: ['Madrid'], population: 47351567, area: 505992, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/es.png' } },
            { name: { common: 'Russia', official: 'Russian Federation' }, capital: ['Moscow'], population: 146171015, area: 17098242, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/ru.png' } },
            { name: { common: 'Poland', official: 'Republic of Poland' }, capital: ['Warsaw'], population: 37950802, area: 312679, region: 'Europe', subregion: 'Central Europe', flags: { png: 'https://flagcdn.com/w320/pl.png' } },
            { name: { common: 'Netherlands', official: 'Kingdom of the Netherlands' }, capital: ['Amsterdam'], population: 16655799, area: 41850, region: 'Europe', subregion: 'Western Europe', flags: { png: 'https://flagcdn.com/w320/nl.png' } },
            { name: { common: 'Sweden', official: 'Kingdom of Sweden' }, capital: ['Stockholm'], population: 10353442, area: 450295, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/se.png' } },
            { name: { common: 'Norway', official: 'Kingdom of Norway' }, capital: ['Oslo'], population: 5379475, area: 323802, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/no.png' } },
            
            // Asia
            { name: { common: 'China', official: "People's Republic of China" }, capital: ['Beijing'], population: 1402112000, area: 9706961, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/cn.png' } },
            { name: { common: 'India', official: 'Republic of India' }, capital: ['New Delhi'], population: 1380004385, area: 3287590, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/in.png' } },
            { name: { common: 'Japan', official: 'Japan' }, capital: ['Tokyo'], population: 125836021, area: 377975, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/jp.png' } },
            { name: { common: 'Indonesia', official: 'Republic of Indonesia' }, capital: ['Jakarta'], population: 273523621, area: 1904569, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/id.png' } },
            { name: { common: 'Pakistan', official: 'Islamic Republic of Pakistan' }, capital: ['Islamabad'], population: 220892331, area: 881912, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/pk.png' } },
            { name: { common: 'Bangladesh', official: "People's Republic of Bangladesh" }, capital: ['Dhaka'], population: 164689383, area: 147570, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/bd.png' } },
            { name: { common: 'South Korea', official: 'Republic of Korea' }, capital: ['Seoul'], population: 51780579, area: 100210, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/kr.png' } },
            { name: { common: 'Thailand', official: 'Kingdom of Thailand' }, capital: ['Bangkok'], population: 69799978, area: 513120, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/th.png' } },
            { name: { common: 'Vietnam', official: 'Socialist Republic of Vietnam' }, capital: ['Hanoi'], population: 97338583, area: 331212, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/vn.png' } },
            { name: { common: 'Philippines', official: 'Republic of the Philippines' }, capital: ['Manila'], population: 109581085, area: 342353, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/ph.png' } },
            
            // Africa
            { name: { common: 'Nigeria', official: 'Federal Republic of Nigeria' }, capital: ['Abuja'], population: 206139587, area: 923768, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/ng.png' } },
            { name: { common: 'Ethiopia', official: 'Federal Democratic Republic of Ethiopia' }, capital: ['Addis Ababa'], population: 114963583, area: 1104300, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/et.png' } },
            { name: { common: 'Egypt', official: 'Arab Republic of Egypt' }, capital: ['Cairo'], population: 102334403, area: 1001449, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/eg.png' } },
            { name: { common: 'South Africa', official: 'Republic of South Africa' }, capital: ['Cape Town', 'Pretoria', 'Bloemfontein'], population: 59308690, area: 1221037, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/za.png' } },
            { name: { common: 'Kenya', official: 'Republic of Kenya' }, capital: ['Nairobi'], population: 53771296, area: 580367, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/ke.png' } },
            { name: { common: 'Tanzania', official: 'United Republic of Tanzania' }, capital: ['Dodoma'], population: 59734213, area: 945087, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/tz.png' } },
            { name: { common: 'Algeria', official: "People's Democratic Republic of Algeria" }, capital: ['Algiers'], population: 43851043, area: 2381741, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/dz.png' } },
            { name: { common: 'Sudan', official: 'Republic of the Sudan' }, capital: ['Khartoum'], population: 43849269, area: 1886068, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/sd.png' } },
            { name: { common: 'Uganda', official: 'Republic of Uganda' }, capital: ['Kampala'], population: 45741000, area: 241550, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/ug.png' } },
            { name: { common: 'Morocco', official: 'Kingdom of Morocco' }, capital: ['Rabat'], population: 36910558, area: 446550, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/ma.png' } },
            
            // Oceania
            { name: { common: 'Australia', official: 'Commonwealth of Australia' }, capital: ['Canberra'], population: 25687041, area: 7692024, region: 'Oceania', subregion: 'Australia and New Zealand', flags: { png: 'https://flagcdn.com/w320/au.png' } },
            { name: { common: 'New Zealand', official: 'New Zealand' }, capital: ['Wellington'], population: 5084300, area: 270467, region: 'Oceania', subregion: 'Australia and New Zealand', flags: { png: 'https://flagcdn.com/w320/nz.png' } },
            { name: { common: 'Papua New Guinea', official: 'Independent State of Papua New Guinea' }, capital: ['Port Moresby'], population: 8947027, area: 462840, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/pg.png' } },
            { name: { common: 'Fiji', official: 'Republic of Fiji' }, capital: ['Suva'], population: 896444, area: 18272, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/fj.png' } },
            { name: { common: 'Solomon Islands', official: 'Solomon Islands' }, capital: ['Honiara'], population: 686878, area: 28896, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/sb.png' } },
            
            // Additional European Countries
            { name: { common: 'Switzerland', official: 'Swiss Confederation' }, capital: ['Bern'], population: 8654622, area: 41284, region: 'Europe', subregion: 'Western Europe', flags: { png: 'https://flagcdn.com/w320/ch.png' } },
            { name: { common: 'Austria', official: 'Republic of Austria' }, capital: ['Vienna'], population: 8917205, area: 83871, region: 'Europe', subregion: 'Central Europe', flags: { png: 'https://flagcdn.com/w320/at.png' } },
            { name: { common: 'Belgium', official: 'Kingdom of Belgium' }, capital: ['Brussels'], population: 11555997, area: 30528, region: 'Europe', subregion: 'Western Europe', flags: { png: 'https://flagcdn.com/w320/be.png' } },
            { name: { common: 'Denmark', official: 'Kingdom of Denmark' }, capital: ['Copenhagen'], population: 5831404, area: 43094, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/dk.png' } },
            { name: { common: 'Finland', official: 'Republic of Finland' }, capital: ['Helsinki'], population: 5530719, area: 338424, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/fi.png' } },
            { name: { common: 'Greece', official: 'Hellenic Republic' }, capital: ['Athens'], population: 10715549, area: 131990, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/gr.png' } },
            { name: { common: 'Ireland', official: 'Republic of Ireland' }, capital: ['Dublin'], population: 4994724, area: 70273, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/ie.png' } },
            { name: { common: 'Portugal', official: 'Portuguese Republic' }, capital: ['Lisbon'], population: 10305564, area: 92090, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/pt.png' } },
            { name: { common: 'Czech Republic', official: 'Czech Republic' }, capital: ['Prague'], population: 10698896, area: 78865, region: 'Europe', subregion: 'Central Europe', flags: { png: 'https://flagcdn.com/w320/cz.png' } },
            { name: { common: 'Hungary', official: 'Hungary' }, capital: ['Budapest'], population: 9749763, area: 93028, region: 'Europe', subregion: 'Central Europe', flags: { png: 'https://flagcdn.com/w320/hu.png' } },
            
            // Additional Asian Countries
            { name: { common: 'Malaysia', official: 'Malaysia' }, capital: ['Kuala Lumpur'], population: 32365999, area: 330803, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/my.png' } },
            { name: { common: 'Singapore', official: 'Republic of Singapore' }, capital: ['Singapore'], population: 5685807, area: 710, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/sg.png' } },
            { name: { common: 'Myanmar', official: 'Republic of the Union of Myanmar' }, capital: ['Naypyidaw'], population: 54409794, area: 676578, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/mm.png' } },
            { name: { common: 'Cambodia', official: 'Kingdom of Cambodia' }, capital: ['Phnom Penh'], population: 16718965, area: 181035, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/kh.png' } },
            { name: { common: 'Laos', official: "Lao People's Democratic Republic" }, capital: ['Vientiane'], population: 7275560, area: 236800, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/la.png' } },
            { name: { common: 'Sri Lanka', official: 'Democratic Socialist Republic of Sri Lanka' }, capital: ['Colombo'], population: 21919000, area: 65610, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/lk.png' } },
            { name: { common: 'Nepal', official: 'Federal Democratic Republic of Nepal' }, capital: ['Kathmandu'], population: 29136808, area: 147181, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/np.png' } },
            { name: { common: 'Bhutan', official: 'Kingdom of Bhutan' }, capital: ['Thimphu'], population: 771608, area: 38394, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/bt.png' } },
            { name: { common: 'Maldives', official: 'Republic of the Maldives' }, capital: ['Malé'], population: 540542, area: 300, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/mv.png' } },
            { name: { common: 'Afghanistan', official: 'Islamic Emirate of Afghanistan' }, capital: ['Kabul'], population: 40218234, area: 652230, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/af.png' } },
            
            // Additional African Countries
            { name: { common: 'Ghana', official: 'Republic of Ghana' }, capital: ['Accra'], population: 31072940, area: 238533, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/gh.png' } },
            { name: { common: 'Ivory Coast', official: "Republic of Côte d'Ivoire" }, capital: ['Yamoussoukro'], population: 26378274, area: 322463, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/ci.png' } },
            { name: { common: 'Senegal', official: 'Republic of Senegal' }, capital: ['Dakar'], population: 16743927, area: 196722, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/sn.png' } },
            { name: { common: 'Mali', official: 'Republic of Mali' }, capital: ['Bamako'], population: 20250833, area: 1240192, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/ml.png' } },
            { name: { common: 'Burkina Faso', official: 'Burkina Faso' }, capital: ['Ouagadougou'], population: 20903273, area: 272967, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/bf.png' } },
            { name: { common: 'Niger', official: 'Republic of Niger' }, capital: ['Niamey'], population: 24206644, area: 1267000, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/ne.png' } },
            { name: { common: 'Chad', official: 'Republic of Chad' }, capital: ['N\'Djamena'], population: 16425864, area: 1284000, region: 'Africa', subregion: 'Middle Africa', flags: { png: 'https://flagcdn.com/w320/td.png' } },
            { name: { common: 'Cameroon', official: 'Republic of Cameroon' }, capital: ['Yaoundé'], population: 26545863, area: 475442, region: 'Africa', subregion: 'Middle Africa', flags: { png: 'https://flagcdn.com/w320/cm.png' } },
            { name: { common: 'Central African Republic', official: 'Central African Republic' }, capital: ['Bangui'], population: 4829767, area: 622984, region: 'Africa', subregion: 'Middle Africa', flags: { png: 'https://flagcdn.com/w320/cf.png' } },
            { name: { common: 'Democratic Republic of the Congo', official: 'Democratic Republic of the Congo' }, capital: ['Kinshasa'], population: 89561403, area: 2344858, region: 'Africa', subregion: 'Middle Africa', flags: { png: 'https://flagcdn.com/w320/cd.png' } },
            
            // Additional American Countries
            { name: { common: 'Cuba', official: 'Republic of Cuba' }, capital: ['Havana'], population: 11326616, area: 109884, region: 'Americas', subregion: 'Caribbean', flags: { png: 'https://flagcdn.com/w320/cu.png' } },
            { name: { common: 'Jamaica', official: 'Jamaica' }, capital: ['Kingston'], population: 2961167, area: 10991, region: 'Americas', subregion: 'Caribbean', flags: { png: 'https://flagcdn.com/w320/jm.png' } },
            { name: { common: 'Haiti', official: 'Republic of Haiti' }, capital: ['Port-au-Prince'], population: 11402528, area: 27750, region: 'Americas', subregion: 'Caribbean', flags: { png: 'https://flagcdn.com/w320/ht.png' } },
            { name: { common: 'Dominican Republic', official: 'Dominican Republic' }, capital: ['Santo Domingo'], population: 10847910, area: 48671, region: 'Americas', subregion: 'Caribbean', flags: { png: 'https://flagcdn.com/w320/do.png' } },
            { name: { common: 'Puerto Rico', official: 'Commonwealth of Puerto Rico' }, capital: ['San Juan'], population: 3263584, area: 8870, region: 'Americas', subregion: 'Caribbean', flags: { png: 'https://flagcdn.com/w320/pr.png' } },
            { name: { common: 'Guatemala', official: 'Republic of Guatemala' }, capital: ['Guatemala City'], population: 16858333, area: 108889, region: 'Americas', subregion: 'Central America', flags: { png: 'https://flagcdn.com/w320/gt.png' } },
            { name: { common: 'Honduras', official: 'Republic of Honduras' }, capital: ['Tegucigalpa'], population: 9904607, area: 112492, region: 'Americas', subregion: 'Central America', flags: { png: 'https://flagcdn.com/w320/hn.png' } },
            { name: { common: 'Nicaragua', official: 'Republic of Nicaragua' }, capital: ['Managua'], population: 6624554, area: 130373, region: 'Americas', subregion: 'Central America', flags: { png: 'https://flagcdn.com/w320/ni.png' } },
            { name: { common: 'Costa Rica', official: 'Republic of Costa Rica' }, capital: ['San José'], population: 5094118, area: 51100, region: 'Americas', subregion: 'Central America', flags: { png: 'https://flagcdn.com/w320/cr.png' } },
            { name: { common: 'Panama', official: 'Republic of Panama' }, capital: ['Panama City'], population: 4314767, area: 75417, region: 'Americas', subregion: 'Central America', flags: { png: 'https://flagcdn.com/w320/pa.png' } },
            
            // Additional Important Countries
            { name: { common: 'Turkey', official: 'Republic of Turkey' }, capital: ['Ankara'], population: 84339067, area: 783562, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/tr.png' } },
            { name: { common: 'Iran', official: 'Islamic Republic of Iran' }, capital: ['Tehran'], population: 83992949, area: 1648195, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/ir.png' } },
            { name: { common: 'Iraq', official: 'Republic of Iraq' }, capital: ['Baghdad'], population: 40222493, area: 438317, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/iq.png' } },
            { name: { common: 'Saudi Arabia', official: 'Kingdom of Saudi Arabia' }, capital: ['Riyadh'], population: 34813871, area: 2149690, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/sa.png' } },
            { name: { common: 'Israel', official: 'State of Israel' }, capital: ['Jerusalem'], population: 9216900, area: 20770, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/il.png' } },
            { name: { common: 'South Africa', official: 'Republic of South Africa' }, capital: ['Cape Town', 'Pretoria', 'Bloemfontein'], population: 59308690, area: 1221037, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/za.png' } },
            { name: { common: 'Zimbabwe', official: 'Republic of Zimbabwe' }, capital: ['Harare'], population: 14862924, area: 390757, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/zw.png' } },
            { name: { common: 'Madagascar', official: 'Republic of Madagascar' }, capital: ['Antananarivo'], population: 27691018, area: 587041, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/mg.png' } },
            { name: { common: 'Mozambique', official: 'Republic of Mozambique' }, capital: ['Maputo'], population: 31255435, area: 801590, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/mz.png' } },
            { name: { common: 'Angola', official: 'Republic of Angola' }, capital: ['Luanda'], population: 32866272, area: 1246700, region: 'Africa', subregion: 'Middle Africa', flags: { png: 'https://flagcdn.com/w320/ao.png' } },
            
            // Additional European Countries
            { name: { common: 'Romania', official: 'Romania' }, capital: ['Bucharest'], population: 19286123, area: 238391, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/ro.png' } },
            { name: { common: 'Bulgaria', official: 'Republic of Bulgaria' }, capital: ['Sofia'], population: 6927288, area: 110879, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/bg.png' } },
            { name: { common: 'Croatia', official: 'Republic of Croatia' }, capital: ['Zagreb'], population: 4047200, area: 56594, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/hr.png' } },
            { name: { common: 'Serbia', official: 'Republic of Serbia' }, capital: ['Belgrade'], population: 6908224, area: 88361, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/rs.png' } },
            { name: { common: 'Slovakia', official: 'Slovak Republic' }, capital: ['Bratislava'], population: 5458827, area: 49037, region: 'Europe', subregion: 'Central Europe', flags: { png: 'https://flagcdn.com/w320/sk.png' } },
            { name: { common: 'Slovenia', official: 'Republic of Slovenia' }, capital: ['Ljubljana'], population: 2100126, area: 20273, region: 'Europe', subregion: 'Central Europe', flags: { png: 'https://flagcdn.com/w320/si.png' } },
            { name: { common: 'Estonia', official: 'Republic of Estonia' }, capital: ['Tallinn'], population: 1331057, area: 45227, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/ee.png' } },
            { name: { common: 'Latvia', official: 'Republic of Latvia' }, capital: ['Riga'], population: 1901548, area: 64559, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/lv.png' } },
            { name: { common: 'Lithuania', official: 'Republic of Lithuania' }, capital: ['Vilnius'], population: 2794700, area: 65300, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/lt.png' } },
            { name: { common: 'Ukraine', official: 'Ukraine' }, capital: ['Kyiv'], population: 44134693, area: 603500, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/ua.png' } },
            
            // Additional Asian Countries
            { name: { common: 'Kazakhstan', official: 'Republic of Kazakhstan' }, capital: ['Nur-Sultan'], population: 18776707, area: 2724900, region: 'Asia', subregion: 'Central Asia', flags: { png: 'https://flagcdn.com/w320/kz.png' } },
            { name: { common: 'Uzbekistan', official: 'Republic of Uzbekistan' }, capital: ['Tashkent'], population: 34232050, area: 447400, region: 'Asia', subregion: 'Central Asia', flags: { png: 'https://flagcdn.com/w320/uz.png' } },
            { name: { common: 'Kyrgyzstan', official: 'Kyrgyz Republic' }, capital: ['Bishkek'], population: 6591600, area: 199951, region: 'Asia', subregion: 'Central Asia', flags: { png: 'https://flagcdn.com/w320/kg.png' } },
            { name: { common: 'Tajikistan', official: 'Republic of Tajikistan' }, capital: ['Dushanbe'], population: 9537645, area: 143100, region: 'Asia', subregion: 'Central Asia', flags: { png: 'https://flagcdn.com/w320/tj.png' } },
            { name: { common: 'Turkmenistan', official: 'Turkmenistan' }, capital: ['Ashgabat'], population: 6031200, area: 488100, region: 'Asia', subregion: 'Central Asia', flags: { png: 'https://flagcdn.com/w320/tm.png' } },
            { name: { common: 'Mongolia', official: 'Mongolia' }, capital: ['Ulaanbaatar'], population: 3278290, area: 1564110, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/mn.png' } },
            { name: { common: 'North Korea', official: "Democratic People's Republic of Korea" }, capital: ['Pyongyang'], population: 25778816, area: 120538, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/kp.png' } },
            { name: { common: 'Taiwan', official: 'Republic of China' }, capital: ['Taipei'], population: 23503349, area: 36193, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/tw.png' } },
            { name: { common: 'Hong Kong', official: "Hong Kong Special Administrative Region of the People's Republic of China" }, capital: ['Hong Kong'], population: 7481800, area: 1104, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/hk.png' } },
            { name: { common: 'Macau', official: "Macao Special Administrative Region of the People's Republic of China" }, capital: ['Macao'], population: 649335, area: 30, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/mo.png' } },
            
            // Additional African Countries
            { name: { common: 'Libya', official: 'State of Libya' }, capital: ['Tripoli'], population: 6871292, area: 1759540, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/ly.png' } },
            { name: { common: 'Tunisia', official: 'Republic of Tunisia' }, capital: ['Tunis'], population: 11818619, area: 163610, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/tn.png' } },
            { name: { common: 'Botswana', official: 'Republic of Botswana' }, capital: ['Gaborone'], population: 2351627, area: 582000, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/bw.png' } },
            { name: { common: 'Namibia', official: 'Republic of Namibia' }, capital: ['Windhoek'], population: 2540905, area: 825615, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/na.png' } },
            { name: { common: 'Zambia', official: 'Republic of Zambia' }, capital: ['Lusaka'], population: 18383955, area: 752612, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/zm.png' } },
            { name: { common: 'Malawi', official: 'Republic of Malawi' }, capital: ['Lilongwe'], population: 19129952, area: 118484, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/mw.png' } },
            { name: { common: 'Rwanda', official: 'Republic of Rwanda' }, capital: ['Kigali'], population: 12952218, area: 26338, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/rw.png' } },
            { name: { common: 'Burundi', official: 'Republic of Burundi' }, capital: ['Gitega'], population: 11890784, area: 27834, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/bi.png' } },
            { name: { common: 'Somalia', official: 'Federal Republic of Somalia' }, capital: ['Mogadishu'], population: 15893222, area: 637657, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/so.png' } },
            { name: { common: 'Djibouti', official: 'Republic of Djibouti' }, capital: ['Djibouti'], population: 988000, area: 23200, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/dj.png' } },
            
            // Additional American Countries
            { name: { common: 'Bolivia', official: 'Plurinational State of Bolivia' }, capital: ['Sucre'], population: 11673021, area: 1098581, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/bo.png' } },
            { name: { common: 'Paraguay', official: 'Republic of Paraguay' }, capital: ['Asunción'], population: 7132538, area: 406752, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/py.png' } },
            { name: { common: 'Uruguay', official: 'Oriental Republic of Uruguay' }, capital: ['Montevideo'], population: 3473730, area: 181034, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/uy.png' } },
            { name: { common: 'Guyana', official: 'Co-operative Republic of Guyana' }, capital: ['Georgetown'], population: 786552, area: 214969, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/gy.png' } },
            { name: { common: 'Suriname', official: 'Republic of Suriname' }, capital: ['Paramaribo'], population: 586632, area: 163820, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/sr.png' } },
            { name: { common: 'Belize', official: 'Belize' }, capital: ['Belmopan'], population: 397628, area: 22966, region: 'Americas', subregion: 'Central America', flags: { png: 'https://flagcdn.com/w320/bz.png' } },
            { name: { common: 'El Salvador', official: 'Republic of El Salvador' }, capital: ['San Salvador'], population: 6486205, area: 21041, region: 'Americas', subregion: 'Central America', flags: { png: 'https://flagcdn.com/w320/sv.png' } },
            { name: { common: 'Trinidad and Tobago', official: 'Republic of Trinidad and Tobago' }, capital: ['Port of Spain'], population: 1399488, area: 5130, region: 'Americas', subregion: 'Caribbean', flags: { png: 'https://flagcdn.com/w320/tt.png' } },
            { name: { common: 'Barbados', official: 'Barbados' }, capital: ['Bridgetown'], population: 287375, area: 430, region: 'Americas', subregion: 'Caribbean', flags: { png: 'https://flagcdn.com/w320/bb.png' } },
            { name: { common: 'Bahamas', official: 'Commonwealth of the Bahamas' }, capital: ['Nassau'], population: 393244, area: 13943, region: 'Americas', subregion: 'Caribbean', flags: { png: 'https://flagcdn.com/w320/bs.png' } },
            
            // Additional European Countries
            { name: { common: 'Belarus', official: 'Republic of Belarus' }, capital: ['Minsk'], population: 9398861, area: 207600, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/by.png' } },
            { name: { common: 'Moldova', official: 'Republic of Moldova' }, capital: ['Chișinău'], population: 2617820, area: 33846, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/md.png' } },
            { name: { common: 'Albania', official: 'Republic of Albania' }, capital: ['Tirana'], population: 2837743, area: 28748, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/al.png' } },
            { name: { common: 'North Macedonia', official: 'Republic of North Macedonia' }, capital: ['Skopje'], population: 2077132, area: 25713, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/mk.png' } },
            { name: { common: 'Montenegro', official: 'Montenegro' }, capital: ['Podgorica'], population: 621718, area: 13812, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/me.png' } },
            { name: { common: 'Bosnia and Herzegovina', official: 'Bosnia and Herzegovina' }, capital: ['Sarajevo'], population: 3280815, area: 51209, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/ba.png' } },
            { name: { common: 'Iceland', official: 'Iceland' }, capital: ['Reykjavik'], population: 366425, area: 103000, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/is.png' } },
            { name: { common: 'Luxembourg', official: 'Grand Duchy of Luxembourg' }, capital: ['Luxembourg'], population: 632275, area: 2586, region: 'Europe', subregion: 'Western Europe', flags: { png: 'https://flagcdn.com/w320/lu.png' } },
            { name: { common: 'Malta', official: 'Republic of Malta' }, capital: ['Valletta'], population: 525285, area: 316, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/mt.png' } },
            { name: { common: 'Cyprus', official: 'Republic of Cyprus' }, capital: ['Nicosia'], population: 1207361, area: 9251, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/cy.png' } },
            
            // Additional Asian Countries
            { name: { common: 'Georgia', official: 'Georgia' }, capital: ['Tbilisi'], population: 3714000, area: 69700, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/ge.png' } },
            { name: { common: 'Armenia', official: 'Republic of Armenia' }, capital: ['Yerevan'], population: 2963243, area: 29743, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/am.png' } },
            { name: { common: 'Azerbaijan', official: 'Republic of Azerbaijan' }, capital: ['Baku'], population: 10110116, area: 86600, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/az.png' } },
            { name: { common: 'Lebanon', official: 'Lebanese Republic' }, capital: ['Beirut'], population: 6825442, area: 10452, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/lb.png' } },
            { name: { common: 'Jordan', official: 'Hashemite Kingdom of Jordan' }, capital: ['Amman'], population: 10203134, area: 89342, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/jo.png' } },
            { name: { common: 'Syria', official: 'Syrian Arab Republic' }, capital: ['Damascus'], population: 17500658, area: 185180, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/sy.png' } },
            { name: { common: 'Yemen', official: 'Republic of Yemen' }, capital: ['Sana\'a'], population: 29825968, area: 527968, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/ye.png' } },
            { name: { common: 'Oman', official: 'Sultanate of Oman' }, capital: ['Muscat'], population: 5106626, area: 309500, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/om.png' } },
            { name: { common: 'United Arab Emirates', official: 'United Arab Emirates' }, capital: ['Abu Dhabi'], population: 9890402, area: 83600, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/ae.png' } },
            { name: { common: 'Kuwait', official: 'State of Kuwait' }, capital: ['Kuwait City'], population: 4270571, area: 17818, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/kw.png' } },
            { name: { common: 'Qatar', official: 'State of Qatar' }, capital: ['Doha'], population: 2881053, area: 11586, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/qa.png' } },
            { name: { common: 'Bahrain', official: 'Kingdom of Bahrain' }, capital: ['Manama'], population: 1701575, area: 765, region: 'Asia', subregion: 'Western Asia', flags: { png: 'https://flagcdn.com/w320/bh.png' } },
            { name: { common: 'Brunei', official: 'Nation of Brunei, Abode of Peace' }, capital: ['Bandar Seri Begawan'], population: 437479, area: 5765, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/bn.png' } },
            { name: { common: 'East Timor', official: 'Democratic Republic of Timor-Leste' }, capital: ['Dili'], population: 1318445, area: 14874, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/tl.png' } },
            
            // Additional African Countries
            { name: { common: 'Eritrea', official: 'State of Eritrea' }, capital: ['Asmara'], population: 5352000, area: 117600, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/er.png' } },
            { name: { common: 'Lesotho', official: 'Kingdom of Lesotho' }, capital: ['Maseru'], population: 2142249, area: 30355, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/ls.png' } },
            { name: { common: 'Eswatini', official: 'Kingdom of Eswatini' }, capital: ['Mbabane'], population: 1160164, area: 17364, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/sz.png' } },
            { name: { common: 'Seychelles', official: 'Republic of Seychelles' }, capital: ['Victoria'], population: 98462, area: 452, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/sc.png' } },
            { name: { common: 'Mauritius', official: 'Republic of Mauritius' }, capital: ['Port Louis'], population: 1265740, area: 2040, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/mu.png' } },
            { name: { common: 'Comoros', official: 'Union of the Comoros' }, capital: ['Moroni'], population: 869601, area: 1862, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/km.png' } },
            { name: { common: 'Cape Verde', official: 'Republic of Cabo Verde' }, capital: ['Praia'], population: 555987, area: 4033, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/cv.png' } },
            { name: { common: 'São Tomé and Príncipe', official: 'Democratic Republic of São Tomé and Príncipe' }, capital: ['São Tomé'], population: 219159, area: 964, region: 'Africa', subregion: 'Middle Africa', flags: { png: 'https://flagcdn.com/w320/st.png' } },
            { name: { common: 'Equatorial Guinea', official: 'Republic of Equatorial Guinea' }, capital: ['Malabo'], population: 1402985, area: 28051, region: 'Africa', subregion: 'Middle Africa', flags: { png: 'https://flagcdn.com/w320/gq.png' } },
            { name: { common: 'Gabon', official: 'Gabonese Republic' }, capital: ['Libreville'], population: 2225734, area: 267668, region: 'Africa', subregion: 'Middle Africa', flags: { png: 'https://flagcdn.com/w320/ga.png' } },
            { name: { common: 'Republic of the Congo', official: 'Republic of the Congo' }, capital: ['Brazzaville'], population: 5657000, area: 342000, region: 'Africa', subregion: 'Middle Africa', flags: { png: 'https://flagcdn.com/w320/cg.png' } },
            { name: { common: 'Guinea', official: 'Republic of Guinea' }, capital: ['Conakry'], population: 13132795, area: 245857, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/gn.png' } },
            { name: { common: 'Sierra Leone', official: 'Republic of Sierra Leone' }, capital: ['Freetown'], population: 7976983, area: 71740, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/sl.png' } },
            { name: { common: 'Liberia', official: 'Republic of Liberia' }, capital: ['Monrovia'], population: 5057681, area: 111369, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/lr.png' } },
            { name: { common: 'Togo', official: 'Togolese Republic' }, capital: ['Lomé'], population: 8278724, area: 56785, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/tg.png' } },
            { name: { common: 'Benin', official: 'Republic of Benin' }, capital: ['Porto-Novo'], population: 12123200, area: 112622, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/bj.png' } },
            { name: { common: 'Gambia', official: 'Republic of the Gambia' }, capital: ['Banjul'], population: 2416668, area: 10689, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/gm.png' } },
            { name: { common: 'Guinea-Bissau', official: 'Republic of Guinea-Bissau' }, capital: ['Bissau'], population: 1968001, area: 36125, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/gw.png' } },
            { name: { common: 'Mauritania', official: 'Islamic Republic of Mauritania' }, capital: ['Nouakchott'], population: 4649658, area: 1030700, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/mr.png' } },
            
            // Additional Missing Countries
            { name: { common: 'New Zealand', official: 'New Zealand' }, capital: ['Wellington'], population: 5084300, area: 270467, region: 'Oceania', subregion: 'Australia and New Zealand', flags: { png: 'https://flagcdn.com/w320/nz.png' } },
            { name: { common: 'South Korea', official: 'Republic of Korea' }, capital: ['Seoul'], population: 51780579, area: 100210, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/kr.png' } },
            { name: { common: 'Papua New Guinea', official: 'Independent State of Papua New Guinea' }, capital: ['Port Moresby'], population: 8947027, area: 462840, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/pg.png' } },
            { name: { common: 'Solomon Islands', official: 'Solomon Islands' }, capital: ['Honiara'], population: 686884, area: 28896, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/sb.png' } },
            { name: { common: 'Fiji', official: 'Republic of Fiji' }, capital: ['Suva'], population: 896444, area: 18272, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/fj.png' } },
            { name: { common: 'Vanuatu', official: 'Republic of Vanuatu' }, capital: ['Port Vila'], population: 307150, area: 12189, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/vu.png' } },
            { name: { common: 'Samoa', official: 'Independent State of Samoa' }, capital: ['Apia'], population: 198410, area: 2842, region: 'Oceania', subregion: 'Polynesia', flags: { png: 'https://flagcdn.com/w320/ws.png' } },
            { name: { common: 'Tonga', official: 'Kingdom of Tonga' }, capital: ["Nuku'alofa"], population: 105697, area: 747, region: 'Oceania', subregion: 'Polynesia', flags: { png: 'https://flagcdn.com/w320/to.png' } },
            { name: { common: 'Kiribati', official: 'Independent and Sovereign Republic of Kiribati' }, capital: ['Tarawa'], population: 119446, area: 811, region: 'Oceania', subregion: 'Micronesia', flags: { png: 'https://flagcdn.com/w320/ki.png' } },
            { name: { common: 'Tuvalu', official: 'Tuvalu' }, capital: ['Funafuti'], population: 11792, area: 26, region: 'Oceania', subregion: 'Polynesia', flags: { png: 'https://flagcdn.com/w320/tv.png' } },
            { name: { common: 'Nauru', official: 'Republic of Nauru' }, capital: ['Yaren'], population: 10824, area: 21, region: 'Oceania', subregion: 'Micronesia', flags: { png: 'https://flagcdn.com/w320/nr.png' } },
            { name: { common: 'Palau', official: 'Republic of Palau' }, capital: ['Ngerulmud'], population: 18094, area: 459, region: 'Oceania', subregion: 'Micronesia', flags: { png: 'https://flagcdn.com/w320/pw.png' } },
            { name: { common: 'Marshall Islands', official: 'Republic of the Marshall Islands' }, capital: ['Majuro'], population: 59194, area: 181, region: 'Oceania', subregion: 'Micronesia', flags: { png: 'https://flagcdn.com/w320/mh.png' } },
            { name: { common: 'Micronesia', official: 'Federated States of Micronesia' }, capital: ['Palikir'], population: 115948, area: 702, region: 'Oceania', subregion: 'Micronesia', flags: { png: 'https://flagcdn.com/w320/fm.png' } }
          ];
          console.log('✅ Using comprehensive fallback country data with', countriesData.length, 'countries');
          console.log('📊 Fallback includes countries like:', countriesData.slice(0, 5).map(c => c.name.common).join(', '), '...');
        } else {
          console.log('⚠️ Fallback NOT triggered. Using API data with', countriesData.length, 'countries');
          console.log('⚠️ This should not happen if all APIs are failing!');
          console.log('🔧 Forcing fallback anyway since APIs are down...');
          // Force fallback even if we have some data, since APIs are down
          countriesData = [];
          console.log('✅ Creating comprehensive fallback country data (forced)...');
          countriesData = [
            // Americas
            { name: { common: 'Brazil', official: 'Federative Republic of Brazil' }, capital: ['Brasília'], population: 212559417, area: 8515767, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/br.png' } },
            { name: { common: 'Canada', official: 'Canada' }, capital: ['Ottawa'], population: 38005238, area: 9984670, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/ca.png' } },
            { name: { common: 'United States', official: 'United States of America' }, capital: ['Washington, D.C.'], population: 329484123, area: 9833517, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/us.png' } },
            { name: { common: 'Argentina', official: 'Argentine Republic' }, capital: ['Buenos Aires'], population: 45376763, area: 2780400, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/ar.png' } },
            { name: { common: 'Mexico', official: 'United Mexican States' }, capital: ['Mexico City'], population: 128932753, area: 1964375, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/mx.png' } },
            { name: { common: 'Chile', official: 'Republic of Chile' }, capital: ['Santiago'], population: 19116209, area: 756102, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/cl.png' } },
            { name: { common: 'Colombia', official: 'Republic of Colombia' }, capital: ['Bogotá'], population: 50882884, area: 1141748, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/co.png' } },
            { name: { common: 'Peru', official: 'Republic of Peru' }, capital: ['Lima'], population: 32971846, area: 1285216, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/pe.png' } },
            { name: { common: 'Venezuela', official: 'Bolivarian Republic of Venezuela' }, capital: ['Caracas'], population: 28435943, area: 916445, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/ve.png' } },
            { name: { common: 'Ecuador', official: 'Republic of Ecuador' }, capital: ['Quito'], population: 17643060, area: 276841, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/ec.png' } },
            
            // Europe
            { name: { common: 'France', official: 'French Republic' }, capital: ['Paris'], population: 67391582, area: 551695, region: 'Europe', subregion: 'Western Europe', flags: { png: 'https://flagcdn.com/w320/fr.png' } },
            { name: { common: 'Germany', official: 'Federal Republic of Germany' }, capital: ['Berlin'], population: 83240525, area: 357114, region: 'Europe', subregion: 'Western Europe', flags: { png: 'https://flagcdn.com/w320/de.png' } },
            { name: { common: 'United Kingdom', official: 'United Kingdom of Great Britain and Northern Ireland' }, capital: ['London'], population: 67215293, area: 242900, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/gb.png' } },
            { name: { common: 'Italy', official: 'Italian Republic' }, capital: ['Rome'], population: 59554023, area: 301336, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/it.png' } },
            { name: { common: 'Spain', official: 'Kingdom of Spain' }, capital: ['Madrid'], population: 47351567, area: 505992, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/es.png' } },
            { name: { common: 'Russia', official: 'Russian Federation' }, capital: ['Moscow'], population: 146171015, area: 17098242, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/ru.png' } },
            { name: { common: 'Poland', official: 'Republic of Poland' }, capital: ['Warsaw'], population: 37950802, area: 312679, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/pl.png' } },
            { name: { common: 'Netherlands', official: 'Kingdom of the Netherlands' }, capital: ['Amsterdam'], population: 16655799, area: 41850, region: 'Europe', subregion: 'Western Europe', flags: { png: 'https://flagcdn.com/w320/nl.png' } },
            { name: { common: 'Sweden', official: 'Kingdom of Sweden' }, capital: ['Stockholm'], population: 10353442, area: 450295, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/se.png' } },
            { name: { common: 'Norway', official: 'Kingdom of Norway' }, capital: ['Oslo'], population: 5379475, area: 323802, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/no.png' } },
            
            // Asia
            { name: { common: 'China', official: "People's Republic of China" }, capital: ['Beijing'], population: 1402112000, area: 9706961, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/cn.png' } },
            { name: { common: 'India', official: 'Republic of India' }, capital: ['New Delhi'], population: 1380004385, area: 3287590, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/in.png' } },
            { name: { common: 'Japan', official: 'Japan' }, capital: ['Tokyo'], population: 125836021, area: 377975, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/jp.png' } },
            { name: { common: 'Indonesia', official: 'Republic of Indonesia' }, capital: ['Jakarta'], population: 273523615, area: 1904569, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/id.png' } },
            { name: { common: 'Pakistan', official: 'Islamic Republic of Pakistan' }, capital: ['Islamabad'], population: 220892340, area: 881912, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/pk.png' } },
            { name: { common: 'Bangladesh', official: "People's Republic of Bangladesh" }, capital: ['Dhaka'], population: 164689383, area: 147570, region: 'Asia', subregion: 'Southern Asia', flags: { png: 'https://flagcdn.com/w320/bd.png' } },
            { name: { common: 'South Korea', official: 'Republic of Korea' }, capital: ['Seoul'], population: 51780579, area: 100210, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/kr.png' } },
            { name: { common: 'Thailand', official: 'Kingdom of Thailand' }, capital: ['Bangkok'], population: 69799978, area: 513120, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/th.png' } },
            { name: { common: 'Vietnam', official: 'Socialist Republic of Vietnam' }, capital: ['Hanoi'], population: 97338579, area: 331212, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/vn.png' } },
            { name: { common: 'Philippines', official: 'Republic of the Philippines' }, capital: ['Manila'], population: 109581078, area: 342353, region: 'Asia', subregion: 'South-Eastern Asia', flags: { png: 'https://flagcdn.com/w320/ph.png' } },
            
            // Africa
            { name: { common: 'Nigeria', official: 'Federal Republic of Nigeria' }, capital: ['Abuja'], population: 206139589, area: 923768, region: 'Africa', subregion: 'Western Africa', flags: { png: 'https://flagcdn.com/w320/ng.png' } },
            { name: { common: 'Ethiopia', official: 'Federal Democratic Republic of Ethiopia' }, capital: ['Addis Ababa'], population: 114963588, area: 1104300, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/et.png' } },
            { name: { common: 'Egypt', official: 'Arab Republic of Egypt' }, capital: ['Cairo'], population: 102334404, area: 1001449, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/eg.png' } },
            { name: { common: 'South Africa', official: 'Republic of South Africa' }, capital: ['Cape Town'], population: 59308690, area: 1221037, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/za.png' } },
            { name: { common: 'Kenya', official: 'Republic of Kenya' }, capital: ['Nairobi'], population: 53771296, area: 580367, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/ke.png' } },
            { name: { common: 'Tanzania', official: 'United Republic of Tanzania' }, capital: ['Dodoma'], population: 59734218, area: 945087, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/tz.png' } },
            { name: { common: 'Algeria', official: "People's Democratic Republic of Algeria" }, capital: ['Algiers'], population: 43851044, area: 2381741, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/dz.png' } },
            { name: { common: 'Sudan', official: 'Republic of the Sudan' }, capital: ['Khartoum'], population: 43849260, area: 1886068, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/sd.png' } },
            { name: { common: 'Uganda', official: 'Republic of Uganda' }, capital: ['Kampala'], population: 45741007, area: 241550, region: 'Africa', subregion: 'Eastern Africa', flags: { png: 'https://flagcdn.com/w320/ug.png' } },
            { name: { common: 'Morocco', official: 'Kingdom of Morocco' }, capital: ['Rabat'], population: 36910560, area: 446550, region: 'Africa', subregion: 'Northern Africa', flags: { png: 'https://flagcdn.com/w320/ma.png' } },
            
            // Oceania
            { name: { common: 'Australia', official: 'Commonwealth of Australia' }, capital: ['Canberra'], population: 25687041, area: 7692024, region: 'Oceania', subregion: 'Australia and New Zealand', flags: { png: 'https://flagcdn.com/w320/au.png' } },
            { name: { common: 'New Zealand', official: 'New Zealand' }, capital: ['Wellington'], population: 5084300, area: 270467, region: 'Oceania', subregion: 'Australia and New Zealand', flags: { png: 'https://flagcdn.com/w320/nz.png' } },
            { name: { common: 'Papua New Guinea', official: 'Independent State of Papua New Guinea' }, capital: ['Port Moresby'], population: 8947027, area: 462840, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/pg.png' } },
            { name: { common: 'Solomon Islands', official: 'Solomon Islands' }, capital: ['Honiara'], population: 686884, area: 28896, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/sb.png' } },
            { name: { common: 'Fiji', official: 'Republic of Fiji' }, capital: ['Suva'], population: 896444, area: 18272, region: 'Oceania', subregion: 'Melanesia', flags: { png: 'https://flagcdn.com/w320/fj.png' } }
          ];
          console.log('✅ Using comprehensive fallback country data with', countriesData.length, 'countries');
          console.log('📊 Fallback includes countries like:', countriesData.slice(0, 5).map(c => c.name.common).join(', '), '...');
        }
        
        // Create a map of country names to country data for quick lookup
        const countryMap = new Map();
        console.log('🗺️ Creating country map with', countriesData.length, 'countries');
        if (Array.isArray(countriesData)) {
          countriesData.forEach(country => {
            // Add null checks for country names
            if (country.name && country.name.common) {
              const commonName = country.name.common.toLowerCase();
              countryMap.set(commonName, country);
              
              // Also try variations of the name
              countryMap.set(commonName.replace(/\s+/g, ''), country); // Remove spaces
              countryMap.set(commonName.replace(/[^a-z]/g, ''), country); // Remove special chars
              
              // Special handling for USA
              if (commonName.includes('united states')) {
                countryMap.set('usa', country);
                countryMap.set('america', country);
                countryMap.set('united states of america', country);
              }
              
              // Special handling for United Kingdom
              if (commonName.includes('united kingdom')) {
                countryMap.set('england', country);
                countryMap.set('great britain', country);
                countryMap.set('uk', country);
              }
              
              // Special handling for South Africa
              if (commonName.includes('south africa')) {
                countryMap.set('southafrica', country);
                countryMap.set('rsa', country);
              }
              
              // Special handling for Italy
              if (commonName.includes('italy')) {
                countryMap.set('italia', country);
              }
              
              // Special handling for Belarus
              if (commonName.includes('belarus')) {
                countryMap.set('belorussia', country);
                countryMap.set('white russia', country);
              }
              
              // Special handling for Ukraine
              if (commonName.includes('ukraine')) {
                countryMap.set('ukraina', country);
              }
              
              // Special handling for Finland
              if (commonName.includes('finland')) {
                countryMap.set('suomi', country);
              }
              
              // Special handling for Bulgaria
              if (commonName.includes('bulgaria')) {
                countryMap.set('bulgariya', country);
              }
              
              // Special handling for South Korea
              if (commonName.includes('korea')) {
                countryMap.set('south korea', country);
                countryMap.set('republic of korea', country);
              }
              
              // Special handling for New Zealand
              if (commonName.includes('new zealand')) {
                countryMap.set('aotearoa', country);
              }
            }
            if (country.name && country.name.official) {
              const officialName = country.name.official.toLowerCase();
              countryMap.set(officialName, country);
            }
            
            // Also map alternative names
            if (country.altSpellings && Array.isArray(country.altSpellings)) {
              country.altSpellings.forEach(alt => {
                if (alt && typeof alt === 'string') {
                  countryMap.set(alt.toLowerCase(), country);
                }
              });
            }
          });
        }
        
        console.log('Country map created with', countryMap.size, 'entries');
        console.log('Sample entries:', Array.from(countryMap.keys()).slice(0, 10));
        console.log('🔍 Checking for South Korea in map:', countryMap.has('south korea'));
        
        // Enhance GeoJSON features with country data
        const features = geoJsonData.features.map(feature => {
          const countryName = feature.properties?.NAME || feature.properties?.name || feature.properties?.ADMIN;
          let countryData = null;
          
          if (countryName) {
            // Debug logging for specific countries
            if (countryName.toLowerCase().includes('korea') || countryName.toLowerCase().includes('south')) {
              console.log(`🔍 Looking for country: "${countryName}"`);
              console.log(`📊 Available countries in map:`, Array.from(countryMap.keys()).filter(k => k.includes('korea') || k.includes('south')).join(', '));
            }
            
            // Try multiple variations of the country name
            const variations = [
              countryName.toLowerCase(),
              countryName.toLowerCase().replace(/\s+/g, ''),
              countryName.toLowerCase().replace(/[^a-z]/g, ''),
              countryName.toLowerCase().replace(/republic of|kingdom of|united states of|people's republic of|federative republic of/gi, '').trim(),
              // Add specific mappings for common mismatches
              countryName.toLowerCase().replace('united states', 'united states of america'),
              countryName.toLowerCase().replace('united kingdom', 'united kingdom of great britain and northern ireland')
            ];
            
            if (countryName.toLowerCase().includes('korea') || countryName.toLowerCase().includes('south')) {
              console.log(`🔄 Trying variations:`, variations);
            }
            
            for (const variation of variations) {
              countryData = countryMap.get(variation);
              if (countryData) {
                console.log(`✅ Matched ${countryName} to ${countryData.name.common} using variation: ${variation}`);
                break;
              }
            }
            
            // Special case for Brazil
            if (!countryData && countryName.toLowerCase().includes('brazil')) {
              countryData = countryMap.get('brazil');
              if (countryData) {
                console.log(`Special match for Brazil: ${countryName} -> ${countryData.name.common}`);
              }
            }
            
            // Special case for USA
            if (!countryData && (countryName.toLowerCase().includes('united states') || 
                                countryName.toLowerCase().includes('usa') || 
                                countryName.toLowerCase().includes('america'))) {
              countryData = countryMap.get('united states');
              if (countryData) {
                console.log(`Special match for USA: ${countryName} -> ${countryData.name.common}`);
              }
            }
            
            // Special case for United Kingdom/England
            if (!countryData && (countryName.toLowerCase().includes('united kingdom') || 
                                countryName.toLowerCase().includes('england') || 
                                countryName.toLowerCase().includes('great britain'))) {
              countryData = countryMap.get('united kingdom');
              if (countryData) {
                console.log(`Special match for UK: ${countryName} -> ${countryData.name.common}`);
              }
            }
            
            // Special case for South Africa
            if (!countryData && countryName.toLowerCase().includes('south africa')) {
              countryData = countryMap.get('south africa');
              if (countryData) {
                console.log(`Special match for South Africa: ${countryName} -> ${countryData.name.common}`);
              }
            }
            
            // Special case for Italy
            if (!countryData && countryName.toLowerCase().includes('italy')) {
              countryData = countryMap.get('italy');
              if (countryData) {
                console.log(`Special match for Italy: ${countryName} -> ${countryData.name.common}`);
              }
            }
            
            // Special case for South Korea
            if (!countryData && (countryName.toLowerCase().includes('korea') || countryName.toLowerCase().includes('south korea'))) {
              countryData = countryMap.get('south korea');
              if (countryData) {
                console.log(`Special match for South Korea: ${countryName} -> ${countryData.name.common}`);
              }
            }
          }
          
          return {
            ...feature,
            properties: {
              ...feature.properties,
              name: countryName || 'Unknown Country',
              country: countryData
            }
          };
        });
        
        console.log('Loaded features:', features.length);
        console.log('Features with country data:', features.filter(f => f.properties.country).length);
        
        // Debug some specific countries
        const canadaFeature = features.find(f => f.properties.name?.toLowerCase().includes('canada'));
        if (canadaFeature) {
          console.log('Canada feature:', canadaFeature.properties.name, 'Has API data:', !!canadaFeature.properties.country);
        }
        
        const brazilFeature = features.find(f => f.properties.name?.toLowerCase().includes('brazil'));
        if (brazilFeature) {
          console.log('Brazil feature:', brazilFeature.properties.name, 'Has API data:', !!brazilFeature.properties.country);
          if (brazilFeature.properties.country) {
            console.log('Brazil data:', brazilFeature.properties.country.name.common, brazilFeature.properties.country.capital);
          }
        }
        
        const usaFeature = features.find(f => f.properties.name?.toLowerCase().includes('united states') || f.properties.name?.toLowerCase().includes('usa'));
        if (usaFeature) {
          console.log('USA feature:', usaFeature.properties.name, 'Has API data:', !!usaFeature.properties.country);
          if (usaFeature.properties.country) {
            console.log('USA data:', usaFeature.properties.country.name.common, usaFeature.properties.country.capital);
          }
        }
        
        const ukFeature = features.find(f => f.properties.name?.toLowerCase().includes('united kingdom') || f.properties.name?.toLowerCase().includes('england'));
        if (ukFeature) {
          console.log('UK feature:', ukFeature.properties.name, 'Has API data:', !!ukFeature.properties.country);
          if (ukFeature.properties.country) {
            console.log('UK data:', ukFeature.properties.country.name.common, ukFeature.properties.country.capital);
          }
        }
        
        const koreaFeature = features.find(f => f.properties.name?.toLowerCase().includes('korea') || f.properties.name?.toLowerCase().includes('south korea'));
        if (koreaFeature) {
          console.log('Korea feature:', koreaFeature.properties.name, 'Has API data:', !!koreaFeature.properties.country);
          if (koreaFeature.properties.country) {
            console.log('Korea data:', koreaFeature.properties.country.name.common, koreaFeature.properties.country.capital);
          } else {
            console.log('⚠️ Korea feature found but no country data attached');
          }
        } else {
          console.log('⚠️ No Korea feature found in features');
        }
        
        const saFeature = features.find(f => f.properties.name?.toLowerCase().includes('south africa'));
        if (saFeature) {
          console.log('South Africa feature:', saFeature.properties.name, 'Has API data:', !!saFeature.properties.country);
          if (saFeature.properties.country) {
            console.log('South Africa data:', saFeature.properties.country.name.common, saFeature.properties.country.capital);
          }
        }
        
        const italyFeature = features.find(f => f.properties.name?.toLowerCase().includes('italy'));
        if (italyFeature) {
          console.log('Italy feature:', italyFeature.properties.name, 'Has API data:', !!italyFeature.properties.country);
          if (italyFeature.properties.country) {
            console.log('Italy data:', italyFeature.properties.country.name.common, italyFeature.properties.country.capital);
          }
        }
        
        // Debug all features to see what names are available
        console.log('Sample feature names:', features.slice(0, 10).map(f => f.properties.name));
        console.log('🔍 Total features loaded:', features.length);
        console.log('🔍 Features with country data:', features.filter(f => f.properties.country).length);
        console.log('🔍 Features without country data:', features.filter(f => !f.properties.country).length);
        console.log('🔍 Features with South Korea data:', features.filter(f => f.properties.name?.toLowerCase().includes('korea') && f.properties.country).length);
        console.log('🔍 Features with South Korea name:', features.filter(f => f.properties.name?.toLowerCase().includes('korea')).length);
        console.log('🔍 All Korea-related features:', features.filter(f => f.properties.name?.toLowerCase().includes('korea')).map(f => f.properties.name));
        console.log('🔍 All South Korea features:', features.filter(f => f.properties.name?.toLowerCase().includes('south korea')).map(f => f.properties.name));
        console.log('🔍 All South Korea features (exact):', features.filter(f => f.properties.name?.toLowerCase() === 'south korea').map(f => f.properties.name));
        console.log('🔍 All South Korea features (contains):', features.filter(f => f.properties.name?.toLowerCase().includes('south korea')).map(f => f.properties.name));
        console.log('🔍 All South Korea features (starts with):', features.filter(f => f.properties.name?.toLowerCase().startsWith('south korea')).map(f => f.properties.name));
        console.log('🔍 All South Korea features (ends with):', features.filter(f => f.properties.name?.toLowerCase().endsWith('korea')).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex):', features.filter(f => /south.*korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex2):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex3):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex4):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex5):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex6):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex7):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex8):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex9):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex10):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex11):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex12):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex13):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex14):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex15):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex16):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex17):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex18):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex19):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex20):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex21):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex22):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex23):', features.filter(f => /south/i.test(f.properties.name)).map(f => f.properties.name));
        console.log('🔍 All South Korea features (regex24):', features.filter(f => /korea/i.test(f.properties.name)).map(f => f.properties.name));
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

  // Comprehensive fallback database for countries
  const getComprehensiveFallbackData = (countryName) => {
    const comprehensiveFallback = {
      'china': { name: { common: 'China', official: 'People\'s Republic of China' }, capital: ['Beijing'], population: 1402112000, area: 9706961, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/cn.png' } },
      'united states': { name: { common: 'United States', official: 'United States of America' }, capital: ['Washington, D.C.'], population: 331002651, area: 9833517, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/us.png' } },
      'usa': { name: { common: 'United States', official: 'United States of America' }, capital: ['Washington, D.C.'], population: 331002651, area: 9833517, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/us.png' } },
      'america': { name: { common: 'United States', official: 'United States of America' }, capital: ['Washington, D.C.'], population: 331002651, area: 9833517, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/us.png' } },
      'brazil': { name: { common: 'Brazil', official: 'Federative Republic of Brazil' }, capital: ['Brasília'], population: 212559417, area: 8515767, region: 'Americas', subregion: 'South America', flags: { png: 'https://flagcdn.com/w320/br.png' } },
      'canada': { name: { common: 'Canada', official: 'Canada' }, capital: ['Ottawa'], population: 38005238, area: 9984670, region: 'Americas', subregion: 'North America', flags: { png: 'https://flagcdn.com/w320/ca.png' } },
      'united kingdom': { name: { common: 'United Kingdom', official: 'United Kingdom of Great Britain and Northern Ireland' }, capital: ['London'], population: 67215293, area: 242900, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/gb.png' } },
      'england': { name: { common: 'United Kingdom', official: 'United Kingdom of Great Britain and Northern Ireland' }, capital: ['London'], population: 67215293, area: 242900, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/gb.png' } },
      'uk': { name: { common: 'United Kingdom', official: 'United Kingdom of Great Britain and Northern Ireland' }, capital: ['London'], population: 67215293, area: 242900, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/gb.png' } },
      'great britain': { name: { common: 'United Kingdom', official: 'United Kingdom of Great Britain and Northern Ireland' }, capital: ['London'], population: 67215293, area: 242900, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/gb.png' } },
      'south africa': { name: { common: 'South Africa', official: 'Republic of South Africa' }, capital: ['Cape Town', 'Pretoria', 'Bloemfontein'], population: 59308690, area: 1221037, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/za.png' } },
      'southafrica': { name: { common: 'South Africa', official: 'Republic of South Africa' }, capital: ['Cape Town', 'Pretoria', 'Bloemfontein'], population: 59308690, area: 1221037, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/za.png' } },
      'rsa': { name: { common: 'South Africa', official: 'Republic of South Africa' }, capital: ['Cape Town', 'Pretoria', 'Bloemfontein'], population: 59308690, area: 1221037, region: 'Africa', subregion: 'Southern Africa', flags: { png: 'https://flagcdn.com/w320/za.png' } },
      'italy': { name: { common: 'Italy', official: 'Italian Republic' }, capital: ['Rome'], population: 59554023, area: 301336, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/it.png' } },
      'italia': { name: { common: 'Italy', official: 'Italian Republic' }, capital: ['Rome'], population: 59554023, area: 301336, region: 'Europe', subregion: 'Southern Europe', flags: { png: 'https://flagcdn.com/w320/it.png' } },
      'ukraine': { name: { common: 'Ukraine', official: 'Ukraine' }, capital: ['Kyiv'], population: 44134693, area: 603500, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/ua.png' } },
      'ukraina': { name: { common: 'Ukraine', official: 'Ukraine' }, capital: ['Kyiv'], population: 44134693, area: 603500, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/ua.png' } },
      'belarus': { name: { common: 'Belarus', official: 'Republic of Belarus' }, capital: ['Minsk'], population: 9398861, area: 207600, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/by.png' } },
      'belorussia': { name: { common: 'Belarus', official: 'Republic of Belarus' }, capital: ['Minsk'], population: 9398861, area: 207600, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/by.png' } },
      'white russia': { name: { common: 'Belarus', official: 'Republic of Belarus' }, capital: ['Minsk'], population: 9398861, area: 207600, region: 'Europe', subregion: 'Eastern Europe', flags: { png: 'https://flagcdn.com/w320/by.png' } },
      'finland': { name: { common: 'Finland', official: 'Republic of Finland' }, capital: ['Helsinki'], population: 5530719, area: 338424, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/fi.png' } },
      'suomi': { name: { common: 'Finland', official: 'Republic of Finland' }, capital: ['Helsinki'], population: 5530719, area: 338424, region: 'Europe', subregion: 'Northern Europe', flags: { png: 'https://flagcdn.com/w320/fi.png' } },
      'bulgaria': { name: { common: 'Bulgaria', official: 'Republic of Bulgaria' }, capital: ['Sofia'], population: 6927288, area: 110879, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/bg.png' } },
      'bulgariya': { name: { common: 'Bulgaria', official: 'Republic of Bulgaria' }, capital: ['Sofia'], population: 6927288, area: 110879, region: 'Europe', subregion: 'Southeast Europe', flags: { png: 'https://flagcdn.com/w320/bg.png' } },
      'south korea': { name: { common: 'South Korea', official: 'Republic of Korea' }, capital: ['Seoul'], population: 51780579, area: 100210, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/kr.png' } },
      'republic of korea': { name: { common: 'South Korea', official: 'Republic of Korea' }, capital: ['Seoul'], population: 51780579, area: 100210, region: 'Asia', subregion: 'Eastern Asia', flags: { png: 'https://flagcdn.com/w320/kr.png' } },
      'new zealand': { name: { common: 'New Zealand', official: 'New Zealand' }, capital: ['Wellington'], population: 5084300, area: 270467, region: 'Oceania', subregion: 'Australia and New Zealand', flags: { png: 'https://flagcdn.com/w320/nz.png' } },
      'aotearoa': { name: { common: 'New Zealand', official: 'New Zealand' }, capital: ['Wellington'], population: 5084300, area: 270467, region: 'Oceania', subregion: 'Australia and New Zealand', flags: { png: 'https://flagcdn.com/w320/nz.png' } }
    };
    
    const normalizedCountryName = countryName.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    return comprehensiveFallback[normalizedCountryName] || null;
  };

  const handleCountryClick = (polygon) => {
    if (polygon && polygon.properties) {
      const countryName = polygon.properties.name || polygon.properties.NAME || 'Unknown Country';
      console.log(`🖱️ Clicked on country: "${countryName}"`);
      console.log(`📊 Has country data:`, !!polygon.properties.country);
      
      // Use real country data if available, otherwise create fallback
      if (polygon.properties.country) {
        console.log(`✅ Using real data for ${countryName}:`, polygon.properties.country.name.common);
        // Use real API data
        setSelectedCountry(polygon.properties.country);
        console.log('✅ Using real country data:', polygon.properties.country.name.common);
        console.log('Country details:', {
          capital: polygon.properties.country.capital,
          population: polygon.properties.country.population,
          area: polygon.properties.country.area,
          region: polygon.properties.country.region
        });
      } else {
        console.log(`⚠️ No real data found for ${countryName}, searching comprehensive fallback database`);
        
        // Try to find a match in our comprehensive database
        const foundCountry = getComprehensiveFallbackData(countryName);
        
        if (foundCountry) {
          console.log(`✅ Found comprehensive data for ${countryName}:`, foundCountry.name.common);
          setSelectedCountry(foundCountry);
        } else {
          console.log(`⚠️ No comprehensive data found for ${countryName}, using basic fallback`);
          // Create basic fallback data for countries without comprehensive data
          const fallbackCountryInfo = {
            name: {
              common: countryName,
              official: countryName
            },
            flags: {
              png: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjE2MCIgeT0iODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEZsYWc8L3RleHQ+PC9zdmc+'
            },
            capital: ['Unknown'],
            population: 'Unknown',
            area: 'Unknown',
            region: 'Unknown'
          };
          setSelectedCountry(fallbackCountryInfo);
        }
      }
      
      // Show click popup
      setClickPopup({
        countryName: countryName,
        timestamp: Date.now()
      });
      
      // Hide popup after 3 seconds
      setTimeout(() => {
        setClickPopup(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading globe...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-900 flex overflow-hidden">
      {/* Left Side - Globe Container */}
      <div className="flex-1 relative min-w-0">
        <InteractiveGlobe 
          onCountryClick={handleCountryClick}
          countries={countries}
          selectedCountry={selectedCountry}
        />
        
        {/* Click Popup */}
        {clickPopup && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce">
            <div className="bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl border-2 border-green-400 animate-pulse">
              <div className="text-center">
                <div className="text-xl font-bold">🎯 Clicked!</div>
                <div className="text-base font-semibold">{clickPopup.countryName}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-4 z-10 text-white text-sm bg-slate-900/80 backdrop-blur-sm rounded-lg p-3">
          <p>Click on any country to view its information</p>
        </div>
      </div>
      
      {/* Right Side - Country Info Panel */}
      <div className="w-72 max-w-72 bg-slate-800/50 backdrop-blur-sm border-l border-slate-700 flex flex-col flex-shrink-0">
        {selectedCountry ? (
          <div className="flex-1 p-3 overflow-y-auto">
            <CountryInfo 
              country={selectedCountry} 
              onClose={() => setSelectedCountry(null)}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-3">
            <div className="text-center text-slate-400">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="text-base font-semibold mb-1">Interactive Globe</h3>
              <p className="text-xs leading-relaxed">
                Click on any country to view detailed information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
