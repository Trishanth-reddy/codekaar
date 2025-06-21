import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  Gauge,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Sunrise,
  Sunset,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { weatherService } from '../services/weatherService';

export default function Weather() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { weatherData, setWeatherData } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!weatherData) {
      fetchWeatherData();
    }
  }, []);

  const fetchWeatherData = async () => {
    if (!user?.location.district) return;

    setLoading(true);
    setError('');

    try {
      const data = await weatherService.getWeatherByLocation(
        `${user.location.district}, Telangana, India`,
        language
      );
      setWeatherData(data);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(language === 'te' 
        ? 'వాతావరణ డేటా లోడ్ చేయడంలో లోపం'
        : 'Error loading weather data'
      );
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sunny':
      case 'clear':
      case '01d':
      case '01n':
        return Sun;
      case 'rain':
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return CloudRain;
      case 'partly-cloudy':
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return Cloud;
      case 'thunderstorm':
      case '11d':
      case '11n':
        return Zap;
      default:
        return Cloud;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getTimeBasedGradient = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) {
      return 'from-orange-400 via-yellow-400 to-yellow-500'; // Morning
    } else if (hour >= 12 && hour < 18) {
      return 'from-blue-400 via-cyan-400 to-blue-500'; // Afternoon
    } else {
      return 'from-purple-600 via-blue-600 to-indigo-700'; // Evening/Night
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Sun className="h-8 w-8 text-yellow-500" />
            </motion.div>
            {language === 'te' ? 'వాతావరణ అంచనా' : 'Weather Forecast'}
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {user?.location.village}, {user?.location.district}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchWeatherData}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600">
            {language === 'te' ? 'వాతావరణ డేటా లోడ్ చేస్తోంది...' : 'Loading weather data...'}
          </p>
        </motion.div>
      ) : weatherData ? (
        <>
          {/* Weather Alerts */}
          <AnimatePresence>
            {weatherData.alerts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3"
              >
                {weatherData.alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <div className="flex items-start space-x-3 relative z-10">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-medium">{alert.title}</h3>
                        <p className="text-sm mt-1">{alert.description}</p>
                        <p className="text-xs mt-2 opacity-75">
                          {language === 'te' ? 'చెల్లుబాటు వరకు: ' : 'Valid until: '}
                          {new Date(alert.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Weather */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`bg-gradient-to-r ${getTimeBasedGradient()} rounded-lg p-6 text-white relative overflow-hidden`}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-white/20 rounded-full"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -80, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${20 + (i % 2) * 60}%`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium mb-2 flex items-center">
                    <Thermometer className="h-5 w-5 mr-2" />
                    {language === 'te' ? 'ప్రస్తుత వాతావరణం' : 'Current Weather'}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        className="text-4xl font-bold"
                      >
                        {weatherData.current.temperature}°C
                      </motion.div>
                      <div className="text-white/90 capitalize">
                        {weatherData.current.description}
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div 
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="p-4 bg-white/20 backdrop-blur-sm rounded-full"
                >
                  {React.createElement(getWeatherIcon(weatherData.current.icon), {
                    className: "h-12 w-12"
                  })}
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/30"
              >
                {[
                  { icon: Droplets, label: language === 'te' ? 'తేమ' : 'Humidity', value: `${weatherData.current.humidity}%` },
                  { icon: Wind, label: language === 'te' ? 'గాలి వేగం' : 'Wind Speed', value: `${weatherData.current.windSpeed} km/h` },
                  { icon: Gauge, label: language === 'te' ? 'వత్తిడి' : 'Pressure', value: `${weatherData.current.pressure} hPa` },
                  { icon: Eye, label: language === 'te' ? 'దృశ్యత' : 'Visibility', value: `${weatherData.current.visibility} km` }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4 text-white/80" />
                    <div>
                      <div className="text-sm text-white/80">{item.label}</div>
                      <div className="font-medium">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* 7-Day Forecast */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                {language === 'te' ? '7-రోజుల అంచనా' : '7-Day Forecast'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {weatherData.forecast.map((day, index) => {
                  const WeatherIcon = getWeatherIcon(day.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="p-2 bg-blue-100 rounded-full"
                        >
                          <WeatherIcon className="h-5 w-5 text-blue-600" />
                        </motion.div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {day.day}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {day.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Droplets className="h-3 w-3" />
                          <span>{day.humidity}%</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Wind className="h-3 w-3" />
                          <span>{day.windSpeed} km/h</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {day.high}°
                          </div>
                          <div className="text-gray-500">
                            {day.low}°
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-gray-500"
          >
            {language === 'te' ? 'చివరిసారి అప్‌డేట్: ' : 'Last updated: '}
            {new Date(weatherData.lastUpdated).toLocaleString()}
          </motion.div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {language === 'te' ? 'వాతావరణ డేటా అందుబాటులో లేదు' : 'No weather data available'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'te' 
              ? 'వాతావరణ సమాచారం పొందడానికి రిఫ్రెష్ చేయండి'
              : 'Refresh to get weather information'
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchWeatherData}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'te' ? 'రిఫ్రెష్' : 'Refresh'}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}