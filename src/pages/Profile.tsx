import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Bell, 
  Shield, 
  Edit3,
  Save,
  X,
  Camera,
  Settings,
  Key,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    village: user?.location.village || '',
    district: user?.location.district || '',
    userType: user?.userType || 'farmer'
  });
  const [notifications, setNotifications] = useState({
    weather: true,
    schemes: true,
    forum: true,
    ai: false
  });

  const handleSave = () => {
    if (!user) return;

    updateUser({
      name: editForm.name,
      phone: editForm.phone,
      location: {
        ...user.location,
        village: editForm.village,
        district: editForm.district
      },
      userType: editForm.userType as 'farmer' | 'gardener'
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      phone: user?.phone || '',
      village: user?.location.village || '',
      district: user?.location.district || '',
      userType: user?.userType || 'farmer'
    });
    setIsEditing(false);
  };

  const handleLanguageChange = (newLang: 'en' | 'te') => {
    setLanguage(newLang);
    if (user) {
      updateUser({ language: newLang });
    }
  };

  const telanagnaDistricts = [
    'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
    'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
    'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar',
    'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool',
    'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli',
    'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet',
    'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'
  ];

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'te' 
              ? 'మీ వ్యక్తిగత సమాచారం మరియు ప్రాధాన్యతలను నిర్వహించండి'
              : 'Manage your personal information and preferences'
            }
          </p>
        </div>
        
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {language === 'te' ? 'సవరించు' : 'Edit Profile'}
          </motion.button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h3>
              <p className="text-gray-600">
                {user.userType === 'farmer' ? t('onboarding.farmer') : t('onboarding.gardener')}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {user.location.village}, {user.location.district}
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {language === 'te' ? 'సభ్యుడైన తేదీ' : 'Member since'}
                </div>
                <div className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-600" />
                {t('profile.personal')}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.name')}
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.phone')}
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('onboarding.village')}
                      </label>
                      <input
                        type="text"
                        value={editForm.village}
                        onChange={(e) => setEditForm(prev => ({ ...prev, village: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('onboarding.district')}
                      </label>
                      <select
                        value={editForm.district}
                        onChange={(e) => setEditForm(prev => ({ ...prev, district: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {telanagnaDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.userType')}
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="farmer"
                          checked={editForm.userType === 'farmer'}
                          onChange={(e) => setEditForm(prev => ({ ...prev, userType: e.target.value as 'farmer' | 'gardener' }))}
                          className="mr-2"
                        />
                        {t('onboarding.farmer')}
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="gardener"
                          checked={editForm.userType === 'gardener'}
                          onChange={(e) => setEditForm(prev => ({ ...prev, userType: e.target.value as 'farmer' | 'gardener' }))}
                          className="mr-2"
                        />
                        {t('onboarding.gardener')}
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2 inline" />
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2 inline" />
                      {t('common.save')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {user.location.village}, {user.location.district}, {user.location.state}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-600" />
                {t('profile.preferences')}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Language Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Globe className="h-4 w-4 inline mr-2" />
                  {t('profile.language')}
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      language === 'en'
                        ? 'bg-green-100 border-green-300 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('te')}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      language === 'te'
                        ? 'bg-green-100 border-green-300 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    తెలుగు
                  </button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Bell className="h-4 w-4 inline mr-2" />
                  {t('profile.notifications')}
                </label>
                <div className="space-y-3">
                  {[
                    { key: 'weather', label: language === 'te' ? 'వాతావరణ హెచ్చరికలు' : 'Weather Alerts' },
                    { key: 'schemes', label: language === 'te' ? 'పథక నోటిఫికేషన్‌లు' : 'Scheme Notifications' },
                    { key: 'forum', label: language === 'te' ? 'ఫోరమ్ అప్‌డేట్‌లు' : 'Forum Updates' },
                    { key: 'ai', label: language === 'te' ? 'AI సలహాలు' : 'AI Recommendations' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-700">{label}</span>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications[key as keyof typeof notifications]
                            ? 'bg-green-600'
                            : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[key as keyof typeof notifications]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-gray-600" />
                {language === 'te' ? 'భద్రత' : 'Security'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {language === 'te' ? 'పాస్‌వర్డ్ మార్చు' : 'Change Password'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {language === 'te' 
                        ? 'మీ ఖాతా భద్రత కోసం పాస్‌వర్డ్ మార్చండి'
                        : 'Update your password to keep your account secure'
                      }
                    </div>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {language === 'te' ? 'డేటా ఎక్స్‌పోర్ట్' : 'Export Data'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {language === 'te' 
                        ? 'మీ అన్ని డేటాను డౌన్‌లోడ్ చేయండి'
                        : 'Download all your data'
                      }
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}