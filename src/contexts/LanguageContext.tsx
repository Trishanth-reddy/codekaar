import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Language = 'en' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation data
const translations = {
  en: {
    // Common
    'app.title': 'Rythu Saathi',
    'app.subtitle': 'Your Smart Farming Assistant',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.next': 'Next',
    'common.back': 'Back',
    'common.submit': 'Submit',
    'common.close': 'Close',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.loginTitle': 'Welcome Back',
    'auth.signupTitle': 'Create Account',
    'auth.loginSubtitle': 'Sign in to access your farming assistant',
    'auth.signupSubtitle': 'Join thousands of farmers using Rythu Saathi',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.emailExists': 'Email already exists',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.assistant': 'AI Assistant',
    'nav.analysis': 'Image Analysis',
    'nav.weather': 'Weather',
    'nav.markets': 'Markets',
    'nav.schemes': 'Schemes',
    'nav.finance': 'Finance',
    'nav.forum': 'Forum',
    'nav.profile': 'Profile',
    
    // Onboarding
    'onboarding.welcome': 'Welcome to Rythu Saathi',
    'onboarding.selectLanguage': 'Select your preferred language',
    'onboarding.selectUserType': 'What describes you best?',
    'onboarding.farmer': 'Farmer',
    'onboarding.gardener': 'Gardener',
    'onboarding.location': 'Tell us your location',
    'onboarding.village': 'Village/Town',
    'onboarding.district': 'District',
    'onboarding.complete': 'Complete Setup',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.goodMorning': 'Good morning',
    'dashboard.goodAfternoon': 'Good afternoon',
    'dashboard.goodEvening': 'Good evening',
    'dashboard.todayWeather': "Today's Weather",
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.askAI': 'Ask AI Assistant',
    'dashboard.analyzeImage': 'Analyze Image',
    'dashboard.checkWeather': 'Check Weather',
    'dashboard.browseSchemes': 'Browse Schemes',
    'dashboard.recentActivity': 'Recent Activity',
    
    // Weather
    'weather.title': 'Weather Forecast',
    'weather.current': 'Current Weather',
    'weather.forecast': '7-Day Forecast',
    'weather.temperature': 'Temperature',
    'weather.humidity': 'Humidity',
    'weather.windSpeed': 'Wind Speed',
    'weather.pressure': 'Pressure',
    'weather.alerts': 'Weather Alerts',
    
    // AI Assistant
    'assistant.title': 'AI Assistant',
    'assistant.askQuestion': 'Ask me anything about farming...',
    'assistant.voiceInput': 'Voice Input',
    'assistant.typeMessage': 'Type your message...',
    'assistant.send': 'Send',
    'assistant.listening': 'Listening...',
    'assistant.processing': 'Processing...',
    
    // Image Analysis
    'analysis.title': 'Image Analysis',
    'analysis.uploadImage': 'Upload Image',
    'analysis.dropImage': 'Drop image here or click to upload',
    'analysis.analyzing': 'Analyzing image...',
    'analysis.results': 'Analysis Results',
    'analysis.cropDisease': 'Crop Disease Detection',
    'analysis.soilAnalysis': 'Soil Analysis',
    'analysis.plantHealth': 'Plant Health Assessment',
    
    // Schemes
    'schemes.title': 'Government Schemes',
    'schemes.eligible': 'Eligible Schemes',
    'schemes.all': 'All Schemes',
    'schemes.apply': 'Apply Now',
    'schemes.learnMore': 'Learn More',
    'schemes.benefits': 'Benefits',
    'schemes.eligibility': 'Eligibility',
    
    // Forum
    'forum.title': 'Community Forum',
    'forum.askQuestion': 'Ask a Question',
    'forum.recent': 'Recent Discussions',
    'forum.popular': 'Popular Topics',
    'forum.myPosts': 'My Posts',
    'forum.reply': 'Reply',
    'forum.like': 'Like',
    'forum.share': 'Share',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personal': 'Personal Information',
    'profile.preferences': 'Preferences',
    'profile.notifications': 'Notifications',
    'profile.language': 'Language',
    'profile.userType': 'User Type',
    'profile.location': 'Location'
  },
  te: {
    // Common
    'app.title': 'రైతు సాథి',
    'app.subtitle': 'మీ స్మార్ట్ వ్యవసాయ సహాయకుడు',
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.error': 'ఏదో తప్పు జరిగింది',
    'common.success': 'విజయవంతం',
    'common.cancel': 'రద్దు',
    'common.save': 'సేవ్',
    'common.next': 'తరువాత',
    'common.back': 'వెనుక',
    'common.submit': 'సమర్పించు',
    'common.close': 'మూసివేయి',
    
    // Auth
    'auth.login': 'లాగిన్',
    'auth.signup': 'సైన్ అప్',
    'auth.logout': 'లాగ్అవుట్',
    'auth.email': 'ఇమెయిల్',
    'auth.password': 'పాస్‌వర్డ్',
    'auth.confirmPassword': 'పాస్‌వర్డ్ నిర్ధారించండి',
    'auth.name': 'పూర్తి పేరు',
    'auth.phone': 'ఫోన్ నంబర్',
    'auth.loginTitle': 'తిరిగి స్వాగతం',
    'auth.signupTitle': 'ఖాతా సృష్టించండి',
    'auth.loginSubtitle': 'మీ వ్యవసాయ సహాయకుడిని యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి',
    'auth.signupSubtitle': 'రైతు సాథిని ఉపయోగిస్తున్న వేలాది రైతులతో చేరండి',
    'auth.noAccount': 'ఖాతా లేదా?',
    'auth.hasAccount': 'ఇప్పటికే ఖాతా ఉందా?',
    'auth.invalidCredentials': 'తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్',
    'auth.emailExists': 'ఇమెయిల్ ఇప్పటికే ఉంది',
    
    // Navigation
    'nav.dashboard': 'డ్యాష్‌బోర్డ్',
    'nav.assistant': 'AI సహాయకుడు',
    'nav.analysis': 'చిత్ర విశ్లేషణ',
    'nav.weather': 'వాతావరణం',
    'nav.markets': 'మార్కెట్లు',
    'nav.schemes': 'పథకాలు',
    'nav.finance': 'ఫైనాన్స్',
    'nav.forum': 'ఫోరమ్',
    'nav.profile': 'ప్రొఫైల్',
    
    // Onboarding
    'onboarding.welcome': 'రైతు సాథికి స్వాగతం',
    'onboarding.selectLanguage': 'మీ ప్రాధాన్య భాషను ఎంచుకోండి',
    'onboarding.selectUserType': 'మిమ్మల్ని ఏది బాగా వర్ణిస్తుంది?',
    'onboarding.farmer': 'రైతు',
    'onboarding.gardener': 'తోటమాలి',
    'onboarding.location': 'మీ స్థానం చెప్పండి',
    'onboarding.village': 'గ్రామం/పట్టణం',
    'onboarding.district': 'జిల్లా',
    'onboarding.complete': 'సెటప్ పూర్తి చేయండి',
    
    // Dashboard
    'dashboard.welcome': 'తిరిగి స్వాగతం',
    'dashboard.goodMorning': 'శుభోదయం',
    'dashboard.goodAfternoon': 'శుభ మధ్యాహ్నం',
    'dashboard.goodEvening': 'శుభ సాయంత్రం',
    'dashboard.todayWeather': 'నేటి వాతావరణం',
    'dashboard.quickActions': 'త్వరిత చర్యలు',
    'dashboard.askAI': 'AI సహాయకుడిని అడగండి',
    'dashboard.analyzeImage': 'చిత్రం విశ్లేషించండి',
    'dashboard.checkWeather': 'వాతావరణం చూడండి',
    'dashboard.browseSchemes': 'పథకాలు చూడండి',
    'dashboard.recentActivity': 'ఇటీవలి కార్యకలాపాలు',
    
    // Weather
    'weather.title': 'వాతావరణ అంచనా',
    'weather.current': 'ప్రస్తుత వాతావరణం',
    'weather.forecast': '7-రోజుల అంచనా',
    'weather.temperature': 'ఉష్ణోగ్రత',
    'weather.humidity': 'తేమ',
    'weather.windSpeed': 'గాలి వేగం',
    'weather.pressure': 'వత్తిడి',
    'weather.alerts': 'వాతావరణ హెచ్చరికలు',
    
    // AI Assistant
    'assistant.title': 'AI సహాయకుడు',
    'assistant.askQuestion': 'వ్యవసాయం గురించి ఏదైనా అడగండి...',
    'assistant.voiceInput': 'వాయిస్ ఇన్‌పుట్',
    'assistant.typeMessage': 'మీ సందేశం టైప్ చేయండి...',
    'assistant.send': 'పంపండి',
    'assistant.listening': 'వింటోంది...',
    'assistant.processing': 'ప్రాసెస్ చేస్తోంది...',
    
    // Image Analysis
    'analysis.title': 'చిత్ర విశ్లేషణ',
    'analysis.uploadImage': 'చిత్రం అప్‌లోడ్ చేయండి',
    'analysis.dropImage': 'చిత్రాన్ని ఇక్కడ వదలండి లేదా అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి',
    'analysis.analyzing': 'చిత్రం విశ్లేషిస్తోంది...',
    'analysis.results': 'విశ్లేషణ ఫలితాలు',
    'analysis.cropDisease': 'పంట వ్యాధి గుర్తింపు',
    'analysis.soilAnalysis': 'మట్టి విశ్లేషణ',
    'analysis.plantHealth': 'మొక్క ఆరోగ్య మూల్యాంకనం',
    
    // Schemes
    'schemes.title': 'ప్రభుత్వ పథకాలు',
    'schemes.eligible': 'అర్హత ఉన్న పథకాలు',
    'schemes.all': 'అన్ని పథకాలు',
    'schemes.apply': 'ఇప్పుడే దరఖాస్తు చేసుకోండి',
    'schemes.learnMore': 'మరింత తెలుసుకోండి',
    'schemes.benefits': 'ప్రయోజనాలు',
    'schemes.eligibility': 'అర్హత',
    
    // Forum
    'forum.title': 'కమ్యూనిటీ ఫోరమ్',
    'forum.askQuestion': 'ప్రశ్న అడగండి',
    'forum.recent': 'ఇటీవలి చర్చలు',
    'forum.popular': 'ప్రాచుర్య విషయాలు',
    'forum.myPosts': 'నా పోస్ట్‌లు',
    'forum.reply': 'జవాబు',
    'forum.like': 'ఇష్టం',
    'forum.share': 'షేర్',
    
    // Profile
    'profile.title': 'ప్రొఫైల్',
    'profile.personal': 'వ్యక్తిగత సమాచారం',
    'profile.preferences': 'ప్రాధాన్యతలు',
    'profile.notifications': 'నోటిఫికేషన్‌లు',
    'profile.language': 'భాష',
    'profile.userType': 'వినియోగదారు రకం',
    'profile.location': 'స్థానం'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (user?.language) {
      setLanguageState(user.language as Language);
    } else {
      setLanguageState('en'); // Default to English
    }
  }, [user]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}