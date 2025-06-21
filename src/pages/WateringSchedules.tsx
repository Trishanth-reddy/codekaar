import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Plus, 
  Bell, 
  Calendar,
  Clock,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Leaf,
  Sun,
  CloudRain,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface WateringSchedule {
  id: string;
  plantName: string;
  plantType: string;
  frequency: number; // days
  lastWatered: string;
  nextWatering: string;
  amount: string;
  notes: string;
  isActive: boolean;
  reminderEnabled: boolean;
  fertilizeWithWater: boolean;
  fertilizerType?: string;
  fertilizerFrequency?: number; // weeks
  lastFertilized?: string;
  nextFertilizing?: string;
}

export default function WateringSchedules() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [schedules, setSchedules] = useState<WateringSchedule[]>([]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WateringSchedule | null>(null);
  const [newSchedule, setNewSchedule] = useState<Partial<WateringSchedule>>({
    plantName: '',
    plantType: 'vegetable',
    frequency: 2,
    amount: 'medium',
    notes: '',
    isActive: true,
    reminderEnabled: true,
    fertilizeWithWater: false,
    fertilizerFrequency: 2
  });

  useEffect(() => {
    loadSchedules();
    
    // Check for due waterings every minute
    const interval = setInterval(checkDueWaterings, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const loadSchedules = () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`watering-schedules-${user.id}`);
    if (saved) {
      try {
        setSchedules(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading schedules:', error);
      }
    } else {
      // Sample schedules for demonstration
      const sampleSchedules: WateringSchedule[] = [
        {
          id: '1',
          plantName: language === 'te' ? 'టమాటో మొక్కలు' : 'Tomato Plants',
          plantType: 'vegetable',
          frequency: 2,
          lastWatered: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          nextWatering: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          amount: 'medium',
          notes: language === 'te' ? 'ఉదయం 7 గంటలకు నీరు పెట్టండి' : 'Water at 7 AM',
          isActive: true,
          reminderEnabled: true,
          fertilizeWithWater: true,
          fertilizerType: language === 'te' ? 'సేంద్రీయ కంపోస్ట్' : 'Organic Compost',
          fertilizerFrequency: 2,
          lastFertilized: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
          nextFertilizing: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
        },
        {
          id: '2',
          plantName: language === 'te' ? 'గులాబీ పూలు' : 'Rose Flowers',
          plantType: 'flower',
          frequency: 3,
          lastWatered: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
          nextWatering: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          amount: 'low',
          notes: language === 'te' ? 'ఆకులపై నీరు పడకుండా చూడండి' : 'Avoid water on leaves',
          isActive: true,
          reminderEnabled: true,
          fertilizeWithWater: false
        }
      ];
      setSchedules(sampleSchedules);
      saveSchedules(sampleSchedules);
    }
  };

  const saveSchedules = (schedulesToSave: WateringSchedule[]) => {
    if (!user) return;
    localStorage.setItem(`watering-schedules-${user.id}`, JSON.stringify(schedulesToSave));
  };

  const checkDueWaterings = () => {
    const today = new Date().toISOString().split('T')[0];
    const dueSchedules = schedules.filter(schedule => 
      schedule.isActive && 
      schedule.reminderEnabled && 
      schedule.nextWatering <= today
    );

    if (dueSchedules.length > 0) {
      // Trigger notification
      const event = new CustomEvent('forumNotification', {
        detail: {
          type: 'reminder',
          title: language === 'te' ? 'నీటిపారుదల రిమైండర్' : 'Watering Reminder',
          message: language === 'te' 
            ? `${dueSchedules.length} మొక్కలకు నీరు పెట్టాల్సిన సమయం వచ్చింది`
            : `${dueSchedules.length} plants need watering today`,
          priority: 'medium',
          icon: '💧'
        }
      });
      window.dispatchEvent(event);
    }
  };

  const addSchedule = () => {
    if (!newSchedule.plantName || !newSchedule.frequency) return;

    const today = new Date();
    const nextWatering = new Date(today.getTime() + (newSchedule.frequency! * 24 * 60 * 60 * 1000));
    const nextFertilizing = newSchedule.fertilizeWithWater && newSchedule.fertilizerFrequency
      ? new Date(today.getTime() + (newSchedule.fertilizerFrequency * 7 * 24 * 60 * 60 * 1000))
      : undefined;

    const schedule: WateringSchedule = {
      id: Date.now().toString(),
      plantName: newSchedule.plantName,
      plantType: newSchedule.plantType || 'vegetable',
      frequency: newSchedule.frequency,
      lastWatered: today.toISOString().split('T')[0],
      nextWatering: nextWatering.toISOString().split('T')[0],
      amount: newSchedule.amount || 'medium',
      notes: newSchedule.notes || '',
      isActive: newSchedule.isActive !== false,
      reminderEnabled: newSchedule.reminderEnabled !== false,
      fertilizeWithWater: newSchedule.fertilizeWithWater || false,
      fertilizerType: newSchedule.fertilizerType,
      fertilizerFrequency: newSchedule.fertilizerFrequency,
      lastFertilized: newSchedule.fertilizeWithWater ? today.toISOString().split('T')[0] : undefined,
      nextFertilizing: nextFertilizing?.toISOString().split('T')[0]
    };

    const updatedSchedules = [schedule, ...schedules];
    setSchedules(updatedSchedules);
    saveSchedules(updatedSchedules);
    
    setNewSchedule({
      plantName: '',
      plantType: 'vegetable',
      frequency: 2,
      amount: 'medium',
      notes: '',
      isActive: true,
      reminderEnabled: true,
      fertilizeWithWater: false,
      fertilizerFrequency: 2
    });
    setShowAddSchedule(false);
  };

  const markAsWatered = (scheduleId: string) => {
    const today = new Date();
    const updatedSchedules = schedules.map(schedule => {
      if (schedule.id === scheduleId) {
        const nextWatering = new Date(today.getTime() + (schedule.frequency * 24 * 60 * 60 * 1000));
        return {
          ...schedule,
          lastWatered: today.toISOString().split('T')[0],
          nextWatering: nextWatering.toISOString().split('T')[0]
        };
      }
      return schedule;
    });
    
    setSchedules(updatedSchedules);
    saveSchedules(updatedSchedules);
  };

  const markAsFertilized = (scheduleId: string) => {
    const today = new Date();
    const updatedSchedules = schedules.map(schedule => {
      if (schedule.id === scheduleId && schedule.fertilizeWithWater) {
        const nextFertilizing = new Date(today.getTime() + ((schedule.fertilizerFrequency || 2) * 7 * 24 * 60 * 60 * 1000));
        return {
          ...schedule,
          lastFertilized: today.toISOString().split('T')[0],
          nextFertilizing: nextFertilizing.toISOString().split('T')[0]
        };
      }
      return schedule;
    });
    
    setSchedules(updatedSchedules);
    saveSchedules(updatedSchedules);
  };

  const deleteSchedule = (scheduleId: string) => {
    const updatedSchedules = schedules.filter(schedule => schedule.id !== scheduleId);
    setSchedules(updatedSchedules);
    saveSchedules(updatedSchedules);
  };

  const toggleSchedule = (scheduleId: string) => {
    const updatedSchedules = schedules.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, isActive: !schedule.isActive }
        : schedule
    );
    setSchedules(updatedSchedules);
    saveSchedules(updatedSchedules);
  };

  const getStatusColor = (schedule: WateringSchedule) => {
    const today = new Date().toISOString().split('T')[0];
    const nextWatering = schedule.nextWatering;
    
    if (nextWatering < today) return 'text-red-600 bg-red-50 border-red-200';
    if (nextWatering === today) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusText = (schedule: WateringSchedule) => {
    const today = new Date().toISOString().split('T')[0];
    const nextWatering = schedule.nextWatering;
    
    if (nextWatering < today) return language === 'te' ? 'ఆలస్యం' : 'Overdue';
    if (nextWatering === today) return language === 'te' ? 'ఈరోజు' : 'Due Today';
    
    const daysUntil = Math.ceil((new Date(nextWatering).getTime() - new Date(today).getTime()) / (24 * 60 * 60 * 1000));
    return language === 'te' ? `${daysUntil} రోజుల్లో` : `In ${daysUntil} days`;
  };

  const plantTypes = [
    { key: 'vegetable', label: language === 'te' ? 'కూరగాయలు' : 'Vegetables' },
    { key: 'flower', label: language === 'te' ? 'పువ్వులు' : 'Flowers' },
    { key: 'herb', label: language === 'te' ? 'మూలికలు' : 'Herbs' },
    { key: 'fruit', label: language === 'te' ? 'పండ్లు' : 'Fruits' },
    { key: 'indoor', label: language === 'te' ? 'ఇంటి మొక్కలు' : 'Indoor Plants' }
  ];

  const waterAmounts = [
    { key: 'low', label: language === 'te' ? 'తక్కువ' : 'Low' },
    { key: 'medium', label: language === 'te' ? 'మధ్యమ' : 'Medium' },
    { key: 'high', label: language === 'te' ? 'అధిక' : 'High' }
  ];

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
            <Droplets className="h-8 w-8 mr-3 text-blue-600" />
            {language === 'te' ? 'నీటిపారుదల షెడ్యూల్‌లు' : 'Watering Schedules'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'te' 
              ? 'మీ మొక్కలకు నీరు మరియు ఎరువుల రిమైండర్‌లను సెట్ చేయండి'
              : 'Set water and fertilizer reminders for your plants'
            }
          </p>
        </div>
        
        <button
          onClick={() => setShowAddSchedule(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === 'te' ? 'కొత్త షెడ్యూల్' : 'New Schedule'}
        </button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'te' ? 'ఈరోజు నీరు పెట్టాల్సినవి' : 'Due Today'}
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {schedules.filter(s => s.isActive && s.nextWatering === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'te' ? 'ఆలస్యమైనవి' : 'Overdue'}
              </p>
              <p className="text-2xl font-bold text-red-600">
                {schedules.filter(s => s.isActive && s.nextWatering < new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'te' ? 'మొత్తం మొక్కలు' : 'Total Plants'}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {schedules.filter(s => s.isActive).length}
              </p>
            </div>
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {schedules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <Droplets className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'te' ? 'షెడ్యూల్‌లు లేవు' : 'No schedules found'}
            </h3>
            <p className="text-gray-500">
              {language === 'te' 
                ? 'మీ మొదటి నీటిపారుదల షెడ్యూల్‌ను జోడించండి'
                : 'Add your first watering schedule'
              }
            </p>
          </motion.div>
        ) : (
          schedules.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                schedule.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Droplets className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {schedule.plantName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{plantTypes.find(t => t.key === schedule.plantType)?.label}</span>
                      <span>
                        {language === 'te' ? 'ప్రతి' : 'Every'} {schedule.frequency} {language === 'te' ? 'రోజులకు' : 'days'}
                      </span>
                      <span>
                        {waterAmounts.find(a => a.key === schedule.amount)?.label} {language === 'te' ? 'మొత్తం' : 'amount'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(schedule)}`}>
                    {getStatusText(schedule)}
                  </span>
                  
                  <button
                    onClick={() => toggleSchedule(schedule.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      schedule.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={schedule.isActive ? (language === 'te' ? 'నిలిపివేయండి' : 'Pause') : (language === 'te' ? 'ప్రారంభించండి' : 'Resume')}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {language === 'te' ? 'చివరిసారి నీరు పెట్టిన తేదీ:' : 'Last watered:'}
                    </span>
                    <span className="font-medium">
                      {new Date(schedule.lastWatered).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {language === 'te' ? 'తదుపరి నీటిపారుదల:' : 'Next watering:'}
                    </span>
                    <span className="font-medium">
                      {new Date(schedule.nextWatering).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {schedule.fertilizeWithWater && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'te' ? 'ఎరువు రకం:' : 'Fertilizer type:'}
                      </span>
                      <span className="font-medium">{schedule.fertilizerType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'te' ? 'తదుపరి ఎరువు:' : 'Next fertilizing:'}
                      </span>
                      <span className="font-medium">
                        {schedule.nextFertilizing ? new Date(schedule.nextFertilizing).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {schedule.notes && (
                <p className="text-gray-700 text-sm mb-4 p-3 bg-gray-50 rounded-lg">
                  {schedule.notes}
                </p>
              )}
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => markAsWatered(schedule.id)}
                  disabled={!schedule.isActive}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'నీరు పెట్టాను' : 'Mark as Watered'}
                </button>
                
                {schedule.fertilizeWithWater && (
                  <button
                    onClick={() => markAsFertilized(schedule.id)}
                    disabled={!schedule.isActive}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Leaf className="h-4 w-4 mr-2" />
                    {language === 'te' ? 'ఎరువు వేశాను' : 'Mark as Fertilized'}
                  </button>
                )}
                
                {schedule.reminderEnabled && (
                  <span className="inline-flex items-center text-sm text-gray-600">
                    <Bell className="h-4 w-4 mr-1" />
                    {language === 'te' ? 'రిమైండర్ ఆన్' : 'Reminder On'}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Schedule Modal */}
      {showAddSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'te' ? 'కొత్త నీటిపారుదల షెడ్యూల్' : 'New Watering Schedule'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'మొక్క పేరు' : 'Plant Name'}
                  </label>
                  <input
                    type="text"
                    value={newSchedule.plantName}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, plantName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'te' ? 'ఉదా: టమాటో మొక్కలు' : 'e.g. Tomato Plants'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'మొక్క రకం' : 'Plant Type'}
                  </label>
                  <select
                    value={newSchedule.plantType}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, plantType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {plantTypes.map(type => (
                      <option key={type.key} value={type.key}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'ఫ్రీక్వెన్సీ (రోజులు)' : 'Frequency (days)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newSchedule.frequency}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, frequency: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'నీటి మొత్తం' : 'Water Amount'}
                  </label>
                  <select
                    value={newSchedule.amount}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {waterAmounts.map(amount => (
                      <option key={amount.key} value={amount.key}>{amount.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'te' ? 'గమనికలు' : 'Notes'}
                </label>
                <textarea
                  value={newSchedule.notes}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={language === 'te' ? 'ప్రత్యేక సూచనలు...' : 'Special instructions...'}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reminderEnabled"
                    checked={newSchedule.reminderEnabled}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, reminderEnabled: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="reminderEnabled" className="ml-2 text-sm text-gray-700">
                    {language === 'te' ? 'రిమైండర్‌లను ప్రారంభించు' : 'Enable reminders'}
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fertilizeWithWater"
                    checked={newSchedule.fertilizeWithWater}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, fertilizeWithWater: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fertilizeWithWater" className="ml-2 text-sm text-gray-700">
                    {language === 'te' ? 'ఎరువు షెడ్యూల్ కూడా చేర్చు' : 'Include fertilizer schedule'}
                  </label>
                </div>
              </div>
              
              {newSchedule.fertilizeWithWater && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'te' ? 'ఎరువు రకం' : 'Fertilizer Type'}
                    </label>
                    <input
                      type="text"
                      value={newSchedule.fertilizerType}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, fertilizerType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={language === 'te' ? 'ఉదా: సేంద్రీయ కంపోస్ట్' : 'e.g. Organic Compost'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'te' ? 'ఎరువు ఫ్రీక్వెన్సీ (వారాలు)' : 'Fertilizer Frequency (weeks)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={newSchedule.fertilizerFrequency}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, fertilizerFrequency: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddSchedule(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {language === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
              <button
                onClick={addSchedule}
                disabled={!newSchedule.plantName || !newSchedule.frequency}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {language === 'te' ? 'షెడ్యూల్ జోడించు' : 'Add Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}