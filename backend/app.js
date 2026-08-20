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

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// =========================================
// FRONTEND ROUTE
// =========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});


// =========================================
// WEATHER ROUTE
//
// Supports:
//
// /api/weather?city=Delhi
//
// OR
//
// /api/weather?latitude=22.57&longitude=88.36
// =========================================

app.get("/api/weather", async (req, res) => {

    try {

        const city =
            req.query.city?.trim();

        const latitude =
            Number(req.query.latitude);

        const longitude =
            Number(req.query.longitude);


        let location;


        // =========================================
        // OPTION 1: CITY SEARCH
        // =========================================

        if (city) {

            const geoUrl =
                `https://geocoding-api.open-meteo.com/v1/search` +
                `?name=${encodeURIComponent(city)}` +
                `&count=100` +
                `&language=en` +
                `&format=json`;


            const geoResponse =
                await fetch(geoUrl);


            if (!geoResponse.ok) {

                console.error(
                    "Geocoding service failed:",
                    geoResponse.status,
                    geoResponse.statusText
                );

                return res.status(502).json({

                    error:
                        "Unable to connect to location service",

                    status:
                        geoResponse.status

                });
            }


            const geoData =
                await geoResponse.json();


            if (
                !geoData.results ||
                geoData.results.length === 0
            ) {

                return res.status(404).json({

                    error:
                        "City not found"

                });
            }


            // =========================================
            // FIND BEST CITY MATCH
            // =========================================

            const normalizedQuery =
                city
                    .toLowerCase()
                    .replace(/,/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();


            location =
                geoData.results.find(
                    result =>
                        result.name &&
                        result.name.toLowerCase() ===
                            normalizedQuery
                );


            if (!location) {

                location =
                    geoData.results.find(
                        result => {

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
                                .every(
                                    part =>
                                        combined.includes(
                                            part
                                        )
                                );

                        }
                    );
            }


            if (!location) {

                location =
                    geoData.results[0];

            }

        }


        // =========================================
        // OPTION 2: DEVICE COORDINATES
        // =========================================

        else if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
        ) {

            location = {

                name:
                    "Your Location",

                country:
                    "",

                country_code:
                    "",

                admin1:
                    "",

                admin2:
                    "",

                latitude:
                    latitude,

                longitude:
                    longitude
            };

        }


        // =========================================
        // NO LOCATION PROVIDED
        // =========================================

        else {

            return res.status(400).json({

                error:
                    "City or coordinates are required"

            });
        }


        // =========================================
        // WEATHER PARAMETERS
        // =========================================

        const weatherParams =
            new URLSearchParams({

                latitude:
                    location.latitude,

                longitude:
                    location.longitude,


                // CURRENT WEATHER
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


                // HOURLY WEATHER
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


                // DAILY WEATHER
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


                timezone:
                    "auto",

                forecast_days:
                    "7"

            });


        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?${weatherParams.toString()}`;


        let weatherResponse =
            await fetch(weatherUrl);


        // =========================================
        // HANDLE RATE LIMIT
        // =========================================

        if (
            weatherResponse.status === 429
        ) {

            console.log(
                "Open-Meteo rate limit reached. Retrying after 5 seconds..."
            );


            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        5000
                    )
            );


            weatherResponse =
                await fetch(weatherUrl);

        }


        // =========================================
        // WEATHER RESPONSE ERROR
        // =========================================

        if (!weatherResponse.ok) {

            console.error(

                "Weather service failed:",

                weatherResponse.status,

                weatherResponse.statusText

            );


            return res.status(502).json({

                error:
                    "Unable to connect to weather service",

                status:
                    weatherResponse.status

            });
        }


        const weatherData =
            await weatherResponse.json();


        // =========================================
        // SEND RESPONSE
        // =========================================

        return res.json({

            location: {

                name:
                    location.name,

                country:
                    location.country,

                country_code:
                    location.country_code,

                admin1:
                    location.admin1 || "",

                admin2:
                    location.admin2 || "",

                latitude:
                    location.latitude,

                longitude:
                    location.longitude,

                timezone:
                    weatherData.timezone || ""

            },


            weather:
                weatherData

        });

    }


    catch (error) {

        console.error(
            "Weather API error:",
            error
        );


        return res.status(500).json({

            error:
                "Internal server error"

        });

    }

});


// =========================================
// EXPORT APP
// =========================================

module.exports = app;