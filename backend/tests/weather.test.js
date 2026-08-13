const request = require("supertest");
const app = require("../app");

let consoleErrorSpy;

beforeEach(() => {
    consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});


// =========================================
// MISSING CITY
// =========================================

test("GET /api/weather returns 400 when city is missing", async () => {

    const response = await request(app)
        .get("/api/weather");

    expect(response.statusCode).toBe(400);

    expect(response.body).toHaveProperty("error");

    expect(response.body.error).toBe("City is required");
});


// =========================================
// INVALID CITY
// =========================================

test("GET /api/weather returns 404 for an invalid city", async () => {

    const response = await request(app)
        .get("/api/weather?city=InvalidCityXYZ123");

    expect(response.statusCode).toBe(404);

    expect(response.body).toHaveProperty("error");

    expect(response.body.error).toBe("City not found");
});


// =========================================
// KOLKATA WEATHER
// =========================================

test("GET /api/weather returns weather for Kolkata", async () => {

    const response = await request(app)
        .get("/api/weather?city=Kolkata");

    expect(response.statusCode).toBe(200);

    // Response structure
    expect(response.body).toHaveProperty("location");
    expect(response.body).toHaveProperty("weather");

    // Location structure
    expect(response.body.location)
        .toHaveProperty("name");

    expect(response.body.location)
        .toHaveProperty("country");

    expect(response.body.location)
        .toHaveProperty("latitude");

    expect(response.body.location)
        .toHaveProperty("longitude");

    expect(response.body.location.name)
        .toBe("Kolkata");

    // Weather structure
    expect(response.body.weather)
        .toHaveProperty("current");

    expect(response.body.weather)
        .toHaveProperty("daily");

    // Current weather structure
    expect(response.body.weather.current)
        .toHaveProperty("temperature_2m");

    expect(response.body.weather.current)
        .toHaveProperty("relative_humidity_2m");

    expect(response.body.weather.current)
        .toHaveProperty("weather_code");
});


// =========================================
// JAIPUR WEATHER
// =========================================

test("GET /api/weather returns weather for Jaipur", async () => {

    const response = await request(app)
        .get("/api/weather?city=Jaipur");

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("location");

    expect(response.body).toHaveProperty("weather");

    expect(response.body.location.name)
        .toBe("Jaipur");

    expect(response.body.weather)
        .toHaveProperty("current");

    expect(response.body.weather.current)
        .toHaveProperty("temperature_2m");
});


// =========================================
// WEATHER SERVICE FAILURE
// =========================================

test(
    "GET /api/weather returns 502 when weather service fails",
    async () => {

        jest.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    results: [
                        {
                            name: "Kolkata",
                            country: "India",
                            country_code: "IN",
                            latitude: 22.57,
                            longitude: 88.36
                        }
                    ]
                })
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: "Internal Server Error"
            });

        const response = await request(app)
            .get("/api/weather?city=Kolkata");

        expect(response.statusCode).toBe(502);

        expect(response.body.error)
            .toBe("Unable to connect to weather service");

        expect(global.fetch)
            .toHaveBeenCalledTimes(2);
    }
);


// =========================================
// WHITESPACE INPUT
// =========================================

test(
    "GET /api/weather returns 400 when city contains only spaces",
    async () => {

        const response = await request(app)
            .get("/api/weather?city=%20%20%20");

        expect(response.statusCode).toBe(400);

        expect(response.body.error)
            .toBe("City is required");
    }
);