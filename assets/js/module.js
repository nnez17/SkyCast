export const weekDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * @param {number} dateUnix
 * @param {number} timezone
 * @returns {string}
 */
export const getDate = function (dateUnix, timezone) {
  const date = new Date((dateUnix + timezone) * 1000);
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];

  return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
};

/**
 * @param {number} timeUnix
 * @param {number} timezone
 * @returns {string}
 */
export const getTime = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
};

/**
 * @param {number} timeUnix
 * @param {number} timezone
 * @returns {string}
 */
export const getHours = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12} ${period}`;
};

/**
 * @param {number} mps
 * @returns {number}
 */
export const mps_to_kmh = (mps) => mps * 3.6;

export const aqiText = {
  1: {
    level: "Good",
    color: "#4ade80",
  },
  2: {
    level: "Fair",
    color: "#facc15",
  },
  3: {
    level: "Moderate",
    color: "#fb923c",
  },
  4: {
    level: "Poor",
    color: "#f87171",
  },
  5: {
    level: "Very Poor",
    color: "#ef4444",
  },
};

export const uvText = {
  low: {
    level: "Low",
    color: "#4ade80",
  },
  moderate: {
    level: "Moderate",
    color: "#facc15",
  },
  high: {
    level: "High",
    color: "#fb923c",
  },
  veryHigh: {
    level: "Very High",
    color: "#f87171",
  },
  extreme: {
    level: "Extreme",
    color: "#ef4444",
  },
};

export const getUvIndexClass = (index) => {
  if (index <= 2) return uvText.low;
  if (index <= 5) return uvText.moderate;
  if (index <= 7) return uvText.high;
  if (index <= 10) return uvText.veryHigh;
  return uvText.extreme;
};
