import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Globe, User, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Onboarding() {
  const { user, updateUser } = useAuth();
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    language: 'en' as 'en' | 'te',
    userType: 'farmer' as 'farmer' | 'gardener',
    village: '',
    district: ''
  });

  const telanagnaDistricts = [
    'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
    'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
    'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar',
    'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool',
    'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli',
    'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet',
    'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = () => {
    if (!user) return;

    updateUser({
      language: formData.language,
      userType: formData.userType,
      location: {
        village: formData.village,
        district: formData.district,
        state: 'Telangana'
      },
      onboardingComplete: true
    });

    setLanguage(formData.language);
    navigate('/dashboard');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.language;
      case 2:
        return formData.userType;
      case 3:
        return formData.village && formData.district;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t('onboarding.welcome')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('app.subtitle')}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full ${
                s <= step ? 'bg-green-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Step 1: Language Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('onboarding.selectLanguage')}
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, language: 'en' }))}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    formData.language === 'en'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="font-medium">English</div>
                  <div className="text-sm text-gray-500">Continue in English</div>
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, language: 'te' }))}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    formData.language === 'te'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="font-medium">తెలుగు</div>
                  <div className="text-sm text-gray-500">తెలుగులో కొనసాగించండి</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: User Type Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('onboarding.selectUserType')}
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'farmer' }))}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    formData.userType === 'farmer'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="font-medium">{t('onboarding.farmer')}</div>
                  <div className="text-sm text-gray-500">
                    {formData.language === 'te' ? 'వ్యవసాయ కార్యకలాపాలలో పాల్గొంటాను' : 'I engage in farming activities'}
                  </div>
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'gardener' }))}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    formData.userType === 'gardener'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="font-medium">{t('onboarding.gardener')}</div>
                  <div className="text-sm text-gray-500">
                    {formData.language === 'te' ? 'తోటపని మరియు ఇంటి మొక్కలతో వ్యవహరిస్తాను' : 'I work with gardening and home plants'}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('onboarding.location')}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('onboarding.village')}
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={formData.language === 'te' ? 'మీ గ్రామం లేదా పట్టణం' : 'Your village or town'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('onboarding.district')}
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">{formData.language === 'te' ? 'జిల్లా ఎంచుకోండి' : 'Select District'}</option>
                    {telanagnaDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.back')}
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {step === 3 ? t('onboarding.complete') : t('common.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}