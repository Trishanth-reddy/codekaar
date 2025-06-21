import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  language: 'en' | 'te';
  tags: string[];
  likes: number;
  replies: ForumReply[];
  createdAt: string;
  updatedAt: string;
}

interface ForumReply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  createdAt: string;
}

interface AIInteraction {
  id: string;
  type: 'text' | 'voice' | 'image';
  query: string;
  response: string;
  language: 'en' | 'te';
  createdAt: string;
}

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    icon: string;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    description: string;
    icon: string;
  }>;
  alerts: Array<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    validUntil: string;
  }>;
  lastUpdated: string;
}

interface GovernmentScheme {
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
  isEligible?: boolean;
}

interface DataContextType {
  // Forum
  forumPosts: ForumPost[];
  addForumPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addForumReply: (postId: string, reply: Omit<ForumReply, 'id' | 'createdAt'>) => void;
  likePost: (postId: string) => void;
  likeReply: (postId: string, replyId: string) => void;
  
  // AI Interactions
  aiHistory: AIInteraction[];
  addAIInteraction: (interaction: Omit<AIInteraction, 'id' | 'createdAt'>) => void;
  
  // Weather
  weatherData: WeatherData | null;
  setWeatherData: (data: WeatherData) => void;
  
  // Government Schemes
  schemes: GovernmentScheme[];
  setSchemes: (schemes: GovernmentScheme[]) => void;
  
  // Loading states
  loading: {
    forum: boolean;
    weather: boolean;
    schemes: boolean;
  };
  setLoading: (key: keyof DataContextType['loading'], value: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const { user } = useAuth();
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [aiHistory, setAIHistory] = useState<AIInteraction[]>([]);
  const [weatherData, setWeatherDataState] = useState<WeatherData | null>(null);
  const [schemes, setSchemesState] = useState<GovernmentScheme[]>([]);
  const [loading, setLoadingState] = useState({
    forum: false,
    weather: false,
    schemes: false
  });

  useEffect(() => {
    if (user) {
      loadUserData();
      loadForumData();
      loadSchemesData();
    }
  }, [user]);

  const loadUserData = () => {
    if (!user) return;
    
    // Load AI history
    const savedHistory = localStorage.getItem(`ai-history-${user.id}`);
    if (savedHistory) {
      try {
        setAIHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading AI history:', error);
      }
    }
    
    // Load weather data
    const savedWeather = localStorage.getItem(`weather-data-${user.id}`);
    if (savedWeather) {
      try {
        setWeatherDataState(JSON.parse(savedWeather));
      } catch (error) {
        console.error('Error loading weather data:', error);
      }
    }
  };

  const loadForumData = () => {
    const savedPosts = localStorage.getItem('forum-posts');
    if (savedPosts) {
      try {
        setForumPosts(JSON.parse(savedPosts));
      } catch (error) {
        console.error('Error loading forum posts:', error);
      }
    } else {
      // Initialize with sample data
      const samplePosts: ForumPost[] = [
        {
          id: '1',
          userId: 'sample-user',
          userName: 'రాము రైతు',
          title: 'Best time to plant cotton in Warangal?',
          content: 'I am planning to plant cotton this season. What is the best time considering the current weather patterns?',
          language: 'en',
          tags: ['cotton', 'planting', 'warangal'],
          likes: 5,
          replies: [
            {
              id: 'reply-1',
              userId: 'expert-1',
              userName: 'వ్యవసాయ నిపుణుడు',
              content: 'For Warangal region, cotton planting is best done between June-July after monsoon onset.',
              likes: 3,
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setForumPosts(samplePosts);
      localStorage.setItem('forum-posts', JSON.stringify(samplePosts));
    }
  };

  const loadSchemesData = () => {
    // Sample government schemes data
    const sampleSchemes: GovernmentScheme[] = [
      {
        id: '1',
        title: {
          en: 'Rythu Bandhu Scheme',
          te: 'రైతు బంధు పథకం'
        },
        description: {
          en: 'Investment support for farmers at Rs. 10,000 per acre per season',
          te: 'రైతులకు ఎకరకు రూ. 10,000 పెట్టుబడి మద్దతు'
        },
        benefits: {
          en: ['₹10,000 per acre investment support', 'Direct benefit transfer', 'Seasonal assistance'],
          te: ['ఎకరకు ₹10,000 పెట్టుబడి మద్దతు', 'ప్రత్యక్ష లాభ బదిలీ', 'కాలానుగుణ సహాయం']
        },
        eligibility: {
          en: ['Must be a farmer', 'Own agricultural land', 'Resident of Telangana'],
          te: ['రైతు అయి ఉండాలి', 'వ్యవసాయ భూమి ఉండాలి', 'తెలంగాణ నివాసి అయి ఉండాలి']
        },
        applicationProcess: {
          en: ['Visit VRO office', 'Submit land documents', 'Provide bank details', 'Get verification done'],
          te: ['VRO కార్యాలయానికి వెళ్లండి', 'భూమి పత్రాలు సమర్పించండి', 'బ్యాంక్ వివరాలు ఇవ్వండి', 'వెరిఫికేషన్ చేయించుకోండి']
        },
        category: 'investment'
      },
      {
        id: '2',
        title: {
          en: 'PM Kisan Samman Nidhi',
          te: 'పిఎం కిసాన్ సమ్మాన్ నిధి'
        },
        description: {
          en: 'Income support of Rs. 6,000 per year to small and marginal farmers',
          te: 'చిన్న మరియు అంచు రైతులకు సంవత్సరానికి రూ. 6,000 ఆదాయ మద్దతు'
        },
        benefits: {
          en: ['₹6,000 annual income support', 'Three equal installments', 'Direct bank transfer'],
          te: ['వార్షిక ₹6,000 ఆదాయ మద్దతు', 'మూడు సమాన వాయిదాలు', 'ప్రత్యక్ష బ్యాంక్ బదిలీ']
        },
        eligibility: {
          en: ['Small and marginal farmers', 'Land holding up to 2 hectares', 'Valid bank account'],
          te: ['చిన్న మరియు అంచు రైతులు', '2 హెక్టార్ల వరకు భూమి', 'చెల్లుబాటు అయ్యే బ్యాంక్ ఖాతా']
        },
        applicationProcess: {
          en: ['Online registration', 'Document verification', 'Bank account linking', 'Aadhaar verification'],
          te: ['ఆన్‌లైన్ రిజిస్ట్రేషన్', 'పత్రాల వెరిఫికేషన్', 'బ్యాంక్ ఖాతా లింకింగ్', 'ఆధార్ వెరిఫికేషన్']
        },
        category: 'income-support'
      }
    ];
    
    setSchemesState(sampleSchemes);
  };

  const addForumPost = (post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: ForumPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedPosts = [newPost, ...forumPosts];
    setForumPosts(updatedPosts);
    localStorage.setItem('forum-posts', JSON.stringify(updatedPosts));
  };

  const addForumReply = (postId: string, reply: Omit<ForumReply, 'id' | 'createdAt'>) => {
    const newReply: ForumReply = {
      ...reply,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedPosts = forumPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, newReply],
          updatedAt: new Date().toISOString()
        };
      }
      return post;
    });
    
    setForumPosts(updatedPosts);
    localStorage.setItem('forum-posts', JSON.stringify(updatedPosts));
  };

  const likePost = (postId: string) => {
    const updatedPosts = forumPosts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    
    setForumPosts(updatedPosts);
    localStorage.setItem('forum-posts', JSON.stringify(updatedPosts));
  };

  const likeReply = (postId: string, replyId: string) => {
    const updatedPosts = forumPosts.map(post => {
      if (post.id === postId) {
        const updatedReplies = post.replies.map(reply => {
          if (reply.id === replyId) {
            return { ...reply, likes: reply.likes + 1 };
          }
          return reply;
        });
        return { ...post, replies: updatedReplies };
      }
      return post;
    });
    
    setForumPosts(updatedPosts);
    localStorage.setItem('forum-posts', JSON.stringify(updatedPosts));
  };

  const addAIInteraction = (interaction: Omit<AIInteraction, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    const newInteraction: AIInteraction = {
      ...interaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedHistory = [newInteraction, ...aiHistory].slice(0, 100); // Keep last 100 interactions
    setAIHistory(updatedHistory);
    localStorage.setItem(`ai-history-${user.id}`, JSON.stringify(updatedHistory));
  };

  const setWeatherData = (data: WeatherData) => {
    if (!user) return;
    
    setWeatherDataState(data);
    localStorage.setItem(`weather-data-${user.id}`, JSON.stringify(data));
  };

  const setSchemes = (schemes: GovernmentScheme[]) => {
    setSchemesState(schemes);
  };

  const setLoading = (key: keyof DataContextType['loading'], value: boolean) => {
    setLoadingState(prev => ({ ...prev, [key]: value }));
  };

  const value = {
    forumPosts,
    addForumPost,
    addForumReply,
    likePost,
    likeReply,
    aiHistory,
    addAIInteraction,
    weatherData,
    setWeatherData,
    schemes,
    setSchemes,
    loading,
    setLoading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}