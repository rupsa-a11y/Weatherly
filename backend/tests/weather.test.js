const request = require("supertest");
const app = require("../app");

test("GET /api/weather returns 400 when city is missing", async () => {

    const response = await request(app)
        .get("/api/weather");

    expect(response.statusCode).toBe(400);

    expect(response.body).toHaveProperty("error");

    expect(response.body.error).toBe("City is required");
});

test("GET /api/weather returns 404 for an invalid city", async () => {

    const response = await request(app)
        .get("/api/weather?city=InvalidCityXYZ123");

    expect(response.statusCode).toBe(404);

    expect(response.body).toHaveProperty("error");

    expect(response.body.error).toBe("City not found");
});

test("GET /api/weather returns weather for Kolkata", async () => {

    const response = await request(app)
        .get("/api/weather?city=Kolkata");

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("location");

    expect(response.body).toHaveProperty("weather");

    expect(response.body.location.name).toBe("Kolkata");

    expect(response.body.weather).toHaveProperty("current");

    expect(response.body.weather.current)
        .toHaveProperty("temperature_2m");
});

test("GET /api/weather returns weather for Jaipur", async () => {

    const response = await request(app)
        .get("/api/weather?city=Jaipur");

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("location");
    expect(response.body).toHaveProperty("weather");

    expect(response.body.location.name).toBe("Jaipur");

    expect(response.body.weather).toHaveProperty("current");
    expect(response.body.weather.current)
        .toHaveProperty("temperature_2m");
});


test("GET /api/weather returns 502 when weather service fails", async () => {

    global.fetch = jest.fn()
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

    expect(global.fetch).toHaveBeenCalledTimes(2);

    global.fetch = undefined;
});