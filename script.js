const UNSPLASH_KEY = "--JWpQuvox_7HN8TSVRshKwvLq527tQDife1boyH29M";
const WEATHER_KEY = "535555e1e5933b4cce63f404087d3faa";

async function searchDestination() {
  const place = document.getElementById("destination").value.trim();
  if (!place) return alert("Please enter a city!");

  const photosDiv = document.getElementById("photos");
  const weatherDiv = document.getElementById("weather");
  const cityDiv = document.getElementById("city-details");

  photosDiv.innerHTML = "";
  weatherDiv.innerHTML = "";
  cityDiv.innerHTML = "<p>Loading city details...</p>";

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
    } else {
      weatherDiv.innerHTML = `
        <h3>Weather in ${weatherData.name}</h3>
        <p>🌡️ Temperature: ${weatherData.main.temp}°C</p>
        <p>Condition: ${weatherData.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="weather icon" />
      `;
    }
  } catch (err) {
    weatherDiv.innerHTML = "<p>Error fetching weather. Check your OpenWeatherMap API key.</p>";
    console.error(err);
  }

  // -------------------- Fetch City Summary from Wikipedia (No Image) --------------------
  try {
    const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place)}`);
    const wikiData = await wikiRes.json();

    if (wikiData.extract) {
      cityDiv.innerHTML = `
        <h3>About ${wikiData.title}</h3>
        <p>${wikiData.extract}</p>
      `;
    } else {
      cityDiv.innerHTML = "<p>No detailed information found for this city.</p>";
    }
  } catch (err) {
    cityDiv.innerHTML = "<p>Error fetching city info from Wikipedia.</p>";
    console.error(err);
  }

  // -------------------- Fetch Famous Places --------------------
  fetchFamousPlaces(place);
}

async function fetchFamousPlaces(city) {
  const cityDiv = document.getElementById("city-details");

  try {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=tourist%20attractions%20in%20${encodeURIComponent(city)}&format=json&origin=*`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.query.search || data.query.search.length === 0) {
      cityDiv.innerHTML += `<h4>Famous Places to Visit</h4><p>No famous places found for this city.</p>`;
      return;
    }

    // Show top 5 places
    const places = data.query.search.slice(0, 5);

    let html = `<h4>Famous Places to Visit in ${city}</h4><ul>`;
    places.forEach(place => {
      const pageTitle = place.title;
      const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;
      html += `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${pageTitle}</a></li>`;
    });
    html += `</ul>`;

    cityDiv.innerHTML += html;

  } catch (err) {
    console.error(err);
    cityDiv.innerHTML += `<p>Error fetching famous places.</p>`;
  }
}

























































