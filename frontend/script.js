/* =========================================
   WEATHERLY - WEATHER DASHBOARD
========================================= */




const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const searchError = document.getElementById("search-error");

const loadingState = document.getElementById("loading-state");
const weatherError = document.getElementById("weather-error");
const weatherContent = document.getElementById("weather-content");

const retryBtn = document.getElementById("retry-btn");

const cityName = document.getElementById("city-name");
const dateElement = document.getElementById("date");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const weatherCondition = document.getElementById("weather-condition");
const weatherIcon = document.getElementById("weather-icon");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const forecastContainer =
    document.getElementById("forecast-container");

const detailHumidity =
    document.getElementById("detail-humidity");

const detailWind =
    document.getElementById("detail-wind");

const cloudCover =
    document.getElementById("cloud-cover");

const uvIndex =
    document.getElementById("uv-index");




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

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });
}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(timeString) {

    const date = new Date(timeString);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}


/* =========================================
   GET DAY NAME
========================================= */

function getDayName(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        weekday: "short"
    });
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

    searchBtn.textContent = "Searching...";
}


/* =========================================
   HIDE LOADING STATE
========================================= */

function hideLoading() {

    loadingState.hidden = true;

    searchBtn.disabled = false;

    searchBtn.textContent = "Search";
}


/* =========================================
   SHOW ERROR STATE
========================================= */

function showError() {

    loadingState.hidden = true;

    weatherContent.hidden = true;

    weatherError.hidden = false;

    searchBtn.disabled = false;

    searchBtn.textContent = "Search";
}


/* =========================================
   GET CITY COORDINATES
========================================= */




/* =========================================
   GET WEATHER DATA
========================================= */
async function getWeather(city) {

    const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`
    );

    const data = await response.json();

    // keep the rest of your code below unchanged


    if (!response.ok) {

        throw new Error(
            data.error || "Unable to fetch weather"
        );

    }


    return data;
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
            time => time === currentTime
        );

    if (currentHourIndex !== -1) {

        return data.hourly.uv_index[
            currentHourIndex
        ];
    }

    /*
       If exact time isn't found,
       find the closest available hour.
    */

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

    if (value === null || value === undefined) {
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
   UPDATE CURRENT WEATHER
========================================= */

function updateCurrentWeather(city, data) {

    const current =
        data.current;

    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    /* Location */

    cityName.textContent =
        `${city.name}, ${city.country_code}`;


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
       EXTRA WEATHER DETAILS
    ===================================== */

    detailHumidity.textContent =
        `${current.relative_humidity_2m}%`;


    detailWind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    cloudCover.textContent =
        `${current.cloud_cover}%`;


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


    /* Update UV description */

    const uvCard =
        uvIndex.closest(".detail-card");

    if (uvCard) {

        const description =
            uvCard.querySelector(
                ".detail-description"
            );

        if (description) {

            description.textContent =
                getUVDescription(
                    uvValue
                );
        }
    }
}


/* =========================================
   UPDATE FORECAST
========================================= */

function updateForecast(data) {

    forecastContainer.innerHTML = "";


    /*
       Start from index 1 because
       index 0 represents today.
    */

    const forecastDays =
        Math.min(
            data.daily.time.length - 1,
            5
        );


    for (
        let i = 1;
        i <= forecastDays;
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


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "forecast-card card";


        card.innerHTML = `

            <p class="forecast-day">
                ${getDayName(date)}
            </p>

            <span class="forecast-icon">
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

        `;


        forecastContainer.appendChild(
            card
        );
    }
}


/* =========================================
   SEARCH WEATHER
========================================= */

async function searchWeather(city) {

    showLoading();

    try {

        // Ask our backend for weather
        const data = await getWeather(city);


        // Update dashboard
        updateCurrentWeather(
            data.location,
            data.weather
        );


        updateForecast(
            data.weather
        );


        // Hide loading
        hideLoading();


        // Show weather
        weatherError.hidden = true;
        weatherContent.hidden = false;


    } catch (error) {

        console.error(
            "Weather error:",
            error
        );

        showError();
    }
}
        

      


/* =========================================
   FORM SUBMIT
========================================= */

weatherForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const city =
            cityInput.value.trim();


        /*
           Validate empty input
        */

        if (!city) {

            searchError.textContent =
                "Please enter a city name.";

            searchError.hidden = false;

            cityInput.focus();

            return;
        }


        /*
           Hide previous validation error
        */

        searchError.hidden = true;


        /*
           Start weather search
        */

        searchWeather(city);
    }
);


/* =========================================
   RETRY BUTTON
========================================= */

retryBtn.addEventListener(
    "click",
    function () {

        const city =
            cityInput.value.trim();


        if (city) {

            searchWeather(city);

        } else {

            cityInput.focus();
        }
    }
);



