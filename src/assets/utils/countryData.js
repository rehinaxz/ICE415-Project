// src/utils/countryData.js

// Fetch country data from REST Countries API
export async function fetchAllCountries() {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,capital,region,subregion,flags,population,latlng,languages"
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch countries: ${res.status}`);
  }

  const data = await res.json();

  return data.map((c) => ({
    code: c.cca3 || c.cca2,
    name: c.name?.common,
    capital: Array.isArray(c.capital) ? c.capital[0] : c.capital,
    region: c.region,
    subregion: c.subregion,
    population: c.population,
    latlng: c.latlng,
    languages: c.languages ? Object.values(c.languages).join(", ") : "—",
    flag: c.flags?.svg || c.flags?.png,
  }));
}

// Small set of demo questions for the guessing game
export const DEMONYM_QUESTIONS = [
  { prompt: "Which country do Filipinos live?", answer: "Philippines" },
  { prompt: "Where do Japanese live?", answer: "Japan" },
  { prompt: "Which country do Brazilians live?", answer: "Brazil" },
  { prompt: "Which country do Egyptians live?", answer: "Egypt" },
  { prompt: "Which country do Canadians live?", answer: "Canada" },
  { prompt: "Where do French people live?", answer: "France" },
  { prompt: "Which country do Indians live?", answer: "India" },
];
