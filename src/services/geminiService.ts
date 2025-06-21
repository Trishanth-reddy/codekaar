import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEYS } from '../config/apiKeys';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private visionModel: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.visionModel = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async generateResponse(prompt: string, context?: string, language: 'en' | 'te' = 'en'): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(language);
      const fullPrompt = context 
        ? `${systemPrompt}\n\nContext: ${context}\n\nUser: ${prompt}`
        : `${systemPrompt}\n\nUser: ${prompt}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return this.cleanResponse(response.text());
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeImage(imageFile: File, analysisType: 'crop-disease' | 'soil-analysis' | 'document-ocr', language: 'en' | 'te' = 'en'): Promise<any> {
    try {
      const imageData = await this.fileToGenerativePart(imageFile);
      const prompt = this.getImageAnalysisPrompt(analysisType, language);

      const result = await this.visionModel.generateContent([prompt, imageData]);
      const response = await result.response;
      const text = response.text();

      return this.parseImageAnalysisResponse(text, analysisType, language);
    } catch (error) {
      console.error('Gemini Vision API Error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async extractTextFromImage(imageFile: File, language: 'en' | 'te' = 'en'): Promise<string> {
    try {
      const imageData = await this.fileToGenerativePart(imageFile);
      const prompt = language === 'te' 
        ? 'ఈ చిత్రంలోని అన్ని టెక్స్ట్‌ను సంపూర్ణంగా మరియు ఖచ్చితంగా వెలికితీయండి. టెక్స్ట్ మాత్రమే రిటర్న్ చేయండి, వివరణలు వద్దు.'
        : 'Extract all text from this image completely and accurately. Return only the text, no explanations.';

      const result = await this.visionModel.generateContent([prompt, imageData]);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async analyzeSoilReport(extractedText: string, language: 'en' | 'te' = 'en'): Promise<any> {
    try {
      const prompt = language === 'te' 
        ? `ఈ మట్టి పరీక్ష రిపోర్ట్‌ను విశ్లేషించి, కింది JSON ఫార్మాట్‌లో సమాధానం ఇవ్వండి:
{
  "summary": "మట్టి రిపోర్ట్ సారాంశం",
  "nutrients": {
    "nitrogen": "స్థాయి మరియు వివరణ",
    "phosphorus": "స్థాయి మరియు వివరణ", 
    "potassium": "స్థాయి మరియు వివరణ",
    "ph": "pH విలువ మరియు వివరణ",
    "organicMatter": "సేంద్రీయ పదార్థం స్థాయి"
  },
  "recommendations": ["సిఫార్సు 1", "సిఫార్సు 2"],
  "suitableCrops": ["అనుకూల పంట 1", "అనుకూల పంట 2"],
  "fertilizers": ["ఎరువు సిఫార్సు 1", "ఎరువు సిఫార్సు 2"]
}`
        : `Analyze this soil test report and provide response in JSON format:
{
  "summary": "Soil report summary",
  "nutrients": {
    "nitrogen": "level and description",
    "phosphorus": "level and description",
    "potassium": "level and description", 
    "ph": "pH value and description",
    "organicMatter": "organic matter level"
  },
  "recommendations": ["recommendation 1", "recommendation 2"],
  "suitableCrops": ["suitable crop 1", "suitable crop 2"],
  "fertilizers": ["fertilizer recommendation 1", "fertilizer recommendation 2"]
}`;

      const fullPrompt = `${prompt}\n\nSoil Report Text:\n${extractedText}`;
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      
      return JSON.parse(this.cleanResponse(response.text()));
    } catch (error) {
      console.error('Soil Analysis Error:', error);
      throw new Error('Failed to analyze soil report');
    }
  }

  async checkSchemeEligibility(userProfile: any, language: 'en' | 'te' = 'en'): Promise<any[]> {
    try {
      const prompt = language === 'te'
        ? `వినియోగదారు ప్రొఫైల్ ఆధారంగా అర్హత ఉన్న ప్రభుత్వ పథకాలను గుర్తించండి. JSON ఆర్రే రూపంలో సమాధానం ఇవ్వండి:
[{
  "name": "పథకం పేరు",
  "description": "పథకం వివరణ",
  "benefits": "ప్రయోజనాలు",
  "eligibility": "అర్హత నియమాలు",
  "applicationProcess": "దరఖాస్తు ప్రక్రియ",
  "documents": "అవసరమైన పత్రాలు",
  "department": "సంబంధిత శాఖ"
}]`
        : `Identify eligible government schemes based on user profile. Respond in JSON array format:
[{
  "name": "scheme name",
  "description": "scheme description", 
  "benefits": "benefits",
  "eligibility": "eligibility criteria",
  "applicationProcess": "application process",
  "documents": "required documents",
  "department": "relevant department"
}]`;

      const fullPrompt = `${prompt}\n\nUser Profile:\n${JSON.stringify(userProfile, null, 2)}`;
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      
      return JSON.parse(this.cleanResponse(response.text()));
    } catch (error) {
      console.error('Scheme Eligibility Error:', error);
      throw new Error('Failed to check scheme eligibility');
    }
  }

  private async fileToGenerativePart(file: File): Promise<any> {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    };
  }

  private getSystemPrompt(language: 'en' | 'te'): string {
    if (language === 'te') {
      return `మీరు రైతు సాథి - తెలంగాణ రైతులు మరియు తోటమాలుల కోసం ఒక నిపుణుడైన వ్యవసాయ సహాయకుడు. మీరు:
- వ్యవసాయం, తోటపని, పంట వ్యాధులు, మట్టి నిర్వహణ గురించి సలహా ఇస్తారు
- తెలంగాణ వాతావరణం మరియు పరిస్థితులకు అనుకూలమైన సలహాలు ఇస్తారు
- సరళమైన, ఆచరణాత్మక సలహాలు ఇస్తారు
- ఎల్లప్పుడూ తెలుగులో స్పష్టంగా మరియు మర్యాదగా సమాధానం ఇస్తారు
- మార్క్‌డౌన్ లేదా ఫార్మాటింగ్ ఉపయోగించకండి, సాధారణ టెక్స్ట్ మాత్రమే`;
    }

    return `You are Rythu Saathi - an expert agricultural assistant for farmers and gardeners in Telangana. You:
- Provide advice on farming, gardening, crop diseases, soil management
- Give recommendations suitable for Telangana's climate and conditions  
- Offer simple, practical guidance
- Always respond clearly and politely in English
- Do not use markdown or formatting, plain text only`;
  }

  private getImageAnalysisPrompt(analysisType: string, language: 'en' | 'te'): string {
    const prompts = {
      'crop-disease': {
        'en': `Analyze this crop/plant image for diseases, pests, or health issues. Provide response in JSON format:
{
  "cropType": "identified crop/plant name",
  "healthStatus": "healthy/diseased/pest-affected",
  "issues": ["issue 1", "issue 2"],
  "severity": "low/medium/high",
  "treatment": ["treatment 1", "treatment 2"],
  "prevention": ["prevention tip 1", "prevention tip 2"],
  "confidence": 85
}`,
        'te': `ఈ పంట/మొక్క చిత్రంలో వ్యాధులు, కీటకాలు లేదా ఆరోగ్య సమస్యలను విశ్లేషించండి. JSON ఫార్మాట్‌లో సమాధానం ఇవ్వండి:
{
  "cropType": "గుర్తించిన పంట/మొక్క పేరు",
  "healthStatus": "ఆరోగ్యకరమైన/వ్యాధిగ్రస్తమైన/కీటక దాడి",
  "issues": ["సమస్య 1", "సమస్య 2"],
  "severity": "తక్కువ/మధ్యమ/అధిక",
  "treatment": ["చికిత్స 1", "చికిత్స 2"],
  "prevention": ["నివారణ చిట్కా 1", "నివారణ చిట్కా 2"],
  "confidence": 85
}`
      },
      'soil-analysis': {
        'en': `Analyze this soil image for type, condition, and health. Provide response in JSON format:
{
  "soilType": "soil type identified",
  "condition": "good/fair/poor",
  "moisture": "dry/adequate/wet",
  "color": "soil color description",
  "texture": "sandy/clay/loam/etc",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "suitableCrops": ["crop 1", "crop 2"],
  "confidence": 80
}`,
        'te': `ఈ మట్టి చిత్రంలో రకం, పరిస్థితి మరియు ఆరోగ్యాన్ని విశ్లేషించండి. JSON ఫార్మాట్‌లో సమాధానం ఇవ్వండి:
{
  "soilType": "గుర్తించిన మట్టి రకం",
  "condition": "మంచిది/సాధారణం/చెడ్డది",
  "moisture": "పొడిగా/సరిపోయేంత/తడిగా",
  "color": "మట్టి రంగు వివరణ",
  "texture": "ఇసుక/బంకమట్టి/లోమ్/మొదలైనవి",
  "recommendations": ["సిఫార్సు 1", "సిఫార్సు 2"],
  "suitableCrops": ["పంట 1", "పంట 2"],
  "confidence": 80
}`
      },
      'document-ocr': {
        'en': 'Extract all text from this document image accurately. Return only the extracted text.',
        'te': 'ఈ పత్రం చిత్రం నుండి అన్ని టెక్స్ట్‌ను ఖచ్చితంగా వెలికితీయండి. వెలికితీసిన టెక్స్ట్ మాత్రమే రిటర్న్ చేయండి.'
      }
    };

    return prompts[analysisType as keyof typeof prompts][language];
  }

  private parseImageAnalysisResponse(text: string, analysisType: string, language: 'en' | 'te'): any {
    try {
      const cleanedText = this.cleanResponse(text);
      
      // Try to parse as JSON first
      try {
        return JSON.parse(cleanedText);
      } catch (jsonError) {
        // If JSON parsing fails, create a structured response from the text
        return this.createFallbackResponse(cleanedText, analysisType, language);
      }
    } catch (error) {
      console.error('Response parsing error:', error);
      return {
        error: language === 'te' ? 'విశ్లేషణ విఫలమైంది' : 'Analysis failed',
        rawResponse: text,
        analysisType
      };
    }
  }

  private createFallbackResponse(text: string, analysisType: string, language: 'en' | 'te'): any {
    // Create a structured response when JSON parsing fails
    switch (analysisType) {
      case 'crop-disease':
        return {
          cropType: language === 'te' ? 'గుర్తించబడలేదు' : 'Not identified',
          healthStatus: language === 'te' ? 'అస్పష్టం' : 'Unclear',
          issues: [text.substring(0, 200)],
          severity: language === 'te' ? 'మధ్యమ' : 'medium',
          treatment: [language === 'te' ? 'వ్యవసాయ నిపుణుడిని సంప్రదించండి' : 'Consult agricultural expert'],
          prevention: [language === 'te' ? 'క్రమం తప్పకుండా పరిశీలించండి' : 'Regular monitoring recommended'],
          confidence: 60,
          rawResponse: text
        };
      
      case 'soil-analysis':
        return {
          soilType: language === 'te' ? 'గుర్తించబడలేదు' : 'Not identified',
          condition: language === 'te' ? 'అస్పష్టం' : 'unclear',
          moisture: language === 'te' ? 'అస్పష్టం' : 'unclear',
          color: language === 'te' ? 'గుర్తించబడలేదు' : 'not identified',
          texture: language === 'te' ? 'గుర్తించబడలేదు' : 'not identified',
          recommendations: [language === 'te' ? 'మట్టి పరీక్ష చేయించుకోండి' : 'Get soil tested'],
          suitableCrops: [language === 'te' ? 'స్థానిక సలహా తీసుకోండి' : 'Seek local advice'],
          confidence: 50,
          rawResponse: text
        };
      
      case 'document-ocr':
        return {
          text: text,
          confidence: 70,
          rawResponse: text
        };
      
      default:
        return {
          error: language === 'te' ? 'అస్పష్ట విశ్లేషణ రకం' : 'Unknown analysis type',
          rawResponse: text
        };
    }
  }

  private cleanResponse(text: string): string {
    return text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .trim();
  }
}

export const geminiService = new GeminiService();