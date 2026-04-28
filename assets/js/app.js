import { fetchData, url } from "./api.js";
import * as module from "./module.js";

// MAPPING WEATHER ICON
const lucideMapping = {
  "01d": "sun",
  "01n": "moon",
  "02d": "cloud-sun",
  "02n": "cloud-moon",
  "03d": "cloud",
  "03n": "cloud",
  "04d": "cloud",
  "04n": "cloud",
  "09d": "cloud-drizzle",
  "09n": "cloud-drizzle",
  "10d": "cloud-rain",
  "10n": "cloud-rain",
  "11d": "cloud-lightning",
  "11n": "cloud-lightning",
  "13d": "snowflake",
  "13n": "snowflake",
  "50d": "wind",
  "50n": "wind",
};

/**
 * @param {string} iconCode
 * @returns {string|null}
 */
const getIconPath = (iconCode) => {
  if (iconCodes.includes(iconCode)) {
    return `./assets/weatherIcons/${iconCode}.svg`;
  }
  return null;
};

// RENDER WEATHER ICON
const renderIcon = (iconCode, size = "40px", style = "") => {
  const path = getIconPath(iconCode);
  if (path) {
    return `<img src="${path}" alt="weather icon" style="width: ${size}; height: ${size}; ${style}">`;
  } else {
    const lucideName = lucideMapping[iconCode] || "help-circle";
    return `<i data-lucide="${lucideName}" style="width: ${size}; height: ${size}; ${style}"></i>`;
  }
};

const searchInput = document.querySelector(".search-input");
const forecastGrid = document.querySelector(".forecast-grid");
const currentLocationBtn = document.querySelector("[data-current-location]");

// UPDATE TODAY HIGHLIGHT SECTION
const updateTodayHighlight = (weatherData, airPollutionData) => {
  const aqList = document.querySelector(".air-quality-list");
  const sunCard = document.querySelector(".sun-card-content");
  const uvContent = document.querySelector(".uv-content");

  if (aqList && airPollutionData) {
    const aqi = airPollutionData.list[0].main.aqi;
    const aqiInfo = module.aqiText[aqi];
    const aqiLevel = document.querySelector(".aqi-level");

    if (aqiLevel && aqiInfo) {
      aqiLevel.textContent = aqiInfo.level;
      aqiLevel.style.backgroundColor = aqiInfo.color;
      aqiLevel.style.display = "inline-block";
    } else if (aqiLevel) {
      aqiLevel.style.display = "none";
    }

    const components = airPollutionData.list[0].components;
    const items = [
      { label: "PM2.5", value: components.pm2_5.toFixed(1) },
      { label: "SO2", value: components.so2.toFixed(1) },
      { label: "NO2", value: components.no2.toFixed(1) },
      { label: "O3", value: components.o3.toFixed(1) },
    ];

    aqList.innerHTML = items
      .map(
        (item) => `
      <div class="air-quality-item">
        <span class="label">${item.label}</span>
        <span class="value">${item.value}</span>
      </div>
    `,
      )
      .join("");
  }

  if (sunCard) {
    const sunrise = module.getTime(
      weatherData.sys.sunrise,
      weatherData.timezone,
    );
    const sunset = module.getTime(weatherData.sys.sunset, weatherData.timezone);

    sunCard.innerHTML = `
      <div class="sun-item">
        <i data-lucide="sunrise" style="width: 32px; height: 32px"></i>
        <div class="sun-info">
          <span class="label">Sunrise</span>
          <span class="time">${sunrise}</span>
        </div>
      </div>
      <div class="sun-item">
        <i data-lucide="sunset" style="width: 32px; height: 32px"></i>
        <div class="sun-info">
          <span class="label">Sunset</span>
          <span class="time">${sunset}</span>
        </div>
      </div>
    `;
  }

  if (uvContent) {
    const clouds = weatherData.clouds.all;
    const isDay =
      weatherData.dt > weatherData.sys.sunrise &&
      weatherData.dt < weatherData.sys.sunset;

    if (isDay) {
      const mockUv = Math.max(1, Math.round(11 - clouds / 10));
      const uvClass = module.getUvIndexClass(mockUv);
      uvContent.innerHTML = `
        <i data-lucide="sun" style="width: 48px; height: 48px; color: ${uvClass.color}"></i>
        <div>
          <div class="uv-value" style="color: ${uvClass.color}">${mockUv}</div>
          <div class="uv-text" style="font-weight: 600; font-size: 1.1rem;">${uvClass.level}</div>
        </div>
      `;
    } else {
      uvContent.innerHTML = `
        <i data-lucide="moon" style="width: 48px; height: 48px; color: #a5aac2"></i>
        <div>
          <div class="uv-value" style="color: #a5aac2">--</div>
          <div class="uv-text" style="color: #a5aac2">Unavailable</div>
        </div>
      `;
    }
  }

  lucide.createIcons();
};

// UPDATE TODAY AT
const updateTodayAt = (forecastData) => {
  const hourlyList = document.querySelector(".hourly-list");
  if (!hourlyList) return;

  hourlyList.innerHTML = "";

  const next24Hours = forecastData.list.slice(0, 8);

  next24Hours.forEach((hour) => {
    const time = module.getHours(hour.dt, forecastData.city.timezone);
    const iconCode = hour.weather[0].icon;
    const temp = Math.round(hour.main.temp);
    const windSpeed = Math.round(module.mps_to_kmh(hour.wind.speed));
    const windDeg = hour.wind.deg;

    const card = document.createElement("div");
    card.className = "hourly-card";
    card.innerHTML = `
      <span class="time">${time}</span>
      ${renderIcon(iconCode, "32px")}
      <span class="temp">${temp}°</span>
      <div class="wind">
        <img src="./assets/images/direction.png" alt="direction" 
             style="width: 12px; height: 12px; transform: rotate(${windDeg - 180}deg); filter: invert(1) brightness(2);">
        <span class="wind-speed">${windSpeed} km/h</span>
      </div>
    `;
    hourlyList.appendChild(card);
  });
};

// UPDATE RIGHT PANEL
const updateRightPanel = (weatherData) => {
  const metricsGrid = document.querySelector(".metrics-grid");
  if (!metricsGrid) return;

  metricsGrid.innerHTML = "";

  const metrics = [
    {
      label: "Feels Like",
      icon: "thermometer",
      value: `${Math.round(weatherData.main.feels_like)}°C`,
      subText: "Actual temp feeling",
    },
    {
      label: "Humidity",
      icon: "droplets",
      value: `${weatherData.main.humidity}%`,
      subText: `Dew point: ${Math.round(weatherData.main.temp - (100 - weatherData.main.humidity) / 5)}°C`,
    },
    {
      label: "Pressure",
      icon: "gauge",
      value: `${weatherData.main.pressure} hPa`,
      subText: "Air pressure",
    },
    {
      label: "Visibility",
      icon: "eye",
      value: `${(weatherData.visibility / 1000).toFixed(1)} km`,
      subText: weatherData.visibility >= 10000 ? "Clear sky" : "Hazy",
    },
  ];

  metrics.forEach((metric) => {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `
      <div class="label">
        <i data-lucide="${metric.icon}" style="width: 14px"></i> ${metric.label}
      </div>
      <div class="value">${metric.value}</div>
      <div class="sub-text">${metric.subText}</div>
    `;
    metricsGrid.appendChild(card);
  });

  lucide.createIcons();
};

// GET USER LOCATION
const fetchWeatherByCoords = (lat, lon) => {
  fetchData(url.currentWeather(lat, lon), (data) => {
    updateHero(data);
    updateRightPanel(data);

    fetchData(url.airPollution(lat, lon), (pollutionData) => {
      updateTodayHighlight(data, pollutionData);
    });
  });

  fetchData(url.forecast(lat, lon), (data) => {
    updateForecast(data);
    updateTodayAt(data);
  });
};
const fetchWeatherByCity = (city) => {
  fetchData(url.currentWeatherByCity(city), (data) => {
    updateHero(data);
    updateRightPanel(data);

    fetchData(url.airPollutionByCity(city), (pollutionData) => {
      updateTodayHighlight(data, pollutionData);
    });
  });

  fetchData(url.forecastByCity(city), (data) => {
    updateForecast(data);
    updateTodayAt(data);
  });
};

// Initial data for Jakarta
const initWeather = () => {
  fetchWeatherByCoords(-6.2088, 106.8456);
};

// UPDATE HERO SECTION
const updateHero = (data) => {
  const city = document.querySelector(".city");
  const temp = document.querySelector(".weather-info h1");
  const condition = document.querySelector(".condition");
  const iconContainer = document.querySelector(".weather-illustration");

  city.textContent = `${data.name}, ${data.sys.country} | ${module.getDate(data.dt, data.timezone)}`;
  temp.textContent = `${Math.round(data.main.temp)}°C`;
  condition.textContent = `${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)} | High: ${Math.round(data.main.temp_max)}° Low: ${Math.round(data.main.temp_min)}°`;

  const iconCode = data.weather[0].icon;
  iconContainer.innerHTML = renderIcon(
    iconCode,
    "160px",
    "filter: drop-shadow(0 0 20px rgba(111, 224, 255, 0.4));",
  );

  if (!getIconPath(iconCode)) {
    lucide.createIcons();
  }
  if (window.map) {
    window.map.flyTo({
      center: [data.coord.lon, data.coord.lat],
      zoom: 10,
      essential: true,
    });
  }
  if (window.fullMap) {
    window.fullMap.flyTo({
      center: [data.coord.lon, data.coord.lat],
      zoom: 10,
      essential: true,
    });
  }
};

// UPDATE FORECAST SECTION
const updateForecast = (data) => {
  const forecastGrid = document.querySelector(".forecast-grid");
  if (!forecastGrid) return;
  forecastGrid.innerHTML = "";

  const dailyForecasts = data.list.filter((forecast, index) => index % 8 === 0);

  dailyForecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const dayName = module.weekDayNames[date.getUTCDay()].slice(0, 3);
    const iconCode = forecast.weather[0].icon;
    const tempMax = Math.round(forecast.main.temp_max);
    const tempMin = Math.round(forecast.main.temp_min);
    const windSpeed = Math.round(module.mps_to_kmh(forecast.wind.speed));
    const windDeg = forecast.wind.deg;

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <span class="day">${dayName}</span>
      ${renderIcon(iconCode, "40px")}
      <span class="temp">${tempMax}° / ${tempMin}°</span>
      <div class="forecast-wind">
        <img src="./assets/images/direction.png" alt="direction" 
             style="width: 14px; height: 14px; transform: rotate(${windDeg - 180}deg); filter: invert(1) brightness(2);">
        <span style="font-size: 0.75rem; color: #a5aac2; margin-top: 2px;">${windSpeed} km/h</span>
      </div>
    `;
    forecastGrid.appendChild(card);
  });

  lucide.createIcons();
};

// SEARCH
const searchContainer = document.querySelector(".search-container");
const searchResults = document.querySelector("[data-search-results]");

let searchTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  const query = searchInput.value.trim();

  if (!query) {
    searchContainer.classList.remove("active");
    searchResults.innerHTML = "";
    return;
  }

  searchTimeout = setTimeout(() => {
    fetchData(url.geo(query), (geoData) => {
      searchResults.innerHTML = "";
      if (geoData.length > 0) {
        searchContainer.classList.add("active");
        geoData.forEach((item) => {
          const resultItem = document.createElement("div");
          resultItem.className = "search-item";
          resultItem.innerHTML = `
            <i data-lucide="map-pin" style="width: 16px"></i>
            <div>
              <span class="city-name">${item.name}</span>
              <span class="country" style="font-size: 0.75rem; color: #a5aac2; margin-left: 0.5rem;">${item.state ? item.state + ", " : ""}${item.country}</span>
            </div>
          `;
          resultItem.addEventListener("click", () => {
            fetchWeatherByCity(item.name);
            searchContainer.classList.remove("active");
            searchInput.value = item.name;
          });
          searchResults.appendChild(resultItem);
        });
        lucide.createIcons();
      } else {
        searchContainer.classList.remove("active");
      }
    });
  }, 500);
});

document.addEventListener("click", (e) => {
  if (!searchContainer.contains(e.target)) {
    searchContainer.classList.remove("active");
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      fetchData(url.geo(query), (geoData) => {
        if (geoData.length > 0) {
          const { name } = geoData[0];
          fetchWeatherByCity(name);
          searchContainer.classList.remove("active");
          searchInput.value = name;
        }
      });
    }
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (searchContainer.classList.contains("active")) {
      const active = searchResults.querySelector(".active");
      if (e.key === "ArrowDown") {
        if (active) {
          active.classList.remove("active");
          const next = active.nextElementSibling;
          if (next) next.classList.add("active");
        } else {
          searchResults.firstElementChild.classList.add("active");
        }
      } else {
        if (active) {
          active.classList.remove("active");
          const prev = active.previousElementSibling;
          if (prev) prev.classList.add("active");
        } else {
          searchResults.lastElementChild.classList.add("active");
        }
      }
    }
  }
});

currentLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    currentLocationBtn.style.opacity = "0.5";
    currentLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
        currentLocationBtn.style.opacity = "1";
        currentLocationBtn.disabled = false;
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Unable to retrieve your location. Please check your browser settings.",
        );
        currentLocationBtn.style.opacity = "1";
        currentLocationBtn.disabled = false;
      },
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

const iconCodes = [
  "01d",
  "01n",
  "02d",
  "02n",
  "03d",
  "03n",
  "04d",
  "04n",
  "09d",
  "09n",
  "10d",
  "10n",
  "11d",
  "11n",
  "13d",
  "13n",
  "50d",
  "50n",
];

// Map Expand Logic
const expandMapBtn = document.querySelector("[data-expand-map]");
const mapModal = document.getElementById("map-modal");
const closeMapModalBtn = document.getElementById("close-map-modal");

if (expandMapBtn && mapModal && closeMapModalBtn) {
  expandMapBtn.addEventListener("click", () => {
    mapModal.style.display = "flex";
    // Resize map when container becomes visible
    if (window.fullMap) {
      setTimeout(() => {
        window.fullMap.resize();
      }, 100);
    }
  });

  closeMapModalBtn.addEventListener("click", () => {
    mapModal.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initWeather();
  lucide.createIcons();
});
