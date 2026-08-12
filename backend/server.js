const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


/* =========================================
   TEST ROUTE
========================================= */

app.get("/", (req, res) => {

    res.json({
        message: "Weatherly backend is running!"
    });

});


/* =========================================
   WEATHER ROUTE
========================================= */

app.get("/api/weather", async (req, res) => {

    try {

        const city = req.query.city;


        // Check if city was provided
        if (!city) {

            return res.status(400).json({
                error: "City is required"
            });

        }


        // Step 1: Find city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );


        if (!geoResponse.ok) {

            return res.status(502).json({
                error: "Unable to connect to location service"
            });

        }


        const geoData =
            await geoResponse.json();


        // City doesn't exist
        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            return res.status(404).json({
                error: "City not found"
            });

        }


        const location =
            geoData.results[0];


        // Step 2: Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,visibility,cloud_cover&hourly=uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=6`
        );


        if (!weatherResponse.ok) {

            return res.status(502).json({
                error: "Unable to connect to weather service"
            });

        }


        const weatherData =
            await weatherResponse.json();


        // Step 3: Send response to frontend
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

        console.error(
            "Weather API error:",
            error
        );


        res.status(500).json({
            error: "Internal server error"
        });

    }

});


/* =========================================
   START SERVER
========================================= */

app.listen(PORT, () => {

    console.log(
        `Weatherly backend running on http://localhost:${PORT}`
    );

});