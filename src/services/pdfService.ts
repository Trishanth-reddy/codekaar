import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFReportData {
  title: string;
  subtitle?: string;
  sections: Array<{
    title: string;
    content: string | Array<{ label: string; value: string }>;
    type: 'text' | 'table' | 'list';
  }>;
  footer?: string;
  language: 'en' | 'te';
}

class PDFService {
  private doc: jsPDF | null = null;
  private currentY: number = 20;
  private pageHeight: number = 297; // A4 height in mm
  private margin: number = 20;

  async generateReport(data: PDFReportData): Promise<Blob> {
    this.doc = new jsPDF();
    this.currentY = 20;

    // Add title
    this.addTitle(data.title, data.language);
    
    if (data.subtitle) {
      this.addSubtitle(data.subtitle, data.language);
    }

    // Add sections
    for (const section of data.sections) {
      this.addSection(section, data.language);
    }

    // Add footer
    if (data.footer) {
      this.addFooter(data.footer);
    }

    return this.doc.output('blob');
  }

  async generateSoilReport(soilData: any, language: 'en' | 'te'): Promise<Blob> {
    const reportData: PDFReportData = {
      title: language === 'te' ? 'మట్టి పరీక్ష రిపోర్ట్' : 'Soil Test Report',
      subtitle: language === 'te' ? 'రైతు సాథి - AI విశ్లేషణ' : 'Rythu Saathi - AI Analysis',
      sections: [
        {
          title: language === 'te' ? 'సారాంశం' : 'Summary',
          content: soilData.summary || (language === 'te' ? 'సారాంశం అందుబాటులో లేదు' : 'Summary not available'),
          type: 'text'
        },
        {
          title: language === 'te' ? 'మట్టి వివరాలు' : 'Soil Details',
          content: [
            { label: this.translateSoilProperty('soilType', language), value: soilData.soilType || 'N/A' },
            { label: this.translateSoilProperty('condition', language), value: soilData.condition || 'N/A' },
            { label: this.translateSoilProperty('moisture', language), value: soilData.moisture || 'N/A' },
            { label: this.translateSoilProperty('texture', language), value: soilData.texture || 'N/A' },
            { label: this.translateSoilProperty('color', language), value: soilData.color || 'N/A' }
          ],
          type: 'table'
        },
        {
          title: language === 'te' ? 'సిఫార్సులు' : 'Recommendations',
          content: soilData.recommendations || [language === 'te' ? 'సిఫార్సులు అందుబాటులో లేవు' : 'No recommendations available'],
          type: 'list'
        },
        {
          title: language === 'te' ? 'అనుకూల పంటలు' : 'Suitable Crops',
          content: soilData.suitableCrops || [language === 'te' ? 'సిఫార్సు చేసిన పంటలు లేవు' : 'No crop recommendations available'],
          type: 'list'
        }
      ],
      footer: language === 'te' 
        ? `రిపోర్ట్ తయారీ తేదీ: ${new Date().toLocaleDateString('te-IN')}`
        : `Report generated on: ${new Date().toLocaleDateString()}`,
      language
    };

    return this.generateReport(reportData);
  }

  async generateCropDiseaseReport(diseaseData: any, language: 'en' | 'te'): Promise<Blob> {
    const reportData: PDFReportData = {
      title: language === 'te' ? 'పంట వ్యాధి విశ్లేషణ రిపోర్ట్' : 'Crop Disease Analysis Report',
      subtitle: language === 'te' ? 'రైతు సాథి - AI విశ్లేషణ' : 'Rythu Saathi - AI Analysis',
      sections: [
        {
          title: language === 'te' ? 'పంట వివరాలు' : 'Crop Details',
          content: [
            { label: language === 'te' ? 'పంట రకం' : 'Crop Type', value: diseaseData.cropType || 'N/A' },
            { label: language === 'te' ? 'ఆరోగ్య స్థితి' : 'Health Status', value: diseaseData.healthStatus || 'N/A' },
            { label: language === 'te' ? 'తీవ్రత' : 'Severity', value: diseaseData.severity || 'N/A' }
          ],
          type: 'table'
        },
        {
          title: language === 'te' ? 'గుర్తించిన సమస్యలు' : 'Identified Issues',
          content: diseaseData.issues || [language === 'te' ? 'సమస్యలు గుర్తించబడలేదు' : 'No issues identified'],
          type: 'list'
        },
        {
          title: language === 'te' ? 'చికిత్స' : 'Treatment',
          content: diseaseData.treatment || [language === 'te' ? 'చికిత్స సిఫార్సులు అందుబాటులో లేవు' : 'No treatment recommendations available'],
          type: 'list'
        },
        {
          title: language === 'te' ? 'నివారణ' : 'Prevention',
          content: diseaseData.prevention || [language === 'te' ? 'నివారణ చర్యలు అందుబాటులో లేవు' : 'No prevention measures available'],
          type: 'list'
        }
      ],
      footer: language === 'te' 
        ? `విశ్వసనీయత: ${diseaseData.confidence || 'N/A'}% | రిపోర్ట్ తేదీ: ${new Date().toLocaleDateString('te-IN')}`
        : `Confidence: ${diseaseData.confidence || 'N/A'}% | Report Date: ${new Date().toLocaleDateString()}`,
      language
    };

    return this.generateReport(reportData);
  }

  private addTitle(title: string, language: 'en' | 'te') {
    if (!this.doc) return;

    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    
    const textWidth = this.doc.getTextWidth(title);
    const x = (this.doc.internal.pageSize.width - textWidth) / 2;
    
    this.doc.text(title, x, this.currentY);
    this.currentY += 15;
  }

  private addSubtitle(subtitle: string, language: 'en' | 'te') {
    if (!this.doc) return;

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    const textWidth = this.doc.getTextWidth(subtitle);
    const x = (this.doc.internal.pageSize.width - textWidth) / 2;
    
    this.doc.text(subtitle, x, this.currentY);
    this.currentY += 20;
  }

  private addSection(section: any, language: 'en' | 'te') {
    if (!this.doc) return;

    this.checkPageBreak(30);

    // Section title
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(section.title, this.margin, this.currentY);
    this.currentY += 10;

    // Section content
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    switch (section.type) {
      case 'text':
        this.addTextContent(section.content);
        break;
      case 'table':
        this.addTableContent(section.content);
        break;
      case 'list':
        this.addListContent(section.content);
        break;
    }

    this.currentY += 10;
  }

  private addTextContent(content: string) {
    if (!this.doc) return;

    const lines = this.doc.splitTextToSize(content, 170);
    for (const line of lines) {
      this.checkPageBreak(5);
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 5;
    }
  }

  private addTableContent(content: Array<{ label: string; value: string }>) {
    if (!this.doc) return;

    for (const row of content) {
      this.checkPageBreak(8);
      this.doc.text(`${row.label}:`, this.margin, this.currentY);
      this.doc.text(row.value, this.margin + 60, this.currentY);
      this.currentY += 8;
    }
  }

  private addListContent(content: string[]) {
    if (!this.doc) return;

    for (const item of content) {
      this.checkPageBreak(6);
      this.doc.text(`• ${item}`, this.margin + 5, this.currentY);
      this.currentY += 6;
    }
  }

  private addFooter(footer: string) {
    if (!this.doc) return;

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'italic');
    this.doc.text(footer, this.margin, this.pageHeight - 10);
  }

  private checkPageBreak(requiredSpace: number) {
    if (!this.doc) return;

    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  private translateSoilProperty(key: string, language: 'en' | 'te'): string {
    if (language === 'en') return key;

    const translations: { [key: string]: string } = {
      'soilType': 'మట్టి రకం',
      'condition': 'పరిస్థితి',
      'moisture': 'తేమ',
      'texture': 'ఆకృతి',
      'color': 'రంగు',
      'nitrogen': 'నత్రజని',
      'phosphorus': 'భాస్వరం',
      'potassium': 'పొటాషియం',
      'ph': 'pH విలువ',
      'organicMatter': 'సేంద్రీయ పదార్థం'
    };

    return translations[key] || key;
  }
}

export const pdfService = new PDFService();