import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function WeatherPage() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const lat = 65.0142;
    const lon = 25.4719;

    axios
      .get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude: 60.17,
          longitude: 24.94,
          hourly: ["temperature_2m", "weathercode"],
          daily: ["temperature_2m_max", "temperature_2m_min", "weathercode"],
          current_weather: true,
          timezone: "auto",
        },
      })
      .then((res) => {
        setWeather(res.data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }, []);

  if (!weather) {
    return (
      <div className="teletext-box">
        <div className="headline">⛅ Sääsivu 110 (Oulu)</div>
        <p>Ladataan säätietoja...</p>
      </div>
    );
  }

  const current = weather.current_weather;
  const today = weather.daily;

  const weatherCodeMap = {
    0: "Selkeää ☀️",
    1: "Melkein selkeää 🌤️",
    2: "Puolipilvistä ⛅",
    3: "Pilvistä ☁️",
    45: "Sumua 🌫️",
    48: "Kuuraa ❄️",
    51: "Kevyttä tihkua 🌦️",
    53: "Kohtalaista tihkua 🌧️",
    55: "Voimakasta tihkua 🌧️",
    61: "Kevyttä sadetta 🌦️",
    63: "Kohtalaista sadetta 🌧️",
    65: "Voimakasta sadetta 🌧️",
    66: "Jäätävää sadetta 🧊",
    67: "Voimakasta jäätävää sadetta 🧊",
    71: "Kevyttä lunta 🌨️",
    73: "Kohtalaista lunta 🌨️",
    75: "Voimakasta lunta ❄️",
    77: "Lumirakeita ❄️",
    80: "Sadekuuro 🌦️",
    81: "Kohtalainen kuuro 🌧️",
    82: "Voimakas sadekuuro 🌧️",
    85: "Lumikuuro 🌨️",
    86: "Voimakas lumikuuro ❄️",
    95: "Ukkosta ⛈️",
    96: "Ukkosta ja rakeita ⛈️",
    99: "Voimakasta ukkosta ja rakeita ⛈️",
  };

  const hourlyTimes = weather.hourly.time;
  const hourlyTemps = weather.hourly.temperature_2m;
  const hourlyCodes = weather.hourly.weathercode;

  const now = new Date();
  const forecast24h = [];

  for (let i = 0; i < hourlyTimes.length; i++) {
    const time = new Date(hourlyTimes[i]);
    const diffHours = (time - now) / (1000 * 60 * 60);

    if (diffHours >= 0 && diffHours <= 24 && i % 3 === 0) {
      forecast24h.push({
        time: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: hourlyTemps[i],
        description: weatherCodeMap[hourlyCodes[i]] || "Tuntematon",
      });
    }
  }

  const daily = weather.daily;
  const forecast7d = daily.time.map((dateStr, index) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString("fi-FI", { weekday: "short" }); // e.g. "ma", "ti"
    const avgTemp = Math.round(
      (daily.temperature_2m_max[index] + daily.temperature_2m_min[index]) / 2
    );
    const description =
      weatherCodeMap[daily.weathercode[index]] || "Tuntematon";

    return {
      day: dayName,
      temp: avgTemp,
      description,
    };
  });

  return (
    <div className="teletext-box">
      <div className="headline">⛅ Sääsivu 110 (Oulu)</div>

      <p>
        <strong>Seuraavat 24h (3h välein):</strong>
      </p>
      {forecast24h.map((f, i) => (
        <p key={i}>
          {f.time}: {f.temp}°C – {f.description}
        </p>
      ))}

      <br />
      <p>
        <strong>Viikon ennuste:</strong>
      </p>
      {forecast7d.map((f, i) => (
        <p key={i}>
          {f.day}: {f.temp}°C – {f.description}
        </p>
      ))}
    </div>
  );
}

export default WeatherPage;
