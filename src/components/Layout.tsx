import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Camera, 
  Award, 
  Users, 
  Menu, 
  X,
  Leaf,
  TrendingUp,
  CreditCard,
  Bell,
  Globe,
  User,
  Settings,
  LogOut,
  BookOpen,
  Calendar,
  Droplets,
  ShoppingCart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import NotificationCenter from './NotificationCenter';

export default function Layout() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Navigation items based on user type
  const getNavigationItems = () => {
    if (user?.userType === 'gardener') {
      return [
        { 
          name: language === 'te' ? 'AI సహాయకుడు' : 'AI Assistant', 
          href: '/assistant', 
          icon: MessageCircle,
          ariaLabel: language === 'te' ? 'AI సహాయకుడు - తోటపని సలహా' : 'AI Assistant - Gardening advice'
        },
        { 
          name: language === 'te' ? 'మొక్కల సంరక్షణ గైడ్‌లు' : 'Plant Care Guides', 
          href: '/plant-care', 
          icon: BookOpen,
          ariaLabel: language === 'te' ? 'మొక్కల సంరక్షణ గైడ్‌లు - దశల వారీ సలహాలు' : 'Plant Care Guides - Step-by-step care tips'
        },
        { 
          name: language === 'te' ? 'తోట డైరీ' : 'Garden Journal', 
          href: '/garden-journal', 
          icon: Calendar,
          ariaLabel: language === 'te' ? 'తోట డైరీ - మీ తోట రికార్డులు' : 'Garden Journal - Track your garden progress'
        },
        { 
          name: language === 'te' ? 'నీటిపారుదల షెడ్యూల్‌లు' : 'Watering Schedules', 
          href: '/watering-schedules', 
          icon: Droplets,
          ariaLabel: language === 'te' ? 'నీటిపారుదల షెడ్యూల్‌లు - నీరు మరియు ఎరువుల రిమైండర్‌లు' : 'Watering Schedules - Water and fertilizer reminders'
        },
        { 
          name: language === 'te' ? 'ఫైనాన్స్' : 'Finance', 
          href: '/finance', 
          icon: CreditCard,
          ariaLabel: language === 'te' ? 'ఫైనాన్స్ - ఆర్థిక సాధనాలు' : 'Finance - Financial tools'
        },
        { 
          name: language === 'te' ? 'ఫోరమ్' : 'Forum', 
          href: '/forum', 
          icon: Users,
          ariaLabel: language === 'te' ? 'ఫోరమ్ - కమ్యూనిటీ చర్చలు' : 'Forum - Community discussions'
        },
      ];
    } else {
      // Farmer navigation
      return [
        { 
          name: language === 'te' ? 'AI సహాయకుడు' : 'AI Assistant', 
          href: '/assistant', 
          icon: MessageCircle,
          ariaLabel: language === 'te' ? 'AI సహాయకుడు - వ్యవసాయ సలహా' : 'AI Assistant - Farming advice'
        },
        { 
          name: language === 'te' ? 'చిత్ర విశ్లేషణ' : 'Image Analysis', 
          href: '/analysis', 
          icon: Camera,
          ariaLabel: language === 'te' ? 'చిత్ర విశ్లేషణ - పంట మరియు మట్టి విశ్లేషణ' : 'Image Analysis - Crop and soil analysis'
        },
        { 
          name: language === 'te' ? 'మార్కెట్లు' : 'Markets', 
          href: '/markets', 
          icon: TrendingUp,
          ariaLabel: language === 'te' ? 'మార్కెట్లు - ధరల సమాచారం' : 'Markets - Price information'
        },
        { 
          name: language === 'te' ? 'ఉత్పత్తుల మార్కెట్' : 'Produce Market', 
          href: '/produce-marketplace', 
          icon: ShoppingCart,
          ariaLabel: language === 'te' ? 'ఉత్పత్తుల మార్కెట్ - ఉత్పత్తులను అమ్మండి మరియు కొనండి' : 'Produce Market - Buy and sell produce'
        },
        { 
          name: language === 'te' ? 'పథకాలు' : 'Schemes', 
          href: '/schemes', 
          icon: Award,
          ariaLabel: language === 'te' ? 'పథకాలు - ప్రభుత్వ పథకాలు' : 'Schemes - Government schemes'
        },
        { 
          name: language === 'te' ? 'ఫైనాన్స్' : 'Finance', 
          href: '/finance', 
          icon: CreditCard,
          ariaLabel: language === 'te' ? 'ఫైనాన్స్ - రుణాలు మరియు బీమా' : 'Finance - Loans and insurance'
        },
        { 
          name: language === 'te' ? 'ఫోరమ్' : 'Forum', 
          href: '/forum', 
          icon: Users,
          ariaLabel: language === 'te' ? 'ఫోరమ్ - రైతుల కమ్యూనిటీ' : 'Forum - Farmers community'
        },
      ];
    }
  };

  const navigation = getNavigationItems();

  const isActive = (href: string) => location.pathname === href;

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'te' : 'en';
    setLanguage(newLang);
  };

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
    
    // Set up periodic notification checks
    const interval = setInterval(loadNotifications, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  // Listen for forum notifications
  useEffect(() => {
    const handleForumNotification = (event: CustomEvent) => {
      const notificationData = event.detail;
      addNotification(notificationData);
    };

    window.addEventListener('forumNotification', handleForumNotification as EventListener);
    
    return () => {
      window.removeEventListener('forumNotification', handleForumNotification as EventListener);
    };
  }, []);

  const loadNotifications = () => {
    if (!user) return;

    // Generate sample notifications based on current conditions
    const sampleNotifications = [
      {
        id: '1',
        type: 'weather',
        title: language === 'te' ? 'వాతావరణ హెచ్చరిక' : 'Weather Alert',
        message: language === 'te' 
          ? 'రేపు భారీ వర్షాలు అవకాశం. పంటలను రక్షించండి.'
          : 'Heavy rainfall expected tomorrow. Protect your crops.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high',
        icon: '🌧️'
      },
      {
        id: '2',
        type: user?.userType === 'gardener' ? 'gardening' : 'scheme',
        title: user?.userType === 'gardener' 
          ? (language === 'te' ? 'మొక్కల సంరక్షణ చిట్కా' : 'Plant Care Tip')
          : (language === 'te' ? 'కొత్త పథకం' : 'New Scheme Available'),
        message: user?.userType === 'gardener'
          ? (language === 'te' 
              ? 'ఈ వారం మీ టమాటో మొక్కలకు ఎరువు వేయాల్సిన సమయం వచ్చింది.'
              : 'Time to fertilize your tomato plants this week.')
          : (language === 'te'
              ? 'మీకు అర్హత ఉన్న కొత్త ప్రభుత్వ పథకం అందుబాటులో ఉంది.'
              : 'A new government scheme you are eligible for is now available.'),
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'medium',
        icon: user?.userType === 'gardener' ? '🌱' : '🏆'
      },
      {
        id: '3',
        type: user?.userType === 'gardener' ? 'reminder' : 'market',
        title: user?.userType === 'gardener'
          ? (language === 'te' ? 'నీటిపారుదల రిమైండర్' : 'Watering Reminder')
          : (language === 'te' ? 'మార్కెట్ ధర అప్‌డేట్' : 'Market Price Update'),
        message: user?.userType === 'gardener'
          ? (language === 'te' 
              ? 'మీ గుల్మొహర్ మొక్కలకు నీరు వేయాల్సిన సమయం వచ్చింది.'
              : 'Time to water your flowering plants.')
          : (language === 'te'
              ? 'పత్తి ధరలు 5% పెరిగాయి. అమ్మడానికి మంచి సమయం.'
              : 'Cotton prices increased by 5%. Good time to sell.'),
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'medium',
        icon: user?.userType === 'gardener' ? '💧' : '📈'
      },
      {
        id: '4',
        type: 'forum',
        title: language === 'te' ? 'ఫోరమ్ రిప్లై' : 'Forum Reply',
        message: language === 'te'
          ? 'మీ ప్రశ్నకు కొత్త జవాబు వచ్చింది.'
          : 'You have a new reply to your question.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'low',
        icon: '💬'
      },
      {
        id: '5',
        type: 'ai',
        title: language === 'te' ? 'AI సలహా' : 'AI Recommendation',
        message: user?.userType === 'gardener'
          ? (language === 'te' 
              ? 'మీ తోట కోసం కొత్త సలహాలు అందుబాటులో ఉన్నాయి.'
              : 'New recommendations available for your garden.')
          : (language === 'te'
              ? 'మీ పంట కోసం కొత్త సలహాలు అందుబాటులో ఉన్నాయి.'
              : 'New recommendations available for your crops.'),
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'low',
        icon: '🤖'
      }
    ];

    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  };

  const addNotification = (notificationData: any) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Fixed to Left Edge */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3" aria-label={language === 'te' ? 'రైతు సాథి హోమ్‌పేజ్' : 'Rythu Saathi Homepage'}>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-gray-900">
                    {language === 'te' ? 'రైతు సాథి' : 'Rythu Saathi'}
                  </span>
                  <div className="text-xs text-gray-500">
                    {user?.userType === 'gardener' 
                      ? (language === 'te' ? 'మీ స్మార్ట్ తోటపని సహాయకుడు' : 'Your Smart Gardening Assistant')
                      : (language === 'te' ? 'మీ స్మార్ట్ వ్యవసాయ సహాయకుడు' : 'Your Smart Farming Assistant')
                    }
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-5xl mx-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-label={item.ariaLabel}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive(item.href)
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className={`${language === 'te' ? 'telugu-text' : ''} hidden xl:inline`}>
                      {item.name}
                    </span>
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  aria-label={language === 'te' ? 'నోటిఫికేషన్‌లు' : 'Notifications'}
                  className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {notificationOpen && (
                    <NotificationCenter
                      notifications={notifications}
                      onClose={() => setNotificationOpen(false)}
                      onMarkAsRead={markAsRead}
                      onMarkAllAsRead={markAllAsRead}
                      onDelete={deleteNotification}
                      language={language}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                aria-label={language === 'te' ? 'భాష మార్చండి' : 'Change language'}
                className="flex items-center px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'తె' : 'En'}
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  aria-label={language === 'te' ? 'ప్రొఫైల్ మెనూ' : 'Profile menu'}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
                    {user?.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3" />
                        {user?.name}
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        {language === 'te' ? 'సెట్టింగ్‌లు' : 'Settings'}
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        {t('auth.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={language === 'te' ? 'మెనూ టోగుల్' : 'Toggle menu'}
                className="lg:hidden p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label={item.ariaLabel}
                      className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        <span className={language === 'te' ? 'telugu-text' : ''}>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                aria-label={item.ariaLabel}
                className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors min-h-[44px] ${
                  isActive(item.href)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:text-green-600 active:bg-green-50'
                }`}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs font-medium truncate max-w-full">
                  {item.name.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
        <Outlet />
      </main>

      {/* Click outside to close menus */}
      {(profileMenuOpen || notificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setProfileMenuOpen(false);
            setNotificationOpen(false);
          }}
        />
      )}
    </div>
  );
}