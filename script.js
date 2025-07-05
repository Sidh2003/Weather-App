const apiKey = "67475fc1edbd457d633537c353f2751c"; // Replace with your API key

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then((data) => updateWeather(data))
    .catch((error) => {
      document.getElementById("cityName").textContent = "City not found";
      document.getElementById("temperature").textContent = "--°C";
      document.getElementById("humidity").textContent = "--%";
      document.getElementById("wind").textContent = "-- km/h";
      document.getElementById("weatherIcon").src = "./img/default.png";
      console.error(error);
    });
}

function updateWeather(data) {
  const { name } = data;
  const { temp, humidity } = data.main;
  const { speed } = data.wind;
  const weatherMain = data.weather[0].main.toLowerCase();
  const timestamp = data.dt;
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;

  let timeImage = "default.png";

  if (weatherMain.includes("rain")) {
    timeImage = "rain.png";
  } else if (weatherMain.includes("snow")) {
    timeImage = "snow.png";
  } else {
    if (timestamp < sunrise) {
      timeImage = "moon.png"; // Night before sunrise
    } else if (timestamp >= sunrise && timestamp < sunrise + 2 * 3600) {
      timeImage = "sunrise.png"; // Morning
    } else if (timestamp >= sunset && timestamp < sunset + 2 * 3600) {
      timeImage = "sunset.png"; // Evening
    } else if (timestamp >= sunset + 2 * 3600) {
      timeImage = "moon.png"; // Night after sunset
    } else {
      timeImage = "default.png"; // Daytime fallback
    }
  }

  document.getElementById("cityName").textContent = name;
  document.getElementById("temperature").textContent = `${Math.round(temp)}°C`;
  document.getElementById("humidity").textContent = `${humidity}%`;
  document.getElementById("wind").textContent = `${speed} km/h`;
  document.getElementById("weatherIcon").src = `./img/${timeImage}`;
}
