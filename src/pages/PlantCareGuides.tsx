import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Calendar,
  Droplets,
  Sun,
  Scissors,
  Bug,
  Leaf,
  Clock,
  Star,
  ChevronRight,
  Download
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PlantGuide {
  id: string;
  name: {
    en: string;
    te: string;
  };
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  season: string[];
  image: string;
  description: {
    en: string;
    te: string;
  };
  careSteps: {
    en: Array<{
      title: string;
      description: string;
      timing: string;
      tips: string[];
    }>;
    te: Array<{
      title: string;
      description: string;
      timing: string;
      tips: string[];
    }>;
  };
  commonIssues: {
    en: Array<{
      problem: string;
      solution: string;
    }>;
    te: Array<{
      problem: string;
      solution: string;
    }>;
  };
}

export default function PlantCareGuides() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedGuide, setSelectedGuide] = useState<PlantGuide | null>(null);

  const plantGuides: PlantGuide[] = [
    {
      id: '1',
      name: {
        en: 'Tomato',
        te: 'టమాటో'
      },
      category: 'vegetables',
      difficulty: 'beginner',
      season: ['summer', 'monsoon'],
      image: '🍅',
      description: {
        en: 'Easy to grow vegetable perfect for beginners. Rich in vitamins and great for home cooking.',
        te: 'ప్రారంభకులకు పెంచడానికి సులభమైన కూరగాయ. విటమిన్లు అధికంగా ఉండి ఇంటి వంటకాలకు అనువైనది.'
      },
      careSteps: {
        en: [
          {
            title: 'Planting',
            description: 'Plant seeds in well-draining soil with good sunlight',
            timing: 'Early summer',
            tips: ['Use quality seeds', 'Ensure 6+ hours sunlight', 'Water regularly but avoid overwatering']
          },
          {
            title: 'Watering',
            description: 'Water deeply but infrequently to encourage deep root growth',
            timing: 'Daily in summer, every 2 days in monsoon',
            tips: ['Water at base of plant', 'Avoid wetting leaves', 'Check soil moisture before watering']
          },
          {
            title: 'Fertilizing',
            description: 'Apply balanced fertilizer every 2-3 weeks',
            timing: 'Every 2-3 weeks during growing season',
            tips: ['Use organic compost', 'Avoid over-fertilizing', 'Stop fertilizing 2 weeks before harvest']
          }
        ],
        te: [
          {
            title: 'నాటడం',
            description: 'మంచి వెలుతురు ఉన్న మంచి నీటి నిష్కాసన ఉన్న మట్టిలో విత్తనాలు నాటండి',
            timing: 'వేసవి ప్రారంభం',
            tips: ['మంచి విత్తనాలు వాడండి', '6+ గంటల వెలుతురు ఉండేలా చూడండి', 'క్రమం తప్పకుండా నీరు పెట్టండి కానీ అధికంగా పెట్టవద్దు']
          },
          {
            title: 'నీరు పెట్టడం',
            description: 'లోతుగా కానీ అప్పుడప్పుడు నీరు పెట్టి లోతైన వేర్లు పెరుగుట ప్రోత్సహించండి',
            timing: 'వేసవిలో రోజూ, వర్షాకాలంలో రెండు రోజులకు ఒకసారి',
            tips: ['మొక్క అడుగు భాగంలో నీరు పెట్టండి', 'ఆకులను తడిపించవద్దు', 'నీరు పెట్టే ముందు మట్టి తేమను తనిఖీ చేయండి']
          },
          {
            title: 'ఎరువు వేయడం',
            description: 'ప్రతి 2-3 వారాలకు సమతుల్య ఎరువు వేయండి',
            timing: 'పెరుగుట కాలంలో ప్రతి 2-3 వారాలకు',
            tips: ['సేంద్రీయ కంపోస్ట్ వాడండి', 'అధిక ఎరువు వేయవద్దు', 'కోత 2 వారాల ముందు ఎరువు వేయడం ఆపండి']
          }
        ]
      },
      commonIssues: {
        en: [
          {
            problem: 'Yellowing leaves',
            solution: 'Check for overwatering or nutrient deficiency. Adjust watering schedule and add fertilizer.'
          },
          {
            problem: 'Blossom end rot',
            solution: 'Ensure consistent watering and add calcium to soil.'
          }
        ],
        te: [
          {
            problem: 'ఆకులు పసుపు రంగులోకి మారడం',
            solution: 'అధిక నీరు లేదా పోషకాల లోపం ఉందా చూడండి. నీరు పెట్టే విధానం మార్చి ఎరువు వేయండి.'
          },
          {
            problem: 'పువ్వుల చివర కుళ్ళిపోవడం',
            solution: 'స్థిరమైన నీటిపారుదల ఉండేలా చూసి మట్టిలో కాల్షియం కలపండి.'
          }
        ]
      }
    },
    {
      id: '2',
      name: {
        en: 'Rose',
        te: 'గులాబీ'
      },
      category: 'flowers',
      difficulty: 'intermediate',
      season: ['winter', 'spring'],
      image: '🌹',
      description: {
        en: 'Beautiful flowering plant that requires moderate care. Perfect for adding color to your garden.',
        te: 'మధ్యమ సంరక్షణ అవసరమైన అందమైన పుష్ప మొక్క. మీ తోటకు రంగులు జోడించడానికి అనువైనది.'
      },
      careSteps: {
        en: [
          {
            title: 'Planting',
            description: 'Plant in well-draining soil with morning sunlight',
            timing: 'Winter season',
            tips: ['Choose disease-resistant varieties', 'Ensure good air circulation', 'Plant in raised beds if possible']
          },
          {
            title: 'Pruning',
            description: 'Regular pruning to maintain shape and encourage blooming',
            timing: 'Late winter/early spring',
            tips: ['Use clean, sharp tools', 'Remove dead and diseased wood', 'Cut at 45-degree angle above outward-facing bud']
          },
          {
            title: 'Pest Control',
            description: 'Monitor for aphids, thrips, and fungal diseases',
            timing: 'Throughout growing season',
            tips: ['Use neem oil for organic control', 'Encourage beneficial insects', 'Remove affected leaves immediately']
          }
        ],
        te: [
          {
            title: 'నాటడం',
            description: 'ఉదయం వెలుతురు ఉన్న మంచి నీటి నిష్కాసన ఉన్న మట్టిలో నాటండి',
            timing: 'చలికాలం',
            tips: ['వ్యాధి నిరోధక రకాలను ఎంచుకోండి', 'మంచి గాలి ప్రసరణ ఉండేలా చూడండి', 'వీలైతే ఎత్తైన పడకలలో నాటండి']
          },
          {
            title: 'కత్తిరించడం',
            description: 'ఆకారం నిర్వహించడానికి మరియు పుష్పించడాన్ని ప్రోత్సహించడానికి క్రమం తప్పకుండా కత్తిరించండి',
            timing: 'చలికాలం చివరి/వసంతం ప్రారంభం',
            tips: ['శుభ్రమైన, పదునైన పరికరాలు వాడండి', 'చనిపోయిన మరియు వ్యాధిగ్రస్త కలపను తొలగించండి', 'బయటికి చూసే మొగ్గ పైన 45 డిగ్రీల కోణంలో కత్తిరించండి']
          },
          {
            title: 'కీటక నియంత్రణ',
            description: 'అఫిడ్స్, త్రిప్స్ మరియు ఫంగల్ వ్యాధుల కోసం గమనించండి',
            timing: 'పెరుగుట కాలం అంతటా',
            tips: ['సేంద్రీయ నియంత్రణ కోసం వేప నూనె వాడండి', 'ప్రయోజనకరమైన కీటకాలను ప్రోత్సహించండి', 'ప్రభావిత ఆకులను వెంటనే తొలగించండి']
          }
        ]
      },
      commonIssues: {
        en: [
          {
            problem: 'Black spot disease',
            solution: 'Improve air circulation, avoid overhead watering, apply fungicide if needed.'
          },
          {
            problem: 'Aphid infestation',
            solution: 'Spray with water, use insecticidal soap, or introduce ladybugs.'
          }
        ],
        te: [
          {
            problem: 'నల్ల మచ్చ వ్యాధి',
            solution: 'గాలి ప్రసరణ మెరుగుపరచండి, పైనుండి నీరు పెట్టవద్దు, అవసరమైతే ఫంగిసైడ్ వాడండి.'
          },
          {
            problem: 'అఫిడ్ దాడి',
            solution: 'నీటితో స్ప్రే చేయండి, కీటకనాశక సబ్బు వాడండి, లేదా లేడీబగ్‌లను తీసుకురండి.'
          }
        ]
      }
    }
  ];

  const categories = [
    { key: 'all', label: language === 'te' ? 'అన్నీ' : 'All' },
    { key: 'vegetables', label: language === 'te' ? 'కూరగాయలు' : 'Vegetables' },
    { key: 'flowers', label: language === 'te' ? 'పువ్వులు' : 'Flowers' },
    { key: 'herbs', label: language === 'te' ? 'మూలికలు' : 'Herbs' },
    { key: 'fruits', label: language === 'te' ? 'పండ్లు' : 'Fruits' }
  ];

  const difficulties = [
    { key: 'all', label: language === 'te' ? 'అన్ని స్థాయిలు' : 'All Levels' },
    { key: 'beginner', label: language === 'te' ? 'ప్రారంభకుడు' : 'Beginner' },
    { key: 'intermediate', label: language === 'te' ? 'మధ్యస్థాయి' : 'Intermediate' },
    { key: 'advanced', label: language === 'te' ? 'అధునాతన' : 'Advanced' }
  ];

  const filteredGuides = plantGuides.filter(guide => {
    const matchesSearch = guide.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description[language].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadGuide = (guide: PlantGuide) => {
    const content = `
${guide.name[language]} - ${language === 'te' ? 'మొక్కల సంరక్షణ గైడ్' : 'Plant Care Guide'}
${'='.repeat(50)}

${language === 'te' ? 'వివరణ:' : 'Description:'}
${guide.description[language]}

${language === 'te' ? 'సంరక్షణ దశలు:' : 'Care Steps:'}
${guide.careSteps[language].map((step, index) => `
${index + 1}. ${step.title}
   ${step.description}
   ${language === 'te' ? 'సమయం:' : 'Timing:'} ${step.timing}
   ${language === 'te' ? 'చిట్కాలు:' : 'Tips:'}
   ${step.tips.map(tip => `   • ${tip}`).join('\n')}
`).join('\n')}

${language === 'te' ? 'సాధారణ సమస్యలు:' : 'Common Issues:'}
${guide.commonIssues[language].map((issue, index) => `
${index + 1}. ${language === 'te' ? 'సమస్య:' : 'Problem:'} ${issue.problem}
   ${language === 'te' ? 'పరిష్కారం:' : 'Solution:'} ${issue.solution}
`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${guide.name[language]}_care_guide.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <BookOpen className="h-8 w-8 mr-3 text-green-600" />
          {language === 'te' ? 'మొక్కల సంరక్షణ గైడ్‌లు' : 'Plant Care Guides'}
        </h1>
        <p className="text-gray-600">
          {language === 'te' 
            ? 'దశల వారీ మొక్కల సంరక్షణ సలహాలు మరియు కాలానుగుణ చిట్కాలు'
            : 'Step-by-step plant care tips and seasonal guidance'
          }
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'te' ? 'మొక్కలను వెతకండి...' : 'Search plants...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map(category => (
                <option key={category.key} value={category.key}>{category.label}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-gray-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.key} value={difficulty.key}>{difficulty.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Plant Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide, index) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedGuide(guide)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{guide.image}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                  {difficulties.find(d => d.key === guide.difficulty)?.label}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {guide.name[language]}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {guide.description[language]}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{guide.season.length} {language === 'te' ? 'కాలాలు' : 'seasons'}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{selectedGuide.image}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedGuide.name[language]}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {selectedGuide.description[language]}
                    </p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedGuide.difficulty)}`}>
                      {difficulties.find(d => d.key === selectedGuide.difficulty)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadGuide(selectedGuide)}
                    className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                    title={language === 'te' ? 'గైడ్ డౌన్‌లోడ్ చేయండి' : 'Download guide'}
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Care Steps */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  {language === 'te' ? 'సంరక్షణ దశలు' : 'Care Steps'}
                </h4>
                <div className="space-y-4">
                  {selectedGuide.careSteps[language].map((step, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        <h5 className="font-medium text-gray-900">{step.title}</h5>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {step.timing}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{step.description}</p>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {language === 'te' ? 'చిట్కాలు:' : 'Tips:'}
                        </p>
                        <ul className="space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Issues */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Bug className="h-5 w-5 mr-2 text-red-600" />
                  {language === 'te' ? 'సాధారణ సమస్యలు' : 'Common Issues'}
                </h4>
                <div className="space-y-3">
                  {selectedGuide.commonIssues[language].map((issue, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h5 className="font-medium text-red-800 mb-2">
                        {language === 'te' ? 'సమస్య:' : 'Problem:'} {issue.problem}
                      </h5>
                      <p className="text-red-700 text-sm">
                        <strong>{language === 'te' ? 'పరిష్కారం:' : 'Solution:'}</strong> {issue.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}