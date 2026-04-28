# SkyCast Weather Dashboard ☁️🌤️

A modern, responsive, and sleek weather dashboard built with HTML, CSS (Glassmorphism), and Vanilla JavaScript. SkyCast provides real-time weather updates, air quality indexing, an interactive MapLibre radar map, and a 5-day forecast.

![SkyCast UI Screenshot](assets/images/screenshot.png)

## Features 🚀

- **Premium UI/UX:** Built with a stunning dark mode glassmorphism theme, seamless hover transitions, and a clean, sidebar-less layout.
- **Real-Time Data:** Displays current temperature, feels-like temperature, condition, and a dynamic illustration.
- **Today's Highlights:** Provides detailed metrics including Air Quality Index (PM2.5, SO2, NO2, O3), Sunrise/Sunset times, and UV Index.
- **Hourly & 5-Day Forecasts:** Get the upcoming weather details at a glance.
- **Interactive Radar Map:** Powered by **MapLibre GL JS** and OpenFreeMap. Features a full-screen expandable modal synchronized with your search location.
- **City Search:** Look up weather and map coordinates for cities seamlessly.

## Technologies Used 💻

- **Frontend:** HTML5, CSS3 (Custom Properties, Flexbox, CSS Grid)
- **Maps:** MapLibre GL JS & OpenFreeMap
- **Icons:** Lucide Icons
- **Backend/API (Local):** Elysia (runs on `127.0.0.1:3001` to serve OpenWeatherMap proxy data)

## Getting Started 🏁

1. **Start the backend server** (ensure you have Bun installed):
   ```bash
   cd SkyCast-BackEnd
   bun dev
   ```
2. **Run the Frontend:**
   Use a local development server (like Live Server or `npx serve`) to serve the `SkyCast` project directory, then open `http://localhost:3000` (or the provided URL) in your web browser.

## Customization

- The main styles, layout grids, and animations are heavily customizable in `assets/css/style.css`.
- The mapping engine logic and UI interactivity can be extended inside `assets/js/app.js`.

---
*Created as part of a modern UI modernization and weather mapping project.*
