/* =========================================
   WEATHERLY - WEATHER DASHBOARD
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const weatherForm =
    document.getElementById("weather-form");

const cityInput =
    document.getElementById("city-input");

const searchBtn =
    document.getElementById("search-btn");

const searchError =
    document.getElementById("search-error");

const loadingState =
    document.getElementById("loading-state");

const weatherError =
    document.getElementById("weather-error");

const weatherContent =
    document.getElementById("weather-content");

const retryBtn =
    document.getElementById("retry-btn");


/* CURRENT WEATHER */

const cityName =
    document.getElementById("city-name");

const dateElement =
    document.getElementById("date");

const temperature =
    document.getElementById("temperature");

const feelsLike =
    document.getElementById("feels-like");

const weatherCondition =
    document.getElementById("weather-condition");

const weatherIcon =
    document.getElementById("weather-icon");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const pressure =
    document.getElementById("pressure");

const visibility =
    document.getElementById("visibility");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");


/* FORECAST */

const forecastContainer =
    document.getElementById("forecast-container");

const hourlyContainer =
    document.getElementById("hourly-container");


/* DETAILS */

const detailHumidity =
    document.getElementById("detail-humidity");

const humidityProgress =
    document.getElementById("humidity-progress");

const detailWind =
    document.getElementById("detail-wind");

const windDescription =
    document.getElementById("wind-description");

const cloudCover =
    document.getElementById("cloud-cover");

const cloudDescription =
    document.getElementById("cloud-description");

const uvIndex =
    document.getElementById("uv-index");

const uvDescription =
    document.getElementById("uv-description");


/* =========================================
   WEATHER CODE MAPPING
========================================= */

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            condition: "Clear Sky",
            icon: "☀️"
        },

        1: {
            condition: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            condition: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            condition: "Overcast",
            icon: "☁️"
        },

        45: {
            condition: "Foggy",
            icon: "🌫️"
        },

        48: {
            condition: "Rime Fog",
            icon: "🌫️"
        },

        51: {
            condition: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            condition: "Drizzle",
            icon: "🌦️"
        },

        55: {
            condition: "Heavy Drizzle",
            icon: "🌧️"
        },

        56: {
            condition: "Freezing Drizzle",
            icon: "🌧️"
        },

        57: {
            condition: "Heavy Freezing Drizzle",
            icon: "🌧️"
        },

        61: {
            condition: "Light Rain",
            icon: "🌦️"
        },

        63: {
            condition: "Rain",
            icon: "🌧️"
        },

        65: {
            condition: "Heavy Rain",
            icon: "🌧️"
        },

        66: {
            condition: "Freezing Rain",
            icon: "🌧️"
        },

        67: {
            condition: "Heavy Freezing Rain",
            icon: "🌧️"
        },

        71: {
            condition: "Light Snow",
            icon: "🌨️"
        },

        73: {
            condition: "Snow",
            icon: "❄️"
        },

        75: {
            condition: "Heavy Snow",
            icon: "❄️"
        },

        77: {
            condition: "Snow Grains",
            icon: "🌨️"
        },

        80: {
            condition: "Light Rain Showers",
            icon: "🌦️"
        },

        81: {
            condition: "Rain Showers",
            icon: "🌧️"
        },

        82: {
            condition: "Heavy Rain Showers",
            icon: "⛈️"
        },

        85: {
            condition: "Light Snow Showers",
            icon: "🌨️"
        },

        86: {
            condition: "Heavy Snow Showers",
            icon: "❄️"
        },

        95: {
            condition: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            condition: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            condition: "Heavy Thunderstorm with Hail",
            icon: "⛈️"
        }

    };

    return weatherCodes[code] || {
        condition: "Unknown",
        icon: "🌤️"
    };
}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );
}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(timeString) {

    const date =
        new Date(timeString);

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


/* =========================================
   FORMAT HOUR
========================================= */

function formatHour(timeString) {

    const date =
        new Date(timeString);

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric"
        }
    );
}


/* =========================================
   GET DAY NAME
========================================= */

function getDayName(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );
}


/* =========================================
   SHOW LOADING STATE
========================================= */

function showLoading() {

    loadingState.hidden = false;

    weatherContent.hidden = true;

    weatherError.hidden = true;

    searchError.hidden = true;

    searchBtn.disabled = true;

    searchBtn.textContent =
        "Searching...";
}


/* =========================================
   HIDE LOADING STATE
========================================= */

function hideLoading() {

    loadingState.hidden = true;

    searchBtn.disabled = false;

    searchBtn.textContent =
        "Search";
}


/* =========================================
   SHOW ERROR STATE
========================================= */

function showError(message = null) {

    loadingState.hidden = true;

    weatherContent.hidden = true;

    weatherError.hidden = false;

    searchBtn.disabled = false;

    searchBtn.textContent =
        "Search";

    if (message) {

        const errorText =
            weatherError.querySelector("p");

        if (errorText) {
            errorText.textContent = message;
        }
    }
}


/* =========================================
   FIND BEST LOCATION MATCH
========================================= */

function findBestLocation(
    results,
    searchQuery
) {

    const query =
        searchQuery
            .trim()
            .toLowerCase();


    /*
       Remove punctuation and normalize
       multiple spaces.
    */

    const normalizedQuery =
        query
            .replace(/,/g, " ")
            .replace(/\s+/g, " ")
            .trim();


    /* -----------------------------------------
       1. Exact location name
    ----------------------------------------- */

    let match =
        results.find(result =>
            result.name &&
            result.name
                .toLowerCase() === normalizedQuery
        );

    if (match) {
        return match;
    }


    /* -----------------------------------------
       2. Exact country
    ----------------------------------------- */

    match =
        results.find(result =>
            result.country &&
            result.country
                .toLowerCase() === normalizedQuery
        );

    if (match) {
        return match;
    }


    /* -----------------------------------------
       3. Exact state
    ----------------------------------------- */

    match =
        results.find(result =>
            result.admin1 &&
            result.admin1
                .toLowerCase() === normalizedQuery
        );

    if (match) {
        return match;
    }


    /* -----------------------------------------
       4. Exact admin2
    ----------------------------------------- */

    match =
        results.find(result =>
            result.admin2 &&
            result.admin2
                .toLowerCase() === normalizedQuery
        );

    if (match) {
        return match;
    }


    /* -----------------------------------------
       5. Search city + state + country
    ----------------------------------------- */

    const queryParts =
        normalizedQuery
            .split(" ")
            .filter(Boolean);

    if (queryParts.length >= 2) {

        match =
            results.find(result => {

                const name =
                    result.name
                        ? result.name.toLowerCase()
                        : "";

                const admin1 =
                    result.admin1
                        ? result.admin1.toLowerCase()
                        : "";

                const admin2 =
                    result.admin2
                        ? result.admin2.toLowerCase()
                        : "";

                const country =
                    result.country
                        ? result.country.toLowerCase()
                        : "";

                const combined =
                    `${name} ${admin1} ${admin2} ${country}`;

                return queryParts.every(
                    part =>
                        combined.includes(part)
                );

            });

        if (match) {
            return match;
        }
    }


    /* -----------------------------------------
       6. Search administrative fields
    ----------------------------------------- */

    match =
        results.find(result => {

            const values = [
                result.name,
                result.admin1,
                result.admin2,
                result.admin3,
                result.admin4,
                result.country
            ]
                .filter(Boolean)
                .map(value =>
                    value.toLowerCase()
                );

            return values.some(value =>
                value === normalizedQuery
            );

        });

    if (match) {
        return match;
    }


    /* -----------------------------------------
       7. Fallback
    ----------------------------------------- */

    return results[0];
}


/* =========================================
   GET WEATHER DATA
========================================= */

async function getWeather(searchQuery) {

    const query =
        searchQuery.trim();

    if (!query) {

        throw new Error(
            "Please enter a location"
        );
    }


    /* =========================================
       STEP 1: FIND LOCATION
    ========================================= */

    const geoUrl =
        `https://geocoding-api.open-meteo.com/v1/search` +
        `?name=${encodeURIComponent(query)}` +
        `&count=100` +
        `&language=en` +
        `&format=json`;

    const geoResponse =
        await fetch(geoUrl);


    if (!geoResponse.ok) {

        throw new Error(
            "Unable to connect to location service"
        );
    }


    const geoData =
        await geoResponse.json();


    if (
        !geoData.results ||
        geoData.results.length === 0
    ) {

        throw new Error(
            "Location not found"
        );
    }


    /* =========================================
       STEP 2: FIND BEST MATCH
    ========================================= */

    const location =
        findBestLocation(
            geoData.results,
            query
        );


    if (!location) {

        throw new Error(
            "Location not found"
        );
    }


    /* =========================================
       STEP 3: GET WEATHER
    ========================================= */

    const weatherParams =
        new URLSearchParams({

            latitude:
                location.latitude,

            longitude:
                location.longitude,

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


    const weatherResponse =
        await fetch(weatherUrl);


    if (!weatherResponse.ok) {

        throw new Error(
            `Weather service error: ${weatherResponse.status}`
        );
    }


    const weatherData =
        await weatherResponse.json();


    /* =========================================
       STEP 4: RETURN DATA
    ========================================= */

    return {

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
                location.longitude
        },

        weather:
            weatherData

    };
}


/* =========================================
   GET CURRENT UV INDEX
========================================= */

function getCurrentUVIndex(data) {

    if (
        !data.hourly ||
        !data.hourly.uv_index ||
        !data.hourly.time
    ) {
        return null;
    }


    const currentTime =
        data.current.time;


    const currentHourIndex =
        data.hourly.time.findIndex(
            time =>
                time === currentTime
        );


    if (currentHourIndex !== -1) {

        return data.hourly.uv_index[
            currentHourIndex
        ];
    }


    /* Find closest available hour */

    const currentTimestamp =
        new Date(currentTime).getTime();


    let closestIndex = 0;

    let smallestDifference =
        Infinity;


    data.hourly.time.forEach(
        (time, index) => {

            const difference =
                Math.abs(
                    new Date(time).getTime() -
                    currentTimestamp
                );


            if (
                difference <
                smallestDifference
            ) {

                smallestDifference =
                    difference;

                closestIndex =
                    index;
            }

        }
    );


    return data.hourly.uv_index[
        closestIndex
    ];
}


/* =========================================
   GET UV DESCRIPTION
========================================= */

function getUVDescription(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "Unavailable";
    }


    if (value <= 2) {
        return "Low";
    }


    if (value <= 5) {
        return "Moderate";
    }


    if (value <= 7) {
        return "High";
    }


    if (value <= 10) {
        return "Very High";
    }


    return "Extreme";
}


/* =========================================
   GET WIND DESCRIPTION
========================================= */

function getWindDescription(speed) {

    if (speed < 5) {
        return "Calm";
    }

    if (speed < 20) {
        return "Light breeze";
    }

    if (speed < 35) {
        return "Moderate breeze";
    }

    if (speed < 50) {
        return "Strong wind";
    }

    return "Very strong wind";
}


/* =========================================
   GET CLOUD DESCRIPTION
========================================= */

function getCloudDescription(value) {

    if (value < 10) {
        return "Clear skies";
    }

    if (value < 35) {
        return "Mostly clear";
    }

    if (value < 70) {
        return "Partly cloudy";
    }

    return "Mostly cloudy";
}


/* =========================================
   UPDATE CURRENT WEATHER
========================================= */

function updateCurrentWeather(
    location,
    data
) {

    const current =
        data.current;


    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    /* Location */

    let displayLocation =
        location.name;


    if (location.admin1) {

        displayLocation +=
            `, ${location.admin1}`;
    }


    if (
        location.country_code &&
        location.country_code !== ""
    ) {

        displayLocation +=
            `, ${location.country_code}`;
    }


    cityName.textContent =
        displayLocation;


    /* Date */

    dateElement.textContent =
        formatDate(
            current.time
        );


    /* Temperature */

    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    /* Feels Like */

    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    /* Weather Condition */

    weatherCondition.textContent =
        weatherInfo.condition;


    /* Weather Icon */

    weatherIcon.textContent =
        weatherInfo.icon;


    /* Humidity */

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    /* Wind */

    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    /* Pressure */

    pressure.textContent =
        `${Math.round(
            current.surface_pressure
        )} hPa`;


    /* Visibility */

    visibility.textContent =
        `${(
            current.visibility / 1000
        ).toFixed(1)} km`;


    /* Sunrise */

    sunrise.textContent =
        formatTime(
            data.daily.sunrise[0]
        );


    /* Sunset */

    sunset.textContent =
        formatTime(
            data.daily.sunset[0]
        );


    /* =====================================
       WEATHER DETAILS
    ===================================== */

    const humidityValue =
        current.relative_humidity_2m;

    detailHumidity.textContent =
        `${humidityValue}%`;

    if (humidityProgress) {

        humidityProgress.style.width =
            `${Math.min(
                100,
                Math.max(0, humidityValue)
            )}%`;
    }


    const windSpeed =
        Math.round(
            current.wind_speed_10m
        );

    detailWind.textContent =
        `${windSpeed} km/h`;

    if (windDescription) {

        windDescription.textContent =
            getWindDescription(
                windSpeed
            );
    }


    const cloudValue =
        current.cloud_cover;

    cloudCover.textContent =
        `${cloudValue}%`;

    if (cloudDescription) {

        cloudDescription.textContent =
            getCloudDescription(
                cloudValue
            );
    }


    /* UV Index */

    const uvValue =
        getCurrentUVIndex(data);


    if (uvValue !== null) {

        uvIndex.textContent =
            Number(uvValue).toFixed(1);

    } else {

        uvIndex.textContent =
            "N/A";
    }


    if (uvDescription) {

        uvDescription.textContent =
            getUVDescription(
                uvValue
            );
    }
}


/* =========================================
   UPDATE HOURLY FORECAST
========================================= */

function updateHourlyForecast(data) {

    hourlyContainer.innerHTML = "";


    if (
        !data.hourly ||
        !data.hourly.time ||
        !data.hourly.temperature_2m
    ) {

        return;
    }


    const currentTime =
        data.current.time;


    let startIndex =
        data.hourly.time.findIndex(
            time =>
                time === currentTime
        );


    if (startIndex === -1) {
        startIndex = 0;
    }


    const hoursToShow = 24;


    for (
        let i = startIndex;
        i < startIndex + hoursToShow &&
        i < data.hourly.time.length;
        i++
    ) {

        const time =
            data.hourly.time[i];


        const temperatureValue =
            Math.round(
                data.hourly.temperature_2m[i]
            );


        const weatherCode =
            data.hourly.weather_code[i];


        const weatherInfo =
            getWeatherInfo(
                weatherCode
            );


        const rainProbability =
            data.hourly
                .precipitation_probability[i];


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "hourly-card card";


        card.innerHTML = `

            <p class="hourly-time">
                ${formatHour(time)}
            </p>

            <span
                class="hourly-icon"
                aria-hidden="true"
            >
                ${weatherInfo.icon}
            </span>

            <strong class="hourly-temperature">
                ${temperatureValue}°
            </strong>

            <div class="hourly-rain">

                <span aria-hidden="true">
                    💧
                </span>

                <span>
                    ${rainProbability ?? 0}%
                </span>

            </div>

        `;


        hourlyContainer.appendChild(
            card
        );
    }
}


/* =========================================
   UPDATE 7-DAY FORECAST
========================================= */

function updateForecast(data) {

    forecastContainer.innerHTML = "";


    if (
        !data.daily ||
        !data.daily.time
    ) {
        return;
    }


    /*
       Index 0 is today.
       We display the next 6 days,
       giving us a 7-day view including today.
    */

    const forecastDays =
        Math.min(
            data.daily.time.length,
            7
        );


    for (
        let i = 0;
        i < forecastDays;
        i++
    ) {

        const date =
            data.daily.time[i];


        const weatherCode =
            data.daily.weather_code[i];


        const weatherInfo =
            getWeatherInfo(
                weatherCode
            );


        const maxTemperature =
            Math.round(
                data.daily
                    .temperature_2m_max[i]
            );


        const minTemperature =
            Math.round(
                data.daily
                    .temperature_2m_min[i]
            );


        const rainProbability =
            data.daily
                .precipitation_probability_max?.[i] ?? 0;


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "forecast-card card";


        const dayLabel =
            i === 0
                ? "Today"
                : getDayName(date);


        card.innerHTML = `

            <p class="forecast-day">
                ${dayLabel}
            </p>

            <span
                class="forecast-icon"
                aria-hidden="true"
            >
                ${weatherInfo.icon}
            </span>

            <div class="forecast-temperature">

                <strong>
                    ${maxTemperature}°
                </strong>

                <span>
                    ${minTemperature}°
                </span>

            </div>

            <p class="forecast-condition">
                ${weatherInfo.condition}
            </p>

            <p class="forecast-rain">
                💧 ${rainProbability}%
            </p>

        `;


        forecastContainer.appendChild(
            card
        );
    }
}


/* =========================================
   SEARCH WEATHER
========================================= */

async function searchWeather(location) {

    showLoading();


    try {

        const data =
            await getWeather(
                location
            );


        /* Update current weather */

        updateCurrentWeather(
            data.location,
            data.weather
        );


        /* Update hourly forecast */

        updateHourlyForecast(
            data.weather
        );


        /* Update 7-day forecast */

        updateForecast(
            data.weather
        );


        /* Hide loading */

        hideLoading();


        /* Show weather */

        weatherError.hidden = true;

        weatherContent.hidden = false;


    } catch (error) {

        console.error(
            "Weather error:",
            error
        );


        hideLoading();


        showError(
            error.message ||
            "Unable to fetch weather information."
        );
    }
}


/* =========================================
   FORM SUBMIT
========================================= */

weatherForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const location =
            cityInput.value.trim();


        /* Validate empty input */

        if (!location) {

            searchError.textContent =
                "Please enter a location.";

            searchError.hidden =
                false;

            cityInput.focus();

            return;
        }


        /* Hide previous validation error */

        searchError.hidden =
            true;


        /* Start weather search */

        searchWeather(
            location
        );

    }
);


/* =========================================
   RETRY BUTTON
========================================= */

retryBtn.addEventListener(
    "click",
    function () {

        const location =
            cityInput.value.trim();


        if (location) {

            searchWeather(
                location
            );

        } else {

            cityInput.focus();

        }

    }
);