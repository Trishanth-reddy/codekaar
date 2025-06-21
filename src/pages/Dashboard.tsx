import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Camera, 
  Award, 
  Sun,
  TrendingUp,
  Zap,
  Target,
  Star,
  Leaf,
  Users,
  CreditCard,
  Calendar,
  Bell,
  BookOpen,
  Droplets,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { weatherData } = useData();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    let greetingKey = 'dashboard.welcome';
    
    if (hour < 12) {
      greetingKey = 'dashboard.goodMorning';
    } else if (hour < 17) {
      greetingKey = 'dashboard.goodAfternoon';
    } else {
      greetingKey = 'dashboard.goodEvening';
    }
    
    setGreeting(t(greetingKey) || t('dashboard.welcome'));
  }, [t]);

  // Quick actions based on user type
  const getQuickActions = () => {
    if (user?.userType === 'gardener') {
      return [
        {
          title: language === 'te' ? 'AI సహాయకుడు' : 'AI Assistant',
          description: language === 'te' ? 'తోటపని సలహా మరియు మార్గదర్శకత్వం పొందండి' : 'Get gardening advice and guidance',
          icon: MessageCircle,
          href: '/assistant',
          color: 'from-blue-500 to-blue-600',
          emoji: '🤖'
        },
        {
          title: language === 'te' ? 'మొక్కల సంరక్షణ గైడ్‌లు' : 'Plant Care Guides',
          description: language === 'te' ? 'దశల వారీ మొక్కల సంరక్షణ సలహాలు' : 'Step-by-step plant care tips',
          icon: BookOpen,
          href: '/plant-care',
          color: 'from-green-500 to-green-600',
          emoji: '📚'
        },
        {
          title: language === 'te' ? 'తోట డైరీ' : 'Garden Journal',
          description: language === 'te' ? 'మీ తోట కార్యకలాపాలను రికార్డ్ చేయండి' : 'Record your garden activities',
          icon: Calendar,
          href: '/garden-journal',
          color: 'from-purple-500 to-purple-600',
          emoji: '📝'
        },
        {
          title: language === 'te' ? 'నీటిపారుదల షెడ్యూల్‌లు' : 'Watering Schedules',
          description: language === 'te' ? 'నీరు మరియు ఎరువుల రిమైండర్‌లు' : 'Water and fertilizer reminders',
          icon: Droplets,
          href: '/watering-schedules',
          color: 'from-cyan-500 to-cyan-600',
          emoji: '💧'
        },
        {
          title: language === 'te' ? 'ఫైనాన్స్' : 'Finance',
          description: language === 'te' ? 'తోటపని ఖర్చులు మరియు బడ్జెట్' : 'Gardening expenses and budget',
          icon: CreditCard,
          href: '/finance',
          color: 'from-indigo-500 to-indigo-600',
          emoji: '💳'
        },
        {
          title: language === 'te' ? 'ఫోరమ్' : 'Forum',
          description: language === 'te' ? 'తోటమాలుల కమ్యూనిటీతో కనెక్ట్ అవ్వండి' : 'Connect with gardening community',
          icon: Users,
          href: '/forum',
          color: 'from-pink-500 to-pink-600',
          emoji: '👥'
        }
      ];
    } else {
      // Farmer quick actions
      return [
        {
          title: t('dashboard.askAI'),
          description: language === 'te' ? 'AI సహాయకుడి నుండి వ్యవసాయ సలహా పొందండి' : 'Get farming advice from AI assistant',
          icon: MessageCircle,
          href: '/assistant',
          color: 'from-blue-500 to-blue-600',
          emoji: '🤖'
        },
        {
          title: t('dashboard.analyzeImage'),
          description: language === 'te' ? 'పంట లేదా మట్టి చిత్రాలను విశ్లేషణ కోసం అప్‌లోడ్ చేయండి' : 'Upload crop or soil images for analysis',
          icon: Camera,
          href: '/analysis',
          color: 'from-purple-500 to-purple-600',
          emoji: '📸'
        },
        {
          title: language === 'te' ? 'మార్కెట్లు' : 'Markets',
          description: language === 'te' ? 'ప్రత్యక్ష మార్కెట్ ధరలను తనిఖీ చేయండి' : 'Check live market prices',
          icon: TrendingUp,
          href: '/markets',
          color: 'from-green-500 to-green-600',
          emoji: '📈'
        },
        {
          title: language === 'te' ? 'ఉత్పత్తుల మార్కెట్' : 'Produce Market',
          description: language === 'te' ? 'మీ ఉత్పత్తులను నేరుగా అమ్మండి' : 'Sell your produce directly',
          icon: ShoppingCart,
          href: '/produce-marketplace',
          color: 'from-orange-500 to-orange-600',
          emoji: '🛒'
        },
        {
          title: t('dashboard.browseSchemes'),
          description: language === 'te' ? 'అర్హత ఉన్న ప్రభుత్వ పథకాలను కనుగొనండి' : 'Find eligible government schemes',
          icon: Award,
          href: '/schemes',
          color: 'from-yellow-500 to-yellow-600',
          emoji: '🏆'
        },
        {
          title: language === 'te' ? 'ఫైనాన్స్' : 'Finance',
          description: language === 'te' ? 'రుణాలు, బీమా మరియు BNPL ఎంపికలు' : 'Loans, insurance, and BNPL options',
          icon: CreditCard,
          href: '/finance',
          color: 'from-indigo-500 to-indigo-600',
          emoji: '💳'
        },
        {
          title: language === 'te' ? 'ఫోరమ్' : 'Forum',
          description: language === 'te' ? 'వ్యవసాయ సమాజంతో కనెక్ట్ అవ్వండి' : 'Connect with farming community',
          icon: Users,
          href: '/forum',
          color: 'from-pink-500 to-pink-600',
          emoji: '👥'
        }
      ];
    }
  };

  const quickActions = getQuickActions();

  const getTimeBasedGradient = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) {
      return 'from-orange-400 via-yellow-400 to-yellow-500'; // Morning
    } else if (hour >= 12 && hour < 18) {
      return 'from-green-400 via-emerald-400 to-green-500'; // Afternoon
    } else {
      return 'from-purple-600 via-blue-600 to-indigo-700'; // Evening/Night
    }
  };

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 18) {
      return Sun;
    } else {
      return Star;
    }
  };

  const getAppTitle = () => {
    if (user?.userType === 'gardener') {
      return language === 'te' ? 'రైతు సాథి - తోటపని' : 'Rythu Saathi - Gardening';
    }
    return language === 'te' ? 'రైతు సాథి' : 'Rythu Saathi';
  };

  const getAppSubtitle = () => {
    if (user?.userType === 'gardener') {
      return language === 'te' 
        ? 'మీ స్మార్ట్ తోటపని సహాయకుడు - ఆధునిక తోటపనికి మార్గదర్శకం'
        : 'Your Smart Gardening Assistant - Guiding Modern Gardening';
    }
    return language === 'te' 
      ? 'మీ స్మార్ట్ వ్యవసాయ సహాయకుడు - ఆధునిక వ్యవసాయానికి మార్గదర్శకం'
      : 'Your Smart Farming Assistant - Guiding Modern Agriculture';
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${getTimeBasedGradient()} rounded-2xl p-6 md:p-8 text-white relative overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
            >
              <Leaf className="h-8 w-8" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {getAppTitle()}
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                {getAppSubtitle()}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm md:text-base mb-6">
            <div className="flex items-center space-x-2">
              {React.createElement(getTimeIcon(), { className: "h-5 w-5" })}
              <span className={language === 'te' ? 'telugu-text' : ''}>{greeting}, {user?.name}!</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              <span className="text-sm">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>

          <Link
            to="/assistant"
            className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg border border-white/30"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            <span className={language === 'te' ? 'telugu-text' : ''}>
              {language === 'te' ? 'AI సహాయకుడిని అడగండి' : 'Ask AI Assistant'}
            </span>
            <span className="ml-2">→</span>
          </Link>
        </div>
      </motion.div>

      {/* Weather and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Sun className="h-5 w-5 mr-2 text-yellow-500" />
            <span className={language === 'te' ? 'telugu-text' : ''}>{t('dashboard.todayWeather')}</span>
          </h3>
          
          {weatherData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {weatherData.current.temperature}°C
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {weatherData.current.description}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Sun className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <Link
                to="/weather"
                className="block w-full text-center py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                {language === 'te' ? 'పూర్తి అంచనా చూడండి' : 'View Full Forecast'}
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Sun className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-4">
                {language === 'te' ? 'వాతావరణ డేటా అందుబాటులో లేదు' : 'Weather data not available'}
              </p>
              <Link
                to="/weather"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Sun className="h-4 w-4 mr-2" />
                <span>{language === 'te' ? 'వాతావరణం తనిఖీ చేయండి' : 'Check Weather'}</span>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            <span className={language === 'te' ? 'telugu-text' : ''}>{t('dashboard.quickActions')}</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    to={action.href}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 block group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-gray-900 mb-1 text-sm ${language === 'te' ? 'telugu-text' : ''}`}>
                          {action.title}
                        </h4>
                        <p className={`text-xs text-gray-600 leading-relaxed ${language === 'te' ? 'telugu-text' : ''}`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right text-lg opacity-20 mt-2">
                      {action.emoji}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'te' ? 'ఈరోజు హెచ్చరికలు' : 'Today\'s Alerts'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Sun className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {language === 'te' ? 'వాతావరణ హెచ్చరిక' : 'Weather Alert'}
              </p>
              <p className={`text-sm text-gray-600 ${language === 'te' ? 'telugu-text' : ''}`}>
                {user?.userType === 'gardener'
                  ? (language === 'te' 
                      ? 'రేపు వర్షం అవకాశం. మొక్కలను రక్షించండి.'
                      : 'Rain expected tomorrow. Protect your plants.')
                  : (language === 'te' 
                      ? 'రేపు వర్షం అవకాశం. పంటలను రక్షించండి.'
                      : 'Rain expected tomorrow. Protect your crops.')
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user?.userType === 'gardener'
                  ? (language === 'te' ? 'తోట చిట్కా' : 'Garden Tip')
                  : (language === 'te' ? 'మార్కెట్ అప్‌డేట్' : 'Market Update')
                }
              </p>
              <p className={`text-sm text-gray-600 ${language === 'te' ? 'telugu-text' : ''}`}>
                {user?.userType === 'gardener'
                  ? (language === 'te' 
                      ? 'ఈ వారం మొక్కలకు ఎరువు వేయాల్సిన సమయం'
                      : 'Time to fertilize your plants this week')
                  : (language === 'te' 
                      ? 'పత్తి ధరలు 5% పెరిగాయి'
                      : 'Cotton prices increased by 5%')
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}