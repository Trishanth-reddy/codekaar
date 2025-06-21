import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

export interface WeatherData {
  location: string;
  current: {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    icon: string;
    feelsLike: number;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
  }>;
  alerts: Array<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    validUntil: string;
  }>;
  lastUpdated: string;
}

class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_KEYS.OPENWEATHERMAP_API_KEY;
    this.baseUrl = API_ENDPOINTS.WEATHER_BASE;
  }

  async getCurrentWeather(lat: number, lon: number, language: 'en' | 'te' = 'en'): Promise<WeatherData> {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=${language}`),
        fetch(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=${language}`)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Weather API request failed');
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      return this.formatWeatherData(currentData, forecastData, language);
    } catch (error) {
      console.error('Weather Service Error:', error);
      // Return mock data if API fails
      return this.getMockWeatherData(language);
    }
  }

  async getWeatherByLocation(location: string, language: 'en' | 'te' = 'en'): Promise<WeatherData> {
    try {
      const geocodeResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${this.apiKey}`
      );

      if (!geocodeResponse.ok) {
        throw new Error('Geocoding failed');
      }

      const geocodeData = await geocodeResponse.json();
      if (geocodeData.length === 0) {
        throw new Error('Location not found');
      }

      const { lat, lon } = geocodeData[0];
      return this.getCurrentWeather(lat, lon, language);
    } catch (error) {
      console.error('Weather by location error:', error);
      return this.getMockWeatherData(language);
    }
  }

  generateFarmingAlerts(weatherData: WeatherData, language: 'en' | 'te' = 'en'): string[] {
    const alerts: string[] = [];
    const current = weatherData.current;
    const forecast = weatherData.forecast;

    // Temperature alerts
    if (current.temperature > 35) {
      alerts.push(language === 'te' 
        ? 'అధిక వేడిమి - పంటలకు నీరు ఎక్కువగా ఇవ్వండి'
        : 'High temperature - Increase watering for crops'
      );
    }

    if (current.temperature < 10) {
      alerts.push(language === 'te'
        ? 'చల్లని వాతావరణం - పంటలను రక్షించండి'
        : 'Cold weather - Protect crops from frost'
      );
    }

    // Rain alerts
    const rainInNext24h = forecast.slice(0, 8).some(f => f.precipitation > 0.5);
    if (rainInNext24h) {
      alerts.push(language === 'te'
        ? 'వర్షం అవకాశం - పురుగుమందు చల్లకండి'
        : 'Rain expected - Avoid pesticide spraying'
      );
    }

    // Wind alerts
    if (current.windSpeed > 20) {
      alerts.push(language === 'te'
        ? 'గాలి వేగం అధికం - పంట రక్షణ చర్యలు తీసుకోండి'
        : 'High wind speed - Take crop protection measures'
      );
    }

    // Humidity alerts
    if (current.humidity > 80) {
      alerts.push(language === 'te'
        ? 'అధిక తేమ - ఫంగల్ వ్యాధుల కోసం గమనించండి'
        : 'High humidity - Watch for fungal diseases'
      );
    }

    return alerts;
  }

  private formatWeatherData(currentData: any, forecastData: any, language: 'en' | 'te'): WeatherData {
    const current = {
      temperature: Math.round(currentData.main.temp),
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      pressure: currentData.main.pressure,
      visibility: Math.round((currentData.visibility || 10000) / 1000),
      icon: currentData.weather[0].icon,
      feelsLike: Math.round(currentData.main.feels_like),
      uvIndex: 5 // Mock UV index as it's not in free tier
    };

    const forecast = forecastData.list.slice(0, 7).map((item: any, index: number) => ({
      date: new Date(item.dt * 1000).toISOString(),
      day: index === 0 ? (language === 'te' ? 'ఈరోజు' : 'Today') : 
           new Date(item.dt * 1000).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', { weekday: 'long' }),
      high: Math.round(item.main.temp_max),
      low: Math.round(item.main.temp_min),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 3.6),
      precipitation: item.rain ? item.rain['3h'] || 0 : 0
    }));

    const alerts = this.generateWeatherAlerts(currentData, forecastData, language);

    return {
      location: currentData.name,
      current,
      forecast,
      alerts,
      lastUpdated: new Date().toISOString()
    };
  }

  private generateWeatherAlerts(currentData: any, forecastData: any, language: 'en' | 'te'): WeatherData['alerts'] {
    const alerts: WeatherData['alerts'] = [];

    // Check for severe weather conditions
    const currentWeather = currentData.weather[0];
    
    if (currentWeather.id >= 200 && currentWeather.id < 300) {
      alerts.push({
        title: language === 'te' ? 'ఉరుములతో వర్షం' : 'Thunderstorm Alert',
        description: language === 'te' 
          ? 'ఉరుములతో వర్షం అవకాశం. ఆరుబయట పనులు వాయిదా వేయండి.'
          : 'Thunderstorm expected. Postpone outdoor activities.',
        severity: 'high',
        validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
      });
    }

    if (currentData.main.temp > 40) {
      alerts.push({
        title: language === 'te' ? 'వేడిమి హెచ్చరిక' : 'Heat Wave Alert',
        description: language === 'te'
          ? 'అధిక వేడిమి. పంటలకు అదనపు నీరు ఇవ్వండి.'
          : 'Extreme heat. Provide extra water to crops.',
        severity: 'high',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return alerts;
  }

  private getMockWeatherData(language: 'en' | 'te'): WeatherData {
    return {
      location: language === 'te' ? 'హైదరాబాద్' : 'Hyderabad',
      current: {
        temperature: 28,
        description: language === 'te' ? 'పాక్షిక మేఘావృతం' : 'Partly cloudy',
        humidity: 65,
        windSpeed: 12,
        pressure: 1013,
        visibility: 10,
        icon: '02d',
        feelsLike: 31,
        uvIndex: 6
      },
      forecast: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
        day: i === 0 ? (language === 'te' ? 'ఈరోజు' : 'Today') : 
             new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', { weekday: 'long' }),
        high: 30 + Math.floor(Math.random() * 6),
        low: 22 + Math.floor(Math.random() * 4),
        description: language === 'te' ? 'పాక్షిక మేఘావృతం' : 'Partly cloudy',
        icon: '02d',
        humidity: 60 + Math.floor(Math.random() * 20),
        windSpeed: 10 + Math.floor(Math.random() * 8),
        precipitation: Math.random() * 2
      })),
      alerts: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

export const weatherService = new WeatherService();