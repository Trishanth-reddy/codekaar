export interface DocumentVerificationResult {
  isAuthentic: boolean;
  confidence: number;
  documentType: string;
  securityFeatures: {
    watermark: boolean;
    hologram: boolean;
    microtext: boolean;
    securityThread: boolean;
    uvFeatures: boolean;
  };
  suspiciousElements: string[];
  verificationScore: number;
  recommendations: string[];
}

export interface DocumentAnalysis {
  format: string;
  dimensions: { width: number; height: number };
  colorProfile: string;
  textQuality: number;
  imageQuality: number;
  metadata: any;
}

export class DocumentVerificationService {
  private static instance: DocumentVerificationService;

  private constructor() {}

  public static getInstance(): DocumentVerificationService {
    if (!DocumentVerificationService.instance) {
      DocumentVerificationService.instance = new DocumentVerificationService();
    }
    return DocumentVerificationService.instance;
  }

  async verifyDocument(
    imageFile: File,
    extractedText: string,
    documentType: string
  ): Promise<DocumentVerificationResult> {
    try {
      const analysis = await this.analyzeImage(imageFile);
      const textAnalysis = this.analyzeText(extractedText, documentType);
      const securityFeatures = await this.detectSecurityFeatures(imageFile);
      
      const verificationScore = this.calculateVerificationScore(
        analysis,
        textAnalysis,
        securityFeatures
      );

      const isAuthentic = verificationScore > 70;
      const confidence = Math.min(verificationScore, 95);

      return {
        isAuthentic,
        confidence,
        documentType,
        securityFeatures,
        suspiciousElements: this.identifySuspiciousElements(analysis, textAnalysis),
        verificationScore,
        recommendations: this.generateRecommendations(verificationScore, documentType)
      };
    } catch (error) {
      console.error('Document verification error:', error);
      throw new Error('Failed to verify document');
    }
  }

  private async analyzeImage(imageFile: File): Promise<DocumentAnalysis> {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Analyze image quality
        let totalBrightness = 0;
        let colorVariance = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          totalBrightness += brightness;
          
          const variance = Math.abs(data[i] - brightness) + 
                          Math.abs(data[i + 1] - brightness) + 
                          Math.abs(data[i + 2] - brightness);
          colorVariance += variance;
        }

        const avgBrightness = totalBrightness / (data.length / 4);
        const avgColorVariance = colorVariance / (data.length / 4);

        resolve({
          format: imageFile.type,
          dimensions: { width: img.width, height: img.height },
          colorProfile: this.analyzeColorProfile(data),
          textQuality: this.calculateTextQuality(avgBrightness, avgColorVariance),
          imageQuality: this.calculateImageQuality(img.width, img.height, imageFile.size),
          metadata: {
            fileSize: imageFile.size,
            lastModified: imageFile.lastModified
          }
        });
      };

      img.src = URL.createObjectURL(imageFile);
    });
  }

  private analyzeColorProfile(data: Uint8ClampedArray): string {
    let redSum = 0, greenSum = 0, blueSum = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      redSum += data[i];
      greenSum += data[i + 1];
      blueSum += data[i + 2];
    }

    const pixels = data.length / 4;
    const avgRed = redSum / pixels;
    const avgGreen = greenSum / pixels;
    const avgBlue = blueSum / pixels;

    if (Math.abs(avgRed - avgGreen) < 10 && Math.abs(avgGreen - avgBlue) < 10) {
      return 'grayscale';
    } else if (avgBlue > avgRed && avgBlue > avgGreen) {
      return 'blue-dominant';
    } else if (avgRed > avgGreen && avgRed > avgBlue) {
      return 'red-dominant';
    } else {
      return 'balanced';
    }
  }

  private calculateTextQuality(brightness: number, variance: number): number {
    // Higher contrast (variance) and moderate brightness indicate better text quality
    const brightnessScore = 100 - Math.abs(brightness - 128) / 1.28;
    const contrastScore = Math.min(variance / 2, 100);
    return (brightnessScore + contrastScore) / 2;
  }

  private calculateImageQuality(width: number, height: number, fileSize: number): number {
    const resolution = width * height;
    const compressionRatio = fileSize / resolution;
    
    let resolutionScore = Math.min((resolution / 1000000) * 50, 100); // 1MP = 50 points
    let compressionScore = Math.min(compressionRatio * 10, 100);
    
    return (resolutionScore + compressionScore) / 2;
  }

  private analyzeText(text: string, documentType: string): any {
    const patterns = this.getDocumentPatterns(documentType);
    const matches = patterns.filter(pattern => pattern.regex.test(text));
    
    return {
      patternMatches: matches.length,
      totalPatterns: patterns.length,
      textLength: text.length,
      hasRequiredFields: this.checkRequiredFields(text, documentType),
      suspiciousPatterns: this.detectSuspiciousTextPatterns(text)
    };
  }

  private getDocumentPatterns(documentType: string): Array<{name: string, regex: RegExp}> {
    const patterns: { [key: string]: Array<{name: string, regex: RegExp}> } = {
      'aadhaar': [
        { name: 'aadhaar_number', regex: /\d{4}\s?\d{4}\s?\d{4}/ },
        { name: 'dob', regex: /\d{2}\/\d{2}\/\d{4}/ },
        { name: 'government_text', regex: /(government|india|भारत|ప్రభుత్వం)/i }
      ],
      'pan': [
        { name: 'pan_number', regex: /[A-Z]{5}\d{4}[A-Z]/ },
        { name: 'income_tax', regex: /(income tax|आयकर|ఆదాయపు పన్ను)/i },
        { name: 'permanent_account', regex: /(permanent account|स्थायी खाता|శాశ్వత ఖాతా)/i }
      ],
      'passport': [
        { name: 'passport_number', regex: /[A-Z]\d{7}/ },
        { name: 'passport_text', regex: /(passport|पासपोर्ट|పాస్‌పోర్ట్)/i },
        { name: 'republic_india', regex: /(republic of india|भारत गणराज्य|భారత గణరాజ్యం)/i }
      ],
      'license': [
        { name: 'license_number', regex: /[A-Z]{2}\d{2}\s?\d{11}/ },
        { name: 'driving_license', regex: /(driving license|ड्राइविंग लाइसेंस|డ్రైవింగ్ లైసెన్స్)/i },
        { name: 'transport', regex: /(transport|परिवहन|రవాణా)/i }
      ]
    };

    return patterns[documentType.toLowerCase()] || [];
  }

  private checkRequiredFields(text: string, documentType: string): boolean {
    const requiredFields: { [key: string]: string[] } = {
      'aadhaar': ['name', 'dob', 'address'],
      'pan': ['name', 'father', 'dob'],
      'passport': ['name', 'nationality', 'dob'],
      'license': ['name', 'address', 'dob']
    };

    const fields = requiredFields[documentType.toLowerCase()] || [];
    return fields.every(field => text.toLowerCase().includes(field));
  }

  private detectSuspiciousTextPatterns(text: string): string[] {
    const suspicious: string[] = [];
    
    // Check for repeated characters
    if (/(.)\1{5,}/.test(text)) {
      suspicious.push('Repeated characters detected');
    }
    
    // Check for unusual character combinations
    if (/[0-9]{20,}/.test(text)) {
      suspicious.push('Unusually long number sequence');
    }
    
    // Check for mixed scripts inappropriately
    const hasLatin = /[a-zA-Z]/.test(text);
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const hasTelugu = /[\u0C00-\u0C7F]/.test(text);
    
    if ((hasLatin && hasDevanagari && hasTelugu)) {
      suspicious.push('Unusual script mixing');
    }
    
    return suspicious;
  }

  private async detectSecurityFeatures(imageFile: File): Promise<DocumentVerificationResult['securityFeatures']> {
    // Simulate security feature detection
    // In a real implementation, this would use computer vision algorithms
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          watermark: Math.random() > 0.3,
          hologram: Math.random() > 0.5,
          microtext: Math.random() > 0.4,
          securityThread: Math.random() > 0.6,
          uvFeatures: Math.random() > 0.7
        });
      }, 1000);
    });
  }

  private calculateVerificationScore(
    analysis: DocumentAnalysis,
    textAnalysis: any,
    securityFeatures: DocumentVerificationResult['securityFeatures']
  ): number {
    let score = 0;
    
    // Image quality score (30%)
    score += (analysis.imageQuality * 0.3);
    
    // Text quality score (25%)
    score += (analysis.textQuality * 0.25);
    
    // Pattern matching score (25%)
    const patternScore = (textAnalysis.patternMatches / Math.max(textAnalysis.totalPatterns, 1)) * 100;
    score += (patternScore * 0.25);
    
    // Security features score (20%)
    const securityScore = Object.values(securityFeatures).filter(Boolean).length * 20;
    score += (securityScore * 0.2);
    
    // Deduct points for suspicious elements
    score -= (textAnalysis.suspiciousPatterns.length * 10);
    
    return Math.max(0, Math.min(100, score));
  }

  private identifySuspiciousElements(analysis: DocumentAnalysis, textAnalysis: any): string[] {
    const suspicious: string[] = [];
    
    if (analysis.imageQuality < 30) {
      suspicious.push('Poor image quality');
    }
    
    if (analysis.textQuality < 40) {
      suspicious.push('Poor text clarity');
    }
    
    if (textAnalysis.suspiciousPatterns.length > 0) {
      suspicious.push(...textAnalysis.suspiciousPatterns);
    }
    
    if (analysis.dimensions.width < 500 || analysis.dimensions.height < 300) {
      suspicious.push('Unusually small image dimensions');
    }
    
    return suspicious;
  }

  private generateRecommendations(score: number, documentType: string): string[] {
    const recommendations: string[] = [];
    
    if (score < 50) {
      recommendations.push('Document appears highly suspicious - manual verification required');
      recommendations.push('Cross-reference with official government databases');
    } else if (score < 70) {
      recommendations.push('Document requires additional verification');
      recommendations.push('Check for physical security features');
    } else {
      recommendations.push('Document appears authentic');
      recommendations.push('Standard verification protocols apply');
    }
    
    recommendations.push(`Verify ${documentType} details with issuing authority if needed`);
    
    return recommendations;
  }
}

export const documentVerificationService = DocumentVerificationService.getInstance();