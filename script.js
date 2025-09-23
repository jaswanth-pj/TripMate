const UNSPLASH_KEY = "--JWpQuvox_7HN8TSVRshKwvLq527tQDife1boyH29M";        
const WEATHER_KEY = "535555e1e5933b4cce63f404087d3faa";  

async function searchDestination() {
  const place = document.getElementById("destination").value.trim();
  if (!place) return alert("Please enter a city!");

  const photosDiv = document.getElementById("photos");
  const weatherDiv = document.getElementById("weather");
  photosDiv.innerHTML = "";
  weatherDiv.innerHTML = "";

  // -------------------- Fetch Photos --------------------
  try {
    const photoRes = await fetch(`https://api.unsplash.com/search/photos?query=${place}&client_id=${UNSPLASH_KEY}`);
    const photoData = await photoRes.json();

    if (photoData.results.length === 0) {
      photosDiv.innerHTML = "<p>No photos found for this location.</p>";
    } else {
      photoData.results.slice(0, 4).forEach(p => {
        let img = document.createElement("img");
        img.src = p.urls.small;
        photosDiv.appendChild(img);
      });
    }
  } catch (err) {
    photosDiv.innerHTML = "<p>Error fetching photos. Check your Unsplash API key.</p>";
    console.error(err);
  }

  // -------------------- Fetch Weather --------------------
  try {
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${WEATHER_KEY}&units=metric`);
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      weatherDiv.innerHTML = `<p>Weather not found: ${weatherData.message}</p>`;
      return;
    }

    weatherDiv.innerHTML = `
      <h3>Weather in ${weatherData.name}</h3>
      <p>🌡️ Temperature: ${weatherData.main.temp}°C</p>
      <p>Condition: ${weatherData.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png">
    `;
  } catch (err) {
    weatherDiv.innerHTML = "<p>Error fetching weather. Check your OpenWeatherMap API key.</p>";
    console.error(err);
  }
}
























































