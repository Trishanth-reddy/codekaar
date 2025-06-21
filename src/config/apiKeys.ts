// API Configuration - All keys stored as variables for easy editing
export const API_KEYS = {
  // Google Gemini API for AI Assistant and Vision
  GEMINI_API_KEY: 'AIzaSyCuJ2BrgkfdBXWIQY6mtcbW1iGcMmDB0_c',
  
  // OpenWeatherMap API for Weather Data
  OPENWEATHERMAP_API_KEY: 'your_openweathermap_api_key_here',
  
  // AgMarkNet API for Market Prices
  AGMARKNET_API_KEY: 'your_agmarknet_api_key_here',
  
  // Replicate API for Advanced Image Analysis
  REPLICATE_API_KEY: 'your_replicate_api_key_here',
  
  // Speech Recognition and TTS
  SPEECH_API_KEY: 'your_speech_api_key_here'
};

// API Endpoints
export const API_ENDPOINTS = {
  GEMINI_BASE: 'https://generativelanguage.googleapis.com/v1/models',
  WEATHER_BASE: 'https://api.openweathermap.org/data/2.5',
  AGMARKNET_BASE: 'https://api.data.gov.in/resource',
  REPLICATE_BASE: 'https://api.replicate.com/v1'
};

// Default Configuration
export const APP_CONFIG = {
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'te'],
  DEFAULT_LOCATION: {
    state: 'Telangana',
    district: 'Hyderabad',
    village: ''
  },
  WEATHER_UPDATE_INTERVAL: 300000, // 5 minutes
  MARKET_UPDATE_INTERVAL: 600000, // 10 minutes
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  SUPPORTED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png']
};