import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Camera, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Download,
  Upload,
  Leaf,
  Droplets,
  Sun,
  Bug,
  Scissors,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface JournalEntry {
  id: string;
  date: string;
  plantName: string;
  activity: string;
  notes: string;
  photos: string[];
  weather: string;
  mood: 'excellent' | 'good' | 'fair' | 'poor';
  tags: string[];
}

export default function GardenJournal() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    date: new Date().toISOString().split('T')[0],
    plantName: '',
    activity: '',
    notes: '',
    photos: [],
    weather: 'sunny',
    mood: 'good',
    tags: []
  });

  useEffect(() => {
    loadJournalEntries();
  }, [user]);

  const loadJournalEntries = () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`garden-journal-${user.id}`);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    } else {
      // Sample entries for demonstration
      const sampleEntries: JournalEntry[] = [
        {
          id: '1',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          plantName: language === 'te' ? 'టమాటో' : 'Tomato',
          activity: language === 'te' ? 'నీరు పెట్టడం' : 'Watering',
          notes: language === 'te' 
            ? 'ఉదయం 7 గంటలకు నీరు పెట్టాను. మొక్కలు బాగా పెరుగుతున్నాయి.'
            : 'Watered at 7 AM. Plants are growing well.',
          photos: [],
          weather: 'sunny',
          mood: 'good',
          tags: [language === 'te' ? 'నీరు' : 'watering', language === 'te' ? 'ఉదయం' : 'morning']
        },
        {
          id: '2',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          plantName: language === 'te' ? 'గులాబీ' : 'Rose',
          activity: language === 'te' ? 'కత్తిరించడం' : 'Pruning',
          notes: language === 'te'
            ? 'చనిపోయిన ఆకులను తొలగించాను. కొత్త మొగ్గలు వస్తున్నాయి.'
            : 'Removed dead leaves. New buds are forming.',
          photos: [],
          weather: 'cloudy',
          mood: 'excellent',
          tags: [language === 'te' ? 'కత్తిరించడం' : 'pruning', language === 'te' ? 'మొగ్గలు' : 'buds']
        }
      ];
      setEntries(sampleEntries);
      saveJournalEntries(sampleEntries);
    }
  };

  const saveJournalEntries = (entriesToSave: JournalEntry[]) => {
    if (!user) return;
    localStorage.setItem(`garden-journal-${user.id}`, JSON.stringify(entriesToSave));
  };

  const addEntry = () => {
    if (!newEntry.plantName || !newEntry.activity) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: newEntry.date || new Date().toISOString().split('T')[0],
      plantName: newEntry.plantName,
      activity: newEntry.activity,
      notes: newEntry.notes || '',
      photos: newEntry.photos || [],
      weather: newEntry.weather || 'sunny',
      mood: newEntry.mood || 'good',
      tags: newEntry.tags || []
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    saveJournalEntries(updatedEntries);
    
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      plantName: '',
      activity: '',
      notes: '',
      photos: [],
      weather: 'sunny',
      mood: 'good',
      tags: []
    });
    setShowAddEntry(false);
  };

  const deleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);
    saveJournalEntries(updatedEntries);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         entry.activity.toLowerCase().includes(selectedFilter.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(selectedFilter.toLowerCase()));
    
    return matchesSearch && matchesFilter;
  });

  const activities = [
    { key: 'all', label: language === 'te' ? 'అన్ని కార్యకలాపాలు' : 'All Activities' },
    { key: 'watering', label: language === 'te' ? 'నీరు పెట్టడం' : 'Watering' },
    { key: 'fertilizing', label: language === 'te' ? 'ఎరువు వేయడం' : 'Fertilizing' },
    { key: 'pruning', label: language === 'te' ? 'కత్తిరించడం' : 'Pruning' },
    { key: 'planting', label: language === 'te' ? 'నాటడం' : 'Planting' },
    { key: 'pest-control', label: language === 'te' ? 'కీటక నియంత్రణ' : 'Pest Control' }
  ];

  const weatherOptions = [
    { key: 'sunny', label: language === 'te' ? 'ఎండ' : 'Sunny', icon: '☀️' },
    { key: 'cloudy', label: language === 'te' ? 'మేఘావృతం' : 'Cloudy', icon: '☁️' },
    { key: 'rainy', label: language === 'te' ? 'వర్షం' : 'Rainy', icon: '🌧️' },
    { key: 'windy', label: language === 'te' ? 'గాలులు' : 'Windy', icon: '💨' }
  ];

  const moodOptions = [
    { key: 'excellent', label: language === 'te' ? 'అద్భుతం' : 'Excellent', icon: '😍', color: 'text-green-600' },
    { key: 'good', label: language === 'te' ? 'మంచిది' : 'Good', icon: '😊', color: 'text-blue-600' },
    { key: 'fair', label: language === 'te' ? 'సాధారణం' : 'Fair', icon: '😐', color: 'text-yellow-600' },
    { key: 'poor', label: language === 'te' ? 'చెడ్డది' : 'Poor', icon: '😞', color: 'text-red-600' }
  ];

  const getActivityIcon = (activity: string) => {
    if (activity.toLowerCase().includes('water')) return Droplets;
    if (activity.toLowerCase().includes('prune') || activity.toLowerCase().includes('cut')) return Scissors;
    if (activity.toLowerCase().includes('plant')) return Leaf;
    if (activity.toLowerCase().includes('pest') || activity.toLowerCase().includes('bug')) return Bug;
    return Sun;
  };

  const exportJournal = () => {
    const csvContent = [
      ['Date', 'Plant', 'Activity', 'Notes', 'Weather', 'Mood', 'Tags'],
      ...entries.map(entry => [
        entry.date,
        entry.plantName,
        entry.activity,
        entry.notes,
        entry.weather,
        entry.mood,
        entry.tags.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garden_journal_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-green-600" />
            {language === 'te' ? 'తోట డైరీ' : 'Garden Journal'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'te' 
              ? 'మీ తోట కార్యకలాపాలను రికార్డ్ చేయండి మరియు పురోగతిని ట్రాక్ చేయండి'
              : 'Record your garden activities and track progress'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={exportJournal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            {language === 'te' ? 'ఎక్స్‌పోర్ట్' : 'Export'}
          </button>
          <button
            onClick={() => setShowAddEntry(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === 'te' ? 'కొత్త ఎంట్రీ' : 'New Entry'}
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'te' ? 'ఎంట్రీలను వెతకండి...' : 'Search entries...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {activities.map(activity => (
                <option key={activity.key} value={activity.key}>{activity.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'te' ? 'ఎంట్రీలు లేవు' : 'No entries found'}
            </h3>
            <p className="text-gray-500">
              {language === 'te' 
                ? 'మీ మొదటి తోట ఎంట్రీని జోడించండి'
                : 'Add your first garden entry'
              }
            </p>
          </motion.div>
        ) : (
          filteredEntries.map((entry, index) => {
            const ActivityIcon = getActivityIcon(entry.activity);
            const weatherOption = weatherOptions.find(w => w.key === entry.weather);
            const moodOption = moodOptions.find(m => m.key === entry.mood);
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ActivityIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {entry.plantName} - {entry.activity}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                        <span className="flex items-center">
                          {weatherOption?.icon} {weatherOption?.label}
                        </span>
                        <span className={`flex items-center ${moodOption?.color}`}>
                          {moodOption?.icon} {moodOption?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {entry.notes && (
                  <p className="text-gray-700 mb-4">{entry.notes}</p>
                )}
                
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'te' ? 'కొత్త జర్నల్ ఎంట్రీ' : 'New Journal Entry'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'తేదీ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'మొక్క పేరు' : 'Plant Name'}
                  </label>
                  <input
                    type="text"
                    value={newEntry.plantName}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, plantName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={language === 'te' ? 'ఉదా: టమాటో' : 'e.g. Tomato'}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'te' ? 'కార్యకలాపం' : 'Activity'}
                </label>
                <input
                  type="text"
                  value={newEntry.activity}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, activity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={language === 'te' ? 'ఉదా: నీరు పెట్టడం' : 'e.g. Watering'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'te' ? 'గమనికలు' : 'Notes'}
                </label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={language === 'te' ? 'వివరాలు వ్రాయండి...' : 'Write details...'}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'వాతావరణం' : 'Weather'}
                  </label>
                  <select
                    value={newEntry.weather}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, weather: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {weatherOptions.map(option => (
                      <option key={option.key} value={option.key}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'మూడ్' : 'Mood'}
                  </label>
                  <select
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {moodOptions.map(option => (
                      <option key={option.key} value={option.key}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'te' ? 'ట్యాగ్‌లు' : 'Tags'}
                </label>
                <input
                  type="text"
                  value={newEntry.tags?.join(', ')}
                  onChange={(e) => setNewEntry(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={language === 'te' ? 'కామాతో వేరు చేయండి' : 'Comma separated'}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddEntry(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {language === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
              <button
                onClick={addEntry}
                disabled={!newEntry.plantName || !newEntry.activity}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {language === 'te' ? 'జోడించు' : 'Add Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}