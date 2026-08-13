
const express = require("express");
const cors = require("cors");
const path = require("path");



const app = express();
const PORT = process.env.PORT || 3000;

// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// =========================================
// FRONTEND ROUTE
// =========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// =========================================
// WEATHER ROUTE
// =========================================

app.get("/api/weather", async (req, res) => {
    try {
        const city = req.query.city;

        // Check if city was provided
        if (!city) {
            return res.status(400).json({
                error: "City is required"
            });
        }

        // =========================================
        // STEP 1: FIND CITY COORDINATES
        // =========================================

        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                city
            )}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            console.error(
                "Geocoding service failed:",
                geoResponse.status,
                geoResponse.statusText
            );

            return res.status(502).json({
                error: "Unable to connect to location service",
                status: geoResponse.status
            });
        }

        const geoData = await geoResponse.json();

        // City doesn't exist
        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({
                error: "City not found"
            });
        }

        const location = geoData.results[0];

        // =========================================
        // STEP 2: GET WEATHER DATA
        // =========================================

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${location.latitude}` +
            `&longitude=${location.longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,visibility,cloud_cover` +
            `&hourly=uv_index` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
            `&timezone=auto` +
            `&forecast_days=6`;

        let weatherResponse = await fetch(weatherUrl);

        // =========================================
        // HANDLE RATE LIMIT
        // =========================================

        if (weatherResponse.status === 429) {
            console.log(
                "Open-Meteo rate limit reached. Retrying after 5 seconds..."
            );

            await new Promise(resolve => setTimeout(resolve, 5000));

            weatherResponse = await fetch(weatherUrl);
        }

        // =========================================
        // CHECK WEATHER RESPONSE
        // =========================================

        if (!weatherResponse.ok) {
            console.error(
                "Weather service failed:",
                weatherResponse.status,
                weatherResponse.statusText
            );

            return res.status(502).json({
                error: "Unable to connect to weather service",
                status: weatherResponse.status
            });
        }

        const weatherData = await weatherResponse.json();

        // =========================================
        // STEP 3: SEND RESPONSE TO FRONTEND
        // =========================================

        res.json({
            location: {
                name: location.name,
                country: location.country,
                country_code: location.country_code,
                latitude: location.latitude,
                longitude: location.longitude
            },

            weather: weatherData
        });

    } catch (error) {
        console.error("Weather API error:", error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
});

// =========================================
// START SERVER
// =========================================

module.exports = app;