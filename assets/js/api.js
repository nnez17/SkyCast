// FETCH DATA FROM API

const backendUrl = "https://sky-cast-back-end.vercel.app";

export const fetchData = (URL, callback) => {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => callback(data));
};

export const url = {
  currentWeather(lat, lon) {
    return `${backendUrl}/weather?lat=${lat}&lon=${lon}`;
  },
  currentWeatherByCity(city) {
    return `${backendUrl}/weather?city=${city}`;
  },

  forecast(lat, lon) {
    return `${backendUrl}/forecast?lat=${lat}&lon=${lon}`;
  },
  forecastByCity(city) {
    return `${backendUrl}/forecast?city=${city}`;
  },

  airPollution(lat, lon) {
    return `${backendUrl}/air_pollution?lat=${lat}&lon=${lon}`;
  },
  airPollutionByCity(city) {
    return `${backendUrl}/air_pollution?city=${city}`;
  },

  reverseGeo(lat, lon) {
    return `${backendUrl}/reverse_geo?lat=${lat}&lon=${lon}`;
  },

  geo(query) {
    return `${backendUrl}/geo?q=${query}`;
  },
};
