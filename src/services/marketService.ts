import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

export interface MarketPrice {
  commodity: string;
  market: string;
  state: string;
  district: string;
  price: number;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  quality: string;
}

export interface MarketData {
  prices: MarketPrice[];
  lastUpdated: string;
  summary: {
    totalCommodities: number;
    priceIncreases: number;
    priceDecreases: number;
    stablePrices: number;
  };
}

class MarketService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_KEYS.AGMARKNET_API_KEY;
    this.baseUrl = API_ENDPOINTS.AGMARKNET_BASE;
  }

  async getMarketPrices(state: string = 'Telangana', language: 'en' | 'te' = 'en'): Promise<MarketData> {
    try {
      // Check if API key is configured properly
      if (!this.apiKey || this.apiKey === 'your_agmarknet_api_key_here') {
        console.warn('AgMarkNet API key not configured, using mock data');
        return this.getMockMarketData(language);
      }

      // Try to fetch real data from AgMarkNet API
      const response = await fetch(
        `${this.baseUrl}/9ef84268-d588-465a-a308-a864a43d0070?api-key=${this.apiKey}&format=json&filters[state]=${state}`
      );

      if (response.ok) {
        const data = await response.json();
        return this.formatMarketData(data.records, language);
      }
    } catch (error) {
      console.warn('Market API Error, falling back to mock data:', error);
    }

    // Return mock data if API fails
    return this.getMockMarketData(language);
  }

  async getCommodityPrices(commodity: string, language: 'en' | 'te' = 'en'): Promise<MarketPrice[]> {
    try {
      const marketData = await this.getMarketPrices('Telangana', language);
      return marketData.prices.filter(price => 
        price.commodity.toLowerCase().includes(commodity.toLowerCase())
      );
    } catch (error) {
      console.error('Commodity price error:', error);
      return [];
    }
  }

  async getMarketTrends(days: number = 7, language: 'en' | 'te' = 'en'): Promise<any> {
    try {
      // This would typically fetch historical data
      // For now, return mock trend data
      return this.getMockTrendData(days, language);
    } catch (error) {
      console.error('Market trends error:', error);
      return null;
    }
  }

  private formatMarketData(records: any[], language: 'en' | 'te'): MarketData {
    const prices: MarketPrice[] = records.map(record => ({
      commodity: this.translateCommodity(record.commodity, language),
      market: record.market,
      state: record.state,
      district: record.district,
      price: parseFloat(record.modal_price) || 0,
      unit: 'Quintal',
      date: record.price_date,
      trend: this.calculateTrend(record),
      change: this.calculateChange(record),
      quality: record.variety || 'Standard'
    }));

    const summary = this.calculateSummary(prices);

    return {
      prices,
      lastUpdated: new Date().toISOString(),
      summary
    };
  }

  private translateCommodity(commodity: string, language: 'en' | 'te'): string {
    if (language === 'en') return commodity;

    const translations: { [key: string]: string } = {
      'Rice': 'వరి',
      'Wheat': 'గోధుమ',
      'Cotton': 'పత్తి',
      'Maize': 'మొక్కజొన్న',
      'Onion': 'ఉల్లిపాయ',
      'Tomato': 'టమాటో',
      'Potato': 'బంగాళాదుంప',
      'Chili': 'మిరపకాయ',
      'Turmeric': 'పసుపు',
      'Groundnut': 'వేరుశనగ',
      'Soybean': 'సోయాబీన్',
      'Jowar': 'జొన్న',
      'Bajra': 'సజ్జలు',
      'Sugarcane': 'చెరకు'
    };

    return translations[commodity] || commodity;
  }

  private calculateTrend(record: any): 'up' | 'down' | 'stable' {
    const current = parseFloat(record.modal_price) || 0;
    const previous = parseFloat(record.min_price) || current;
    
    if (current > previous * 1.02) return 'up';
    if (current < previous * 0.98) return 'down';
    return 'stable';
  }

  private calculateChange(record: any): number {
    const current = parseFloat(record.modal_price) || 0;
    const previous = parseFloat(record.min_price) || current;
    return current - previous;
  }

  private calculateSummary(prices: MarketPrice[]) {
    return {
      totalCommodities: prices.length,
      priceIncreases: prices.filter(p => p.trend === 'up').length,
      priceDecreases: prices.filter(p => p.trend === 'down').length,
      stablePrices: prices.filter(p => p.trend === 'stable').length
    };
  }

  private getMockMarketData(language: 'en' | 'te'): MarketData {
    const commodities = language === 'te' 
      ? ['వరి', 'పత్తి', 'మొక్కజొన్న', 'ఉల్లిపాయ', 'టమాటో', 'మిరపకాయ', 'పసుపు', 'వేరుశనగ']
      : ['Rice', 'Cotton', 'Maize', 'Onion', 'Tomato', 'Chili', 'Turmeric', 'Groundnut'];

    const markets = ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'];

    const prices: MarketPrice[] = commodities.map((commodity, index) => {
      const basePrice = 2000 + Math.random() * 8000;
      const change = (Math.random() - 0.5) * 200;
      
      return {
        commodity,
        market: markets[index % markets.length],
        state: 'Telangana',
        district: markets[index % markets.length],
        price: Math.round(basePrice),
        unit: 'Quintal',
        date: new Date().toISOString().split('T')[0],
        trend: change > 50 ? 'up' : change < -50 ? 'down' : 'stable',
        change: Math.round(change),
        quality: 'Standard'
      };
    });

    return {
      prices,
      lastUpdated: new Date().toISOString(),
      summary: this.calculateSummary(prices)
    };
  }

  private getMockTrendData(days: number, language: 'en' | 'te') {
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toISOString().split('T')[0];
    });

    return {
      commodity: language === 'te' ? 'వరి' : 'Rice',
      dates,
      prices: dates.map(() => 3000 + Math.random() * 500),
      trend: 'up'
    };
  }
}

export const marketService = new MarketService();