# Weatherly 🌤️

Weatherly is a full-stack weather dashboard that provides real-time weather information, forecasts, and atmospheric conditions for any city.

The project was built to practice and demonstrate frontend development, backend API integration, automated API testing, end-to-end testing, API testing with Postman, and CI automation with GitHub Actions.

---

## ✨ Features

- 🔎 Search weather by city
- 🌡️ Display current temperature
- 💧 Display humidity
- 💨 Display wind information
- 🌅 Display sunrise and sunset
- 📅 Display a 5-day weather forecast
- ☁️ Display additional weather details
- ⚠️ Handle invalid or missing city input
- 🔄 Loading state while fetching weather
- ❌ Weather-service error handling
- 📱 Responsive UI for desktop and mobile
- 🧪 Automated API tests
- 🎭 End-to-end browser tests
- 📬 Postman API test collection
- ⚙️ GitHub Actions CI pipeline

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

### Backend

- Node.js
- Express.js
- REST API

### Testing

- Jest
- Supertest
- Playwright
- Postman

### DevOps

- Git
- GitHub
- GitHub Actions

---

## 📁 Project Structure

```text
weather app/
│
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   │
│   └── tests/
│       ├── weather.test.js
│       └── weather.fixture.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── e2e/
│   └── weather.spec.js
│
├── postman/
│   └── Weatherly API Tests.postman_collection.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
└── README.md