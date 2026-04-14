const WeatherService = (() => {

  const API_KEY  = 'c2b416028d532492a83e28d65c010a11';
  const ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?q=Dolores+Hidalgo,MX&units=metric&lang=es&appid=${API_KEY}`;

  
  const emoji = (code) => {
    if (code >= 200 && code < 300) return '⛈️';
    if (code >= 300 && code < 600) return '🌧️';
    if (code >= 600 && code < 700) return '❄️';
    if (code === 800)              return '☀️';
    if (code > 800)                return '⛅';
    return '🌡️';
  };

  return {
    async init() {
      try {
        const res = await fetch(ENDPOINT);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d   = await res.json();

        document.getElementById('weather-icon').textContent = emoji(d.weather[0].id);
        document.getElementById('weather-temp').textContent = `${Math.round(d.main.temp)}°C`;
        document.getElementById('weather-desc').textContent = d.weather[0].description;
        document.getElementById('weather-extra').innerHTML  =
          `<p>💧 Humedad: ${d.main.humidity}%</p>
           <p>💨 Viento: ${d.wind.speed} m/s</p>
           <p>🤔 Sensación: ${Math.round(d.main.feels_like)}°C</p>`;
      } catch (err) {
        console.error('[WeatherService]', err);
        document.getElementById('weather-icon').textContent = '⚠️';
        document.getElementById('weather-desc').textContent = 'No disponible';
      }
    }
  };
})();