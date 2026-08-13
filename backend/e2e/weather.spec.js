const { test, expect } = require("@playwright/test");


// =========================================
// VALID CITY
// =========================================

test("User can search for a city and see weather", async ({ page }) => {

    // Mock geocoding API
    await page.route(
        "**/geocoding-api.open-meteo.com/**",
        async route => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    results: [
                        {
                            name: "Kolkata",
                            country: "India",
                            country_code: "IN",
                            admin1: "West Bengal",
                            latitude: 22.57,
                            longitude: 88.36
                        }
                    ]
                })
            });
        }
    );

    // Mock weather API
    await page.route(
        "**/api.open-meteo.com/v1/forecast**",
        async route => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    current: {
                        time: "2026-08-13T10:00",
                        temperature_2m: 28,
                        relative_humidity_2m: 80,
                        apparent_temperature: 30,
                        weather_code: 53,
                        surface_pressure: 1005,
                        wind_speed_10m: 10,
                        visibility: 10000,
                        cloud_cover: 60
                    },

                    hourly: {
                        time: [
                            "2026-08-13T10:00"
                        ],
                        uv_index: [5]
                    },

                    daily: {
                        time: [
                            "2026-08-13",
                            "2026-08-14",
                            "2026-08-15"
                        ],
                        weather_code: [53, 3, 61],
                        temperature_2m_max: [30, 31, 29],
                        temperature_2m_min: [25, 26, 24],
                        sunrise: [
                            "2026-08-13T05:00"
                        ],
                        sunset: [
                            "2026-08-13T18:20"
                        ]
                    }
                })
            });
        }
    );

    await page.goto("http://localhost:3000");

    await page.getByRole("textbox").fill("Kolkata");

    await page.getByRole("button", { name: /search/i }).click();

    await expect(page.locator("#weather-content"))
        .toBeVisible();

    await expect(page.locator("#city-name"))
        .toContainText("Kolkata");
});


// =========================================
// INVALID CITY
// =========================================

test("User sees an error for an invalid city", async ({ page }) => {

    // Mock geocoding API with no results
    await page.route(
        "**/geocoding-api.open-meteo.com/**",
        async route => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    results: []
                })
            });
        }
    );

    await page.goto("http://localhost:3000");

    await page.getByRole("textbox")
        .fill("ThisCityDoesNotExist12345");

    await page.getByRole("button", { name: /search/i })
        .click();

    await expect(page.locator("#weather-error"))
        .toBeVisible();
});