import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, MapPin, Thermometer } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState<string>("");

  const API_KEY = "27bad8363ddda38a5d52da4072d2adc1";

  const fetchWeather = async (city?: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);
    let url = "";
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    } else if (lat !== undefined && lon !== undefined) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      setError("No location provided");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch weather: ${res.status} ${res.statusText} - ${errorText}`);
      }
      const data = await res.json();
      const weatherData: WeatherData = {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        icon: data.weather[0].icon
      };
      setWeather(weatherData);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch weather data");
      console.error("Weather API error:", err);
    }
    setLoading(false);
  };

  // Initial fetch: geolocation or default city
  useEffect(() => {
    if (query) {
      fetchWeather(query);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          fetchWeather(undefined, pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          fetchWeather("Delhi"); // fallback city
        }
      );
    } else {
      fetchWeather("Delhi");
    }
    // eslint-disable-next-line
  }, [query]);

  const getWeatherIcon = (icon: string, condition: string) => {
    // Use OpenWeather icon if available
    if (icon) {
      return (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={condition}
          className="w-16 h-16 mx-auto"
        />
      );
    }
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-16 h-16" />;
      case 'partly cloudy':
      case 'cloudy':
        return <Cloud className="w-16 h-16" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-16 h-16" />;
      case 'snowy':
      case 'snow':
        return <CloudSnow className="w-16 h-16" />;
      default:
        return <Cloud className="w-16 h-16" />;
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <div className="text-center animate-fade-in">
          <Cloud className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <div className="text-center animate-fade-in">
          <Cloud className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <p className="text-lg text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md text-center animate-fade-in">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-1">Weather Today</h1>
          <p className="text-white/70 text-sm">Landscape Mode - Left Side Up</p>
        </div>

        {/* Search Bar */}
        <form
          className="mb-6 flex items-center justify-center gap-2"
          onSubmit={e => {
            e.preventDefault();
            setQuery(search);
          }}
        >
          <input
            type="text"
            placeholder="Search city..."
            className="bg-black/30 text-white rounded px-3 py-2 outline-none border border-white/20 w-2/3"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </form>

        {weather && (
          <>
            {/* Location */}
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-4 h-4 mr-2 text-white/60" />
              <span className="text-white/80">{weather.location}</span>
            </div>

            {/* Date */}
            <div className="mb-6 text-white/70 text-sm">
              {getCurrentDate()}
            </div>

            {/* Weather Icon and Temperature */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="text-yellow-300 animate-pulse-glow">
                  {getWeatherIcon(weather.icon, weather.condition)}
                </div>
              </div>
              <div className="text-5xl font-light mb-2 time-display">
                {weather.temperature}°C
              </div>
              <div className="text-lg text-white/80">
                {weather.condition}
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4 backdrop-blur-md bg-black/40 border border-yellow-400/30 shadow-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-yellow-400/60 hover:via-pink-400/40 hover:to-black/60">
                <div className="flex items-center justify-center mb-2">
                  <Thermometer className="w-5 h-5 text-blue-300" />
                </div>
                <div className="text-sm text-white/70">Humidity</div>
                <div className="text-xl font-semibold">{weather.humidity}%</div>
              </div>
              <div className="glass rounded-2xl p-4 backdrop-blur-md bg-black/40 border border-yellow-400/30 shadow-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-yellow-400/60 hover:via-pink-400/40 hover:to-black/60">
                <div className="flex items-center justify-center mb-2">
                  <Cloud className="w-5 h-5 text-gray-300" />
                </div>
                <div className="text-sm text-white/70">Wind</div>
                <div className="text-xl font-semibold">{weather.windSpeed} km/h</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;