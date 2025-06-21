import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle, 
  Info, 
  Users,
  IndianRupee,
  Calendar,
  FileText,
  MapPin,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

interface Scheme {
  id: string;
  title: {
    en: string;
    te: string;
  };
  description: {
    en: string;
    te: string;
  };
  benefits: {
    en: string[];
    te: string[];
  };
  eligibility: {
    en: string[];
    te: string[];
  };
  applicationProcess: {
    en: string[];
    te: string[];
  };
  category: string;
  amount?: string;
  deadline?: string;
  department: {
    en: string;
    te: string;
  };
  isEligible?: boolean;
  applicationUrl?: string;
}

export default function Schemes() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { schemes, setSchemes } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchemes();
  }, [user, language]);

  const loadSchemes = async () => {
    setLoading(true);
    
    // Mock schemes data with AI-powered eligibility analysis
    const mockSchemes: Scheme[] = [
      {
        id: '1',
        title: {
          en: 'Rythu Bandhu Scheme',
          te: 'రైతు బంధు పథకం'
        },
        description: {
          en: 'Investment support for farmers at Rs. 10,000 per acre per season for both Kharif and Rabi seasons',
          te: 'ఖరీఫ్ మరియు రబీ రెండు సీజన్లకు ఎకరకు రూ. 10,000 పెట్టుబడి మద్దతు'
        },
        benefits: {
          en: [
            '₹10,000 per acre investment support',
            'Direct benefit transfer to bank account',
            'Seasonal assistance for both crops',
            'No middleman involvement'
          ],
          te: [
            'ఎకరకు ₹10,000 పెట్టుబడి మద్దతు',
            'బ్యాంక్ ఖాతాకు ప్రత్యక్ష లాభ బదిలీ',
            'రెండు పంటలకు కాలానుగుణ సహాయం',
            'మధ్యవర్తుల ప్రమేయం లేదు'
          ]
        },
        eligibility: {
          en: [
            'Must be a farmer with agricultural land',
            'Land should be in Telangana state',
            'Valid land documents required',
            'Bank account linked with Aadhaar'
          ],
          te: [
            'వ్యవసాయ భూమి ఉన్న రైతు అయి ఉండాలి',
            'భూమి తెలంగాణ రాష్ట్రంలో ఉండాలి',
            'చెల్లుబాటు అయ్యే భూమి పత్రాలు అవసరం',
            'ఆధార్‌తో లింక్ చేసిన బ్యాంక్ ఖాతా'
          ]
        },
        applicationProcess: {
          en: [
            'Visit nearest VRO office',
            'Submit land documents and Aadhaar',
            'Provide bank account details',
            'Get land verification done',
            'Receive confirmation SMS'
          ],
          te: [
            'సమీప VRO కార్యాలయానికి వెళ్లండి',
            'భూమి పత్రాలు మరియు ఆధార్ సమర్పించండి',
            'బ్యాంక్ ఖాతా వివరాలు ఇవ్వండి',
            'భూమి వెరిఫికేషన్ చేయించుకోండి',
            'నిర్ధారణ SMS అందుకోండి'
          ]
        },
        category: 'investment',
        amount: '₹10,000 per acre',
        department: {
          en: 'Agriculture Department, Telangana',
          te: 'వ్యవసాయ శాఖ, తెలంగాణ'
        },
        isEligible: user?.userType === 'farmer',
        applicationUrl: 'https://webland.telangana.gov.in/'
      },
      {
        id: '2',
        title: {
          en: 'PM Kisan Samman Nidhi',
          te: 'పిఎం కిసాన్ సమ్మాన్ నిధి'
        },
        description: {
          en: 'Income support of Rs. 6,000 per year to small and marginal farmers across India',
          te: 'భారతదేశంలోని చిన్న మరియు అంచు రైతులకు సంవత్సరానికి రూ. 6,000 ఆదాయ మద్దతు'
        },
        benefits: {
          en: [
            '₹6,000 annual income support',
            'Three equal installments of ₹2,000',
            'Direct bank transfer',
            'Pan-India coverage'
          ],
          te: [
            'వార్షిక ₹6,000 ఆదాయ మద్దతు',
            '₹2,000 చొప్పున మూడు సమాన వాయిదాలు',
            'ప్రత్యక్ష బ్యాంక్ బదిలీ',
            'దేశవ్యాప్త కవరేజ్'
          ]
        },
        eligibility: {
          en: [
            'Small and marginal farmers',
            'Land holding up to 2 hectares',
            'Valid Aadhaar card',
            'Bank account with IFSC'
          ],
          te: [
            'చిన్న మరియు అంచు రైతులు',
            '2 హెక్టార్ల వరకు భూమి',
            'చెల్లుబాటు అయ్యే ఆధార్ కార్డ్',
            'IFSC తో బ్యాంక్ ఖాతా'
          ]
        },
        applicationProcess: {
          en: [
            'Online registration at pmkisan.gov.in',
            'Submit required documents',
            'Aadhaar verification',
            'Bank account verification',
            'Wait for approval'
          ],
          te: [
            'pmkisan.gov.in లో ఆన్‌లైన్ రిజిస్ట్రేషన్',
            'అవసరమైన పత్రాలు సమర్పించండి',
            'ఆధార్ వెరిఫికేషన్',
            'బ్యాంక్ ఖాతా వెరిఫికేషన్',
            'ఆమోదం కోసం వేచి ఉండండి'
          ]
        },
        category: 'income-support',
        amount: '₹6,000 per year',
        department: {
          en: 'Ministry of Agriculture, Government of India',
          te: 'వ్యవసాయ మంత్రిత్వ శాఖ, భారత ప్రభుత్వం'
        },
        isEligible: user?.userType === 'farmer',
        applicationUrl: 'https://pmkisan.gov.in/'
      },
      {
        id: '3',
        title: {
          en: 'Rythu Bima Scheme',
          te: 'రైతు బీమా పథకం'
        },
        description: {
          en: 'Life insurance coverage for farmers with premium paid by state government',
          te: 'రాష్ట్ర ప్రభుత్వం ప్రీమియం చెల్లించే రైతుల జీవిత బీమా కవరేజ్'
        },
        benefits: {
          en: [
            '₹5 lakh life insurance coverage',
            'Zero premium for farmers',
            'Family gets compensation',
            'Accidental death coverage'
          ],
          te: [
            '₹5 లక్షల జీవిత బీమా కవరేజ్',
            'రైతులకు జీరో ప్రీమియం',
            'కుటుంబానికి పరిహారం',
            'ప్రమాద మరణ కవరేజ్'
          ]
        },
        eligibility: {
          en: [
            'Farmers aged 18-59 years',
            'Resident of Telangana',
            'Should have agricultural land',
            'Valid health certificate'
          ],
          te: [
            '18-59 సంవత్సరాల వయస్సు గల రైతులు',
            'తెలంగాణ నివాసి',
            'వ్యవసాయ భూమి ఉండాలి',
            'చెల్లుబాటు అయ్యే ఆరోగ్య ప్రమాణపత్రం'
          ]
        },
        applicationProcess: {
          en: [
            'Visit insurance company office',
            'Fill application form',
            'Submit required documents',
            'Medical examination if required',
            'Policy issuance'
          ],
          te: [
            'బీమా కంపెనీ కార్యాలయానికి వెళ్లండి',
            'దరఖాస్తు ఫారం పూరించండి',
            'అవసరమైన పత్రాలు సమర్పించండి',
            'అవసరమైతే వైద్య పరీక్ష',
            'పాలసీ జారీ'
          ]
        },
        category: 'insurance',
        amount: '₹5 lakh coverage',
        department: {
          en: 'Agriculture Department, Telangana',
          te: 'వ్యవసాయ శాఖ, తెలంగాణ'
        },
        isEligible: user?.userType === 'farmer' && user?.location.state === 'Telangana'
      },
      {
        id: '4',
        title: {
          en: 'Horticulture Development Scheme',
          te: 'ఉద్యానవన అభివృద్ధి పథకం'
        },
        description: {
          en: 'Financial assistance for setting up fruit and vegetable gardens, nurseries',
          te: 'పండ్లు మరియు కూరగాయల తోటలు, నర్సరీలు ఏర్పాటు చేయడానికి ఆర్థిక సహాయం'
        },
        benefits: {
          en: [
            'Up to 50% subsidy on plants',
            'Drip irrigation support',
            'Technical guidance',
            'Market linkage assistance'
          ],
          te: [
            'మొక్కలపై 50% వరకు సబ్సిడీ',
            'డ్రిప్ ఇరిగేషన్ మద్దతు',
            'సాంకేతిక మార్గదర్శకత్వం',
            'మార్కెట్ లింకేజ్ సహాయం'
          ]
        },
        eligibility: {
          en: [
            'Farmers and gardeners',
            'Minimum 0.25 acre land',
            'Water source availability',
            'Technical knowledge or willingness to learn'
          ],
          te: [
            'రైతులు మరియు తోటమాలులు',
            'కనీసం 0.25 ఎకరం భూమి',
            'నీటి వనరుల అందుబాటు',
            'సాంకేతిక జ్ఞానం లేదా నేర్చుకోవాలని అనిపించడం'
          ]
        },
        applicationProcess: {
          en: [
            'Contact Horticulture Department',
            'Submit land documents',
            'Get technical approval',
            'Purchase approved plants',
            'Claim subsidy after verification'
          ],
          te: [
            'ఉద్యానవన శాఖను సంప్రదించండి',
            'భూమి పత్రాలు సమర్పించండి',
            'సాంకేతిక ఆమోదం పొందండి',
            'ఆమోదించిన మొక్కలను కొనుగోలు చేయండి',
            'వెరిఫికేషన్ తర్వాత సబ్సిడీ క్లెయిమ్ చేయండి'
          ]
        },
        category: 'subsidy',
        amount: 'Up to 50% subsidy',
        department: {
          en: 'Horticulture Department, Telangana',
          te: 'ఉద్యానవన శాఖ, తెలంగాణ'
        },
        isEligible: true // Both farmers and gardeners eligible
      }
    ];

    setSchemes(mockSchemes);
    setLoading(false);
  };

  const categories = [
    { key: 'all', label: language === 'te' ? 'అన్నీ' : 'All' },
    { key: 'investment', label: language === 'te' ? 'పెట్టుబడి' : 'Investment' },
    { key: 'income-support', label: language === 'te' ? 'ఆదాయ మద్దతు' : 'Income Support' },
    { key: 'insurance', label: language === 'te' ? 'బీమా' : 'Insurance' },
    { key: 'subsidy', label: language === 'te' ? 'సబ్సిడీ' : 'Subsidy' }
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description[language].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesEligibility = !showEligibleOnly || scheme.isEligible;
    
    return matchesSearch && matchesCategory && matchesEligibility;
  });

  const eligibleCount = schemes.filter(scheme => scheme.isEligible).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('schemes.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'te' 
              ? 'మీకు అర్హత ఉన్న ప్రభుత్వ పథకాలను కనుగొనండి'
              : 'Discover government schemes you are eligible for'
            }
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{eligibleCount}</div>
          <div className="text-sm text-gray-600">
            {language === 'te' ? 'అర్హత ఉన్న పథకాలు' : 'Eligible Schemes'}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'te' ? 'పథకాలను వెతకండి...' : 'Search schemes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === key
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* Eligible Only Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEligibleOnly(!showEligibleOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showEligibleOnly ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showEligibleOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">
              {language === 'te' ? 'అర్హత మాత్రమే' : 'Eligible Only'}
            </span>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'te' ? 'పథకాలను లోడ్ చేస్తోంది...' : 'Loading schemes...'}
          </p>
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {language === 'te' ? 'పథకాలు కనుగొనబడలేదు' : 'No schemes found'}
          </h3>
          <p className="text-gray-500">
            {language === 'te' 
              ? 'వేరే వర్గం లేదా వెతుకులాట పదాలను ప్రయత్నించండి'
              : 'Try different category or search terms'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                scheme.isEligible ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {scheme.title[language]}
                      </h3>
                      {scheme.isEligible && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {language === 'te' ? 'అర్హత' : 'Eligible'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {scheme.description[language]}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <IndianRupee className="h-4 w-4 mr-2 text-green-600" />
                    <span className="font-medium">{scheme.amount}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{scheme.department[language]}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    {t('schemes.learnMore')}
                  </button>
                  
                  {scheme.applicationUrl && (
                    <a
                      href={scheme.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      {t('schemes.apply')}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedScheme.title[language]}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {selectedScheme.department[language]}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {language === 'te' ? 'వివరణ' : 'Description'}
                </h4>
                <p className="text-gray-700">
                  {selectedScheme.description[language]}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  {t('schemes.benefits')}
                </h4>
                <ul className="space-y-2">
                  {selectedScheme.benefits[language].map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  {t('schemes.eligibility')}
                </h4>
                <ul className="space-y-2">
                  {selectedScheme.eligibility[language].map((criteria, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-purple-500" />
                  {language === 'te' ? 'దరఖాస్తు ప్రక్రియ' : 'Application Process'}
                </h4>
                <ol className="space-y-2">
                  {selectedScheme.applicationProcess[language].map((step, index) => (
                    <li key={index} className="flex items-start space-x-3 text-gray-700">
                      <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('common.close')}
              </button>
              {selectedScheme.applicationUrl && (
                <a
                  href={selectedScheme.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  {t('schemes.apply')}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}