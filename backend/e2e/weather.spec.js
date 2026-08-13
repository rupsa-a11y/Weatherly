const { test, expect } = require("@playwright/test");

test("User can search for a city and see weather", async ({ page }) => {

    await page.goto("http://localhost:3000");

    await page.getByRole("textbox").fill("Kolkata");

    await page.getByRole("button", { name: /search/i }).click();

    await expect(page.locator("#weather-content")).toBeVisible();

    await expect(page.locator("#city-name"))
        .toContainText("Kolkata");
});