/* =========================================
   WEATHERLY - WEATHER DASHBOARD
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
   DATE / TIME HELPERS
========================================= */

function formatDate(dateString) {

    return new Date(dateString).toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );
}


function formatTime(timeString) {

    return new Date(timeString).toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


function formatHour(timeString) {

    return new Date(timeString).toLocaleTimeString(
        "en-US",
        {
            hour: "numeric"
        }
    );
}


function getDayName(dateString) {

    return new Date(dateString).toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );
}


/* =========================================
   UI STATES
========================================= */

function showLoading() {

    loadingState.hidden = false;

    weatherContent.hidden = true;

    weatherError.hidden = true;

    searchError.hidden = true;

    searchBtn.disabled = true;

    searchBtn.textContent = "Searching...";
}


function hideLoading() {

    loadingState.hidden = true;

    searchBtn.disabled = false;

    searchBtn.textContent = "Search";
}


function showError(message = null) {

    loadingState.hidden = true;

    weatherContent.hidden = true;

    weatherError.hidden = false;

    searchBtn.disabled = false;

    searchBtn.textContent = "Search";

    if (message) {

        const errorText =
            weatherError.querySelector("p");

        if (errorText) {
            errorText.textContent = message;
        }
    }
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

    const response =
        await fetch(
            `/api/weather?city=${encodeURIComponent(query)}`
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.error ||
            "Unable to fetch weather"
        );
    }

    return data;
}


/* =========================================
   UV HELPERS
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

    let index =
        data.hourly.time.findIndex(
            time => time === currentTime
        );

    if (index === -1) {
        index = 0;
    }

    return data.hourly.uv_index[index];
}


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
   WIND / CLOUD HELPERS
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
   CURRENT WEATHER
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


    let displayLocation =
        location.name;

    if (location.admin1) {

        displayLocation +=
            `, ${location.admin1}`;
    }

    if (location.country_code) {

        displayLocation +=
            `, ${location.country_code}`;
    }


    cityName.textContent =
        displayLocation;


    dateElement.textContent =
        formatDate(
            current.time
        );


    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    weatherCondition.textContent =
        weatherInfo.condition;


    weatherIcon.textContent =
        weatherInfo.icon;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    pressure.textContent =
        `${Math.round(
            current.surface_pressure
        )} hPa`;


    visibility.textContent =
        `${(
            current.visibility / 1000
        ).toFixed(1)} km`;


    sunrise.textContent =
        formatTime(
            data.daily.sunrise[0]
        );


    sunset.textContent =
        formatTime(
            data.daily.sunset[0]
        );


    /* =========================
       DETAILS
    ========================== */

    const humidityValue =
        current.relative_humidity_2m;

    detailHumidity.textContent =
        `${humidityValue}%`;

    humidityProgress.style.width =
        `${Math.min(
            100,
            Math.max(
                0,
                humidityValue
            )
        )}%`;


    const windSpeed =
        Math.round(
            current.wind_speed_10m
        );

    detailWind.textContent =
        `${windSpeed} km/h`;

    windDescription.textContent =
        getWindDescription(
            windSpeed
        );


    const cloudValue =
        current.cloud_cover;

    cloudCover.textContent =
        `${cloudValue}%`;

    cloudDescription.textContent =
        getCloudDescription(
            cloudValue
        );


    const uvValue =
        getCurrentUVIndex(data);

    uvIndex.textContent =
        uvValue === null
            ? "N/A"
            : Number(uvValue).toFixed(1);

    uvDescription.textContent =
        getUVDescription(
            uvValue
        );
}


/* =========================================
   HOURLY FORECAST
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


    let startIndex =
        data.hourly.time.findIndex(
            time =>
                time === data.current.time
        );


    if (startIndex === -1) {
        startIndex = 0;
    }


    const hoursToShow = 24;


    for (
        let i = startIndex;

        i <
            startIndex +
            hoursToShow &&
        i <
            data.hourly.time.length;

        i++
    ) {

        const weatherInfo =
            getWeatherInfo(
                data.hourly.weather_code[i]
            );


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "hourly-card card";


        card.innerHTML = `

            <p class="hourly-time">
                ${
                    formatHour(
                        data.hourly.time[i]
                    )
                }
            </p>

            <span
                class="hourly-icon"
                aria-hidden="true"
            >
                ${weatherInfo.icon}
            </span>

            <strong
                class="hourly-temperature"
            >
                ${
                    Math.round(
                        data.hourly
                            .temperature_2m[i]
                    )
                }°
            </strong>

            <div class="hourly-rain">

                <span aria-hidden="true">
                    💧
                </span>

                <span>
                    ${
                        data.hourly
                            .precipitation_probability[i]
                        ?? 0
                    }%
                </span>

            </div>
        `;


        hourlyContainer.appendChild(
            card
        );
    }
}


/* =========================================
   7-DAY FORECAST
========================================= */

function updateForecast(data) {

    forecastContainer.innerHTML = "";

    if (
        !data.daily ||
        !data.daily.time
    ) {
        return;
    }


    const days =
        Math.min(
            data.daily.time.length,
            7
        );


    for (
        let i = 0;
        i < days;
        i++
    ) {

        const weatherInfo =
            getWeatherInfo(
                data.daily.weather_code[i]
            );


        const max =
            Math.round(
                data.daily
                    .temperature_2m_max[i]
            );


        const min =
            Math.round(
                data.daily
                    .temperature_2m_min[i]
            );


        const rain =
            data.daily
                .precipitation_probability_max?.[i]
            ?? 0;


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "forecast-card card";


        card.innerHTML = `

            <p class="forecast-day">

                ${
                    i === 0
                        ? "Today"
                        : getDayName(
                            data.daily.time[i]
                        )
                }

            </p>


            <span
                class="forecast-icon"
                aria-hidden="true"
            >
                ${weatherInfo.icon}
            </span>


            <div
                class="forecast-temperature"
            >

                <strong>
                    ${max}°
                </strong>

                <span>
                    ${min}°
                </span>

            </div>


            <p class="forecast-condition">
                ${weatherInfo.condition}
            </p>


            <p class="forecast-rain">
                💧 ${rain}%
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

async function searchWeather(
    location
) {

    showLoading();


    try {

        const data =
            await getWeather(
                location
            );


        updateCurrentWeather(
            data.location,
            data.weather
        );


        updateHourlyForecast(
            data.weather
        );


        updateForecast(
            data.weather
        );


        hideLoading();


        weatherError.hidden =
            true;

        weatherContent.hidden =
            false;


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
    event => {

        event.preventDefault();


        const location =
            cityInput.value.trim();


        if (!location) {

            searchError.textContent =
                "Please enter a location.";

            searchError.hidden =
                false;

            cityInput.focus();

            return;
        }


        searchError.hidden =
            true;


        searchWeather(
            location
        );
    }
);


/* =========================================
   RETRY
========================================= */

retryBtn.addEventListener(
    "click",
    () => {

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