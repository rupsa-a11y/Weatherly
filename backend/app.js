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
        const city = req.query.city?.trim();

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
            )}&count=100&language=en&format=json`;

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

        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({
                error: "City not found"
            });
        }

        const normalizedQuery = city
            .toLowerCase()
            .replace(/,/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const location =
            geoData.results.find(
                result =>
                    result.name &&
                    result.name.toLowerCase() === normalizedQuery
            ) ||
            geoData.results.find(result => {
                const combined = [
                    result.name,
                    result.admin1,
                    result.admin2,
                    result.country
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return normalizedQuery
                    .split(" ")
                    .every(part => combined.includes(part));
            }) ||
            geoData.results[0];

        // =========================================
        // STEP 2: GET WEATHER DATA
        // =========================================

        const weatherParams = new URLSearchParams({
            latitude: location.latitude,
            longitude: location.longitude,

            current: [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "weather_code",
                "surface_pressure",
                "wind_speed_10m",
                "wind_direction_10m",
                "visibility",
                "cloud_cover",
                "precipitation",
                "rain",
                "showers"
            ].join(","),

            hourly: [
                "temperature_2m",
                "apparent_temperature",
                "relative_humidity_2m",
                "precipitation_probability",
                "precipitation",
                "rain",
                "weather_code",
                "wind_speed_10m",
                "wind_direction_10m",
                "uv_index",
                "visibility",
                "cloud_cover"
            ].join(","),

            daily: [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "apparent_temperature_max",
                "apparent_temperature_min",
                "sunrise",
                "sunset",
                "uv_index_max",
                "precipitation_sum",
                "rain_sum",
                "precipitation_probability_max",
                "wind_speed_10m_max",
                "wind_direction_10m_dominant"
            ].join(","),

            timezone: "auto",
            forecast_days: "7"
        });

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?${weatherParams.toString()}`;

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
        // STEP 3: SEND RESPONSE
        // =========================================

        return res.json({
            location: {
                name: location.name,
                country: location.country,
                country_code: location.country_code,
                admin1: location.admin1 || "",
                admin2: location.admin2 || "",
                latitude: location.latitude,
                longitude: location.longitude,
                timezone: weatherData.timezone || ""
            },

            weather: weatherData
        });

    } catch (error) {
        console.error("Weather API error:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});

// =========================================
// EXPORT APP
// =========================================

module.exports = app;