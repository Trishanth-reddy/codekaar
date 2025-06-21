import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Bot, 
  User,
  Loader,
  MessageCircle
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { geminiService } from '../services/geminiService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface VoiceAssistantProps {
  language: 'en' | 'te';
  userProfile?: any;
  onNewMessage?: (message: Message) => void;
}

export default function VoiceAssistant({ language, userProfile, onNewMessage }: VoiceAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: language === 'te' 
          ? 'నమస్కారం! నేను రైతు సాథి AI సహాయకుడను. వ్యవసాయం గురించి ఏదైనా అడగండి.'
          : 'Hello! I am Rythu Saathi AI Assistant. Ask me anything about farming and agriculture.',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [language]);

  const handleSendMessage = async (text: string = inputText, isVoice: boolean = false) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      // Generate context from user profile and recent messages
      const context = generateContext();
      const response = await geminiService.generateResponse(text, context, language);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak response if in voice mode
      if (isVoiceMode && !isSpeaking) {
        await speakResponse(response);
      }

      // Notify parent component
      onNewMessage?.(assistantMessage);
    } catch (error) {
      console.error('AI Response Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: language === 'te' 
          ? 'క్షమించండి, ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.'
          : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = async () => {
    if (!speechService.isSupported()) {
      alert(language === 'te' 
        ? 'వాయిస్ రికగ్నిషన్ మద్దతు లేదు'
        : 'Voice recognition not supported'
      );
      return;
    }

    try {
      setIsListening(true);
      const transcript = await speechService.startListening(language);
      setIsListening(false);
      
      if (transcript) {
        await handleSendMessage(transcript, true);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const speakResponse = async (text: string) => {
    try {
      setIsSpeaking(true);
      await speechService.speak(text, language);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  const generateContext = (): string => {
    let context = '';
    
    if (userProfile) {
      context += `User Profile: ${userProfile.userType} from ${userProfile.location?.village}, ${userProfile.location?.district}. `;
    }

    // Add recent messages for context
    const recentMessages = messages.slice(-4);
    if (recentMessages.length > 0) {
      context += 'Recent conversation: ';
      recentMessages.forEach(msg => {
        context += `${msg.type}: ${msg.content.substring(0, 100)}... `;
      });
    }

    return context;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              animate={{ rotate: isProcessing ? 360 : 0 }}
              transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
              className="p-2 bg-blue-100 rounded-full"
            >
              <Bot className="h-6 w-6 text-blue-600" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {language === 'te' ? 'AI सहायक' : 'AI Assistant'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'te' 
                  ? 'वाणी और पाठ समर्थन के साथ'
                  : 'With voice and text support'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`p-2 rounded-full transition-colors ${
                isVoiceMode 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={language === 'te' ? 'वाणी मोड टॉगल करें' : 'Toggle voice mode'}
            >
              <Volume2 className="h-4 w-4" />
            </button>
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                title={language === 'te' ? 'बोलना बंद करें' : 'Stop speaking'}
              >
                <VolumeX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-100' 
                    : 'bg-green-100'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Bot className="h-4 w-4 text-green-600" />
                  )}
                </div>
                
                <div className={`px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.isVoice && (
                      <Mic className="h-3 w-3 opacity-70" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
              <Bot className="h-4 w-4 text-green-600" />
              <Loader className="h-4 w-4 animate-spin text-green-600" />
              <span className="text-sm text-gray-600">
                {language === 'te' ? 'सोच रहा हूं...' : 'Thinking...'}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
              placeholder={language === 'te' 
                ? 'अपना प्रश्न टाइप करें...'
                : 'Type your question...'
              }
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isProcessing || isListening}
            />
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isProcessing}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`p-3 rounded-full transition-colors ${
              isListening
                ? 'bg-red-600 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <MicOff className="h-5 w-5" />
              </motion.div>
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </motion.button>
        </div>

        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center"
          >
            <div className="inline-flex items-center space-x-2 text-sm text-red-600">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-red-600 rounded-full"
              />
              <span>
                {language === 'te' ? 'सुन रहा हूं...' : 'Listening...'}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}