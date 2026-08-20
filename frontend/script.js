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

const locationBtn =
    document.getElementById("location-btn");

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


/* =========================================
   THEME
========================================= */

const themeSelect =
    document.getElementById("theme-select");

const THEME_STORAGE_KEY =
    "weatherly_theme";


/* =========================================
   CURRENT WEATHER
========================================= */

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


/* =========================================
   FORECAST
========================================= */

const forecastContainer =
    document.getElementById("forecast-container");

const hourlyContainer =
    document.getElementById("hourly-container");


/* =========================================
   DETAILS
========================================= */

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
   SAVED LOCATIONS
========================================= */

const recentSearchesSection =
    document.getElementById(
        "recent-searches"
    );

const recentList =
    document.getElementById(
        "recent-list"
    );

const clearRecentBtn =
    document.getElementById(
        "clear-recent-btn"
    );

const favoritesSection =
    document.getElementById(
        "favorites-section"
    );

const favoritesList =
    document.getElementById(
        "favorites-list"
    );

const favoriteBtn =
    document.getElementById(
        "favorite-btn"
    );

let currentFavoriteCity = "";


/* =========================================
   STORAGE KEYS
========================================= */

const RECENT_STORAGE_KEY =
    "weatherly_recent_searches";

const FAVORITES_STORAGE_KEY =
    "weatherly_favorite_cities";


/* =========================================
   THEME MANAGEMENT
========================================= */

function applyTheme(theme) {

    document.body.classList.remove(
        "light-theme",
        "dark-theme"
    );


    if (theme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    }

    else if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );
    }


    /*
       System:
       no theme class.
       CSS follows prefers-color-scheme.
    */

    if (themeSelect) {

        themeSelect.value =
            theme;
    }
}


function getSavedTheme() {

    return (
        localStorage.getItem(
            THEME_STORAGE_KEY
        ) ||
        "system"
    );
}


function saveTheme(theme) {

    localStorage.setItem(
        THEME_STORAGE_KEY,
        theme
    );


    applyTheme(theme);
}


if (themeSelect) {

    themeSelect.addEventListener(
        "change",
        event => {

            saveTheme(
                event.target.value
            );

        }
    );

}


applyTheme(
    getSavedTheme()
);


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
   DATE / TIME
========================================= */

function formatDate(dateString) {

    return new Date(
        dateString
    ).toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );
}


function formatTime(timeString) {

    return new Date(
        timeString
    ).toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


function formatHour(timeString) {

    return new Date(
        timeString
    ).toLocaleTimeString(
        "en-US",
        {
            hour: "numeric"
        }
    );
}


function getDayName(dateString) {

    return new Date(
        dateString
    ).toLocaleDateString(
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

    loadingState.hidden =
        false;

    weatherContent.hidden =
        true;

    weatherError.hidden =
        true;

    searchError.hidden =
        true;

    searchBtn.disabled =
        true;

    locationBtn.disabled =
        true;

    searchBtn.textContent =
        "Searching...";

    locationBtn.textContent =
        "📍 Locating...";
}


function hideLoading() {

    loadingState.hidden =
        true;

    searchBtn.disabled =
        false;

    locationBtn.disabled =
        false;

    searchBtn.textContent =
        "Search";

    locationBtn.textContent =
        "📍 Use My Location";
}


function showError(message = null) {

    loadingState.hidden =
        true;

    weatherContent.hidden =
        true;

    weatherError.hidden =
        false;

    searchBtn.disabled =
        false;

    locationBtn.disabled =
        false;

    searchBtn.textContent =
        "Search";

    locationBtn.textContent =
        "📍 Use My Location";


    if (message) {

        const errorText =
            weatherError.querySelector(
                "p"
            );


        if (errorText) {

            errorText.textContent =
                message;
        }
    }
}


/* =========================================
   WEATHER API
========================================= */

async function getWeather(
    searchQuery
) {

    const query =
        searchQuery.trim();


    if (!query) {

        throw new Error(
            "Please enter a location"
        );
    }


    const response =
        await fetch(
            `/api/weather?city=${encodeURIComponent(
                query
            )}`
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


async function getWeatherByCoordinates(
    latitude,
    longitude
) {

    const response =
        await fetch(
            `/api/weather?latitude=${encodeURIComponent(
                latitude
            )}&longitude=${encodeURIComponent(
                longitude
            )}`
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.error ||
            "Unable to fetch weather for your location"
        );
    }


    return data;
}


/* =========================================
   REVERSE GEOCODING
========================================= */

async function getLocationName(
    latitude,
    longitude
) {

    const response =
        await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(
                latitude
            )}&longitude=${encodeURIComponent(
                longitude
            )}&localityLanguage=en`
        );


    if (!response.ok) {

        throw new Error(
            "Unable to determine your location name."
        );
    }


    const data =
        await response.json();


    const city =
        data.city ||
        data.locality ||
        "";


    const state =
        data.principalSubdivision ||
        "";


    const country =
        data.countryCode ||
        "";


    return [
        city,
        state,
        country
    ]
        .filter(Boolean)
        .join(", ")
        || "Current Location";
}


/* =========================================
   UV
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
            time =>
                time === currentTime
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
   WIND / CLOUD
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
   RECENT SEARCHES
========================================= */

function getRecentSearches() {

    try {

        return JSON.parse(
            localStorage.getItem(
                RECENT_STORAGE_KEY
            )
        ) || [];

    } catch {

        return [];
    }
}


function saveRecentSearch(city) {

    const trimmedCity =
        city.trim();


    if (!trimmedCity) {

        return;
    }


    let recent =
        getRecentSearches();


    recent =
        recent.filter(
            item =>
                item.toLowerCase() !==
                trimmedCity.toLowerCase()
        );


    recent.unshift(
        trimmedCity
    );


    recent =
        recent.slice(0, 5);


    localStorage.setItem(
        RECENT_STORAGE_KEY,
        JSON.stringify(
            recent
        )
    );


    renderRecentSearches();
}


function renderRecentSearches() {

    const recent =
        getRecentSearches();


    recentList.innerHTML =
        "";


    if (recent.length === 0) {

        recentSearchesSection.hidden =
            true;

        return;
    }


    recentSearchesSection.hidden =
        false;


    recent.forEach(city => {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.className =
            "saved-city-btn";


        button.innerHTML = `
            <span aria-hidden="true">🕘</span>
            <span>${city}</span>
        `;


        button.addEventListener(
            "click",
            () => {

                cityInput.value =
                    city;

                searchWeather(
                    city
                );
            }
        );


        recentList.appendChild(
            button
        );

    });
}


function clearRecentSearches() {

    localStorage.removeItem(
        RECENT_STORAGE_KEY
    );


    renderRecentSearches();
}


/* =========================================
   FAVORITES
========================================= */

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                FAVORITES_STORAGE_KEY
            )
        ) || [];

    } catch {

        return [];
    }
}


function isFavorite(city) {

    if (!city) {

        return false;
    }


    return getFavorites().some(
        item =>
            item.toLowerCase() ===
            city.toLowerCase()
    );
}


function addFavorite(city) {

    const trimmedCity =
        city.trim();


    if (!trimmedCity) {

        return;
    }


    let favorites =
        getFavorites();


    const exists =
        favorites.some(
            item =>
                item.toLowerCase() ===
                trimmedCity.toLowerCase()
        );


    if (!exists) {

        favorites.push(
            trimmedCity
        );


        localStorage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify(
                favorites
            )
        );
    }


    renderFavorites();
}


function removeFavorite(city) {

    let favorites =
        getFavorites();


    favorites =
        favorites.filter(
            item =>
                item.toLowerCase() !==
                city.toLowerCase()
        );


    localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(
            favorites
        )
    );


    renderFavorites();
}


function renderFavorites() {

    const favorites =
        getFavorites();


    favoritesList.innerHTML =
        "";


    if (favorites.length === 0) {

        favoritesSection.hidden =
            true;

        return;
    }


    favoritesSection.hidden =
        false;


    favorites.forEach(city => {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "favorite-city";


        const cityButton =
            document.createElement(
                "button"
            );


        cityButton.type =
            "button";

        cityButton.className =
            "saved-city-btn";


        cityButton.innerHTML = `
            <span aria-hidden="true">⭐</span>
            <span>${city}</span>
        `;


        cityButton.addEventListener(
            "click",
            () => {

                cityInput.value =
                    city;

                searchWeather(
                    city
                );
            }
        );


        const removeButton =
            document.createElement(
                "button"
            );


        removeButton.type =
            "button";

        removeButton.className =
            "remove-favorite-btn";

        removeButton.textContent =
            "×";


        removeButton.setAttribute(
            "aria-label",
            `Remove ${city} from favorites`
        );


        removeButton.addEventListener(
            "click",
            () => {

                removeFavorite(
                    city
                );
            }
        );


        wrapper.appendChild(
            cityButton
        );

        wrapper.appendChild(
            removeButton
        );


        favoritesList.appendChild(
            wrapper
        );

    });
}


function updateFavoriteButton() {

    if (!favoriteBtn) {

        return;
    }


    if (
        !currentFavoriteCity ||
        currentFavoriteCity ===
            "Your Location" ||
        currentFavoriteCity ===
            "Current Location"
    ) {

        favoriteBtn.hidden =
            true;

        return;
    }


    favoriteBtn.hidden =
        false;


    if (
        isFavorite(
            currentFavoriteCity
        )
    ) {

        favoriteBtn.textContent =
            "★";


        favoriteBtn.setAttribute(
            "aria-label",
            "Remove current city from favorites"
        );

    }

    else {

        favoriteBtn.textContent =
            "☆";


        favoriteBtn.setAttribute(
            "aria-label",
            "Add current city to favorites"
        );
    }
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
        location.name ||
        "Your Location";


    /*
       Keep the heading clean:
       Delhi, IN
       rather than a long administrative name.
    */

    if (
        location.country_code &&
        location.name !==
            "Your Location" &&
        location.name !==
            "Current Location"
    ) {

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


    /* DETAILS */

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
        getCurrentUVIndex(
            data
        );


    uvIndex.textContent =
        uvValue === null
            ? "N/A"
            : Number(
                uvValue
            ).toFixed(1);


    uvDescription.textContent =
        getUVDescription(
            uvValue
        );


    /* FAVORITE */

    currentFavoriteCity =
        location.name || "";


    updateFavoriteButton();
}


/* =========================================
   HOURLY FORECAST
========================================= */

function updateHourlyForecast(data) {

    hourlyContainer.innerHTML =
        "";


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
                time ===
                data.current.time
        );


    if (startIndex === -1) {

        startIndex = 0;
    }


    const hoursToShow =
        24;


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
                ${formatHour(
                    data.hourly.time[i]
                )}
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
                ${Math.round(
                    data.hourly.temperature_2m[i]
                )}°
            </strong>


            <div class="hourly-rain">

                <span
                    aria-hidden="true"
                >
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

    forecastContainer.innerHTML =
        "";


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


        saveRecentSearch(
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


        cityInput.value =
            location;


        hideLoading();


        weatherError.hidden =
            true;

        weatherContent.hidden =
            false;

    }


    catch (error) {

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
   USE MY LOCATION
========================================= */

async function useMyLocation() {

    if (
        !navigator.geolocation
    ) {

        showError(
            "Location services are not supported by your browser."
        );

        return;
    }


    showLoading();


    navigator.geolocation.getCurrentPosition(

        async position => {

            try {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                const data =
                    await getWeatherByCoordinates(
                        latitude,
                        longitude
                    );


                let locationName;


                try {

                    locationName =
                        await getLocationName(
                            latitude,
                            longitude
                        );

                }


                catch (locationError) {

                    console.warn(
                        "Reverse geocoding failed:",
                        locationError
                    );


                    locationName =
                        "Current Location";
                }


                const locationParts =
                    locationName
                        .split(",")
                        .map(
                            part =>
                                part.trim()
                        );


                data.location.name =
                    locationParts[0] ||
                    "Current Location";


                if (
                    locationParts.length >= 2
                ) {

                    data.location.admin1 =
                        locationParts[1];
                }


                if (
                    locationParts.length >= 3
                ) {

                    data.location.country_code =
                        locationParts[2];
                }


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


                cityInput.value =
                    locationName;


                hideLoading();


                weatherError.hidden =
                    true;

                weatherContent.hidden =
                    false;

            }


            catch (error) {

                console.error(
                    "Location weather error:",
                    error
                );


                hideLoading();


                showError(
                    error.message ||
                    "Unable to fetch weather for your location."
                );
            }

        },


        error => {

            console.error(
                "Geolocation error:",
                error
            );


            hideLoading();


            let message =
                "Unable to access your location.";


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                message =
                    "Location permission was denied. Please allow location access and try again.";

            }


            else if (
                error.code ===
                error.POSITION_UNAVAILABLE
            ) {

                message =
                    "Your location could not be determined. Please try again.";

            }


            else if (
                error.code ===
                error.TIMEOUT
            ) {

                message =
                    "Location request timed out. Please try again.";
            }


            showError(
                message
            );
        },


        {
            enableHighAccuracy:
                true,

            timeout:
                10000,

            maximumAge:
                300000
        }
    );
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
   LOCATION BUTTON
========================================= */

locationBtn.addEventListener(
    "click",
    useMyLocation
);


/* =========================================
   FAVORITE BUTTON
========================================= */

if (favoriteBtn) {

    favoriteBtn.addEventListener(
        "click",
        () => {

            if (
                !currentFavoriteCity
            ) {

                return;
            }


            if (
                isFavorite(
                    currentFavoriteCity
                )
            ) {

                removeFavorite(
                    currentFavoriteCity
                );

            }

            else {

                addFavorite(
                    currentFavoriteCity
                );
            }


            updateFavoriteButton();
        }
    );
}


/* =========================================
   CLEAR RECENT SEARCHES
========================================= */

clearRecentBtn.addEventListener(
    "click",
    clearRecentSearches
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

        }

        else {

            cityInput.focus();
        }
    }
);


/* =========================================
   INITIALIZE
========================================= */

renderRecentSearches();

renderFavorites();