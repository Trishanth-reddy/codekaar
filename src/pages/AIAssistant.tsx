import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot,
  Sparkles
} from 'lucide-react';
import VoiceAssistant from '../components/VoiceAssistant';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function AIAssistant() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const handleNewMessage = (message: any) => {
    // Handle new messages if needed for other functionality
    console.log('New message:', message);
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            >
              <Bot className="h-6 w-6 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'te' ? 'రైతు సాథి AI సహాయకుడు' : 'Rythu Saathi AI Assistant'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'te' 
                  ? 'వ్యవసాయం మరియు తోటపని కోసం మీ స్మార్ట్ సహాయకుడు'
                  : 'Your smart assistant for agriculture and gardening'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center space-x-1 text-sm text-green-600"
            >
              <Sparkles className="h-4 w-4" />
              <span>{language === 'te' ? 'AI శక్తితో' : 'AI Powered'}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 min-h-0">
        <VoiceAssistant
          language={language}
          userProfile={user}
          onNewMessage={handleNewMessage}
        />
      </div>
    </div>
  );
}