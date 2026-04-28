// FETCH DATA FROM API

export const fetchData = (URL, callback) => {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => callback(data));
};

export const url = {
  currentWeather(lat, lon) {
    return `http://localhost:3000/weather?lat=${lat}&lon=${lon}`;
  },
  currentWeatherByCity(city) {
    return `http://localhost:3000/weather?city=${city}`;
  },

  forecast(lat, lon) {
    return `http://localhost:3000/forecast?lat=${lat}&lon=${lon}`;
  },
  forecastByCity(city) {
    return `http://localhost:3000/forecast?city=${city}`;
  },

  airPollution(lat, lon) {
    return `http://localhost:3000/air_pollution?lat=${lat}&lon=${lon}`;
  },
  airPollutionByCity(city) {
    return `http://localhost:3000/air_pollution?city=${city}`;
  },

  reverseGeo(lat, lon) {
    return `http://localhost:3000/reverse_geo?lat=${lat}&lon=${lon}`;
  },

  geo(query) {
    return `http://localhost:3000/geo?q=${query}`;
  },
};
