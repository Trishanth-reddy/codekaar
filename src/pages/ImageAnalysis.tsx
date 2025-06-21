import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  FileText, 
  Download, 
  Leaf, 
  Bug, 
  Droplets,
  Scan,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
  Info,
  Shield,
  Zap
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { geminiService } from '../services/geminiService';
import { pdfService } from '../services/pdfService';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface AnalysisResult {
  type: 'crop-disease' | 'soil-analysis' | 'document-ocr';
  data: any;
  confidence?: number;
  timestamp: string;
}

export default function ImageAnalysis() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [analysisType, setAnalysisType] = useState<'crop-disease' | 'soil-analysis' | 'document-ocr'>('crop-disease');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
    setIsAnalyzing(true);

    try {
      const result = await geminiService.analyzeImage(file, analysisType, language);
      
      const analysisData: AnalysisResult = {
        type: analysisType,
        data: result,
        confidence: result.confidence || 85,
        timestamp: new Date().toISOString()
      };

      setAnalysisResult(analysisData);
      
      // Save to history
      const updatedHistory = [analysisData, ...analysisHistory.slice(0, 9)]; // Keep last 10
      setAnalysisHistory(updatedHistory);
      
      if (user) {
        localStorage.setItem(`analysis-history-${user.id}`, JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult({
        type: analysisType,
        data: { 
          error: language === 'te' 
            ? 'విశ్లేషణ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.' 
            : 'Analysis failed. Please try again.' 
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = async () => {
    if (!analysisResult) return;

    try {
      let pdfBlob: Blob;

      if (analysisResult.type === 'crop-disease') {
        pdfBlob = await pdfService.generateCropDiseaseReport(analysisResult.data, language);
      } else if (analysisResult.type === 'soil-analysis') {
        pdfBlob = await pdfService.generateSoilReport(analysisResult.data, language);
      } else {
        // Document OCR report
        const reportData = {
          title: language === 'te' ? 'పత్రం స్కాన్ రిపోర్ట్' : 'Document Scan Report',
          sections: [
            {
              title: language === 'te' ? 'వెలికితీసిన టెక్స్ట్' : 'Extracted Text',
              content: analysisResult.data.text || analysisResult.data.rawResponse,
              type: 'text' as const
            }
          ],
          language
        };
        pdfBlob = await pdfService.generateReport(reportData);
      }

      // Download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rythu-saathi-${analysisResult.type}-report-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  const getAnalysisTypeConfig = (type: string) => {
    const configs = {
      'crop-disease': {
        title: language === 'te' ? 'పంట వ్యాధి విశ్లేషణ' : 'Crop Disease Analysis',
        icon: Bug,
        color: 'from-red-500 to-pink-500',
        emoji: '🌱'
      },
      'soil-analysis': {
        title: language === 'te' ? 'మట్టి విశ్లేషణ' : 'Soil Analysis',
        icon: Droplets,
        color: 'from-blue-500 to-cyan-500',
        emoji: '🌍'
      },
      'document-ocr': {
        title: language === 'te' ? 'పత్రం స్కానర్' : 'Document Scanner',
        icon: Scan,
        color: 'from-purple-500 to-indigo-500',
        emoji: '📄'
      }
    };
    return configs[type as keyof typeof configs];
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    const { data, type, confidence } = analysisResult;

    if (data.error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">
              {language === 'te' ? 'విశ్లేషణ లోపం' : 'Analysis Error'}
            </span>
          </div>
          <p className="text-sm text-red-700 mt-1">{data.error}</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Confidence Score */}
        {confidence && (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                {language === 'te' ? 'విశ్వసనీయత స్కోర్' : 'Confidence Score'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-green-600 h-2 rounded-full"
                />
              </div>
              <span className="font-bold text-green-800">{confidence}%</span>
            </div>
          </div>
        )}

        {/* Type-specific Results */}
        {type === 'crop-disease' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Leaf className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'పంట సమాచారం' : 'Crop Information'}
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>{language === 'te' ? 'రకం:' : 'Type:'}</strong> {data.cropType}</p>
                  <p><strong>{language === 'te' ? 'ఆరోగ్యం:' : 'Health:'}</strong> {data.healthStatus}</p>
                  {data.severity && (
                    <p><strong>{language === 'te' ? 'తీవ్రత:' : 'Severity:'}</strong> {data.severity}</p>
                  )}
                </div>
              </div>
              
              {data.issues && data.issues.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2 flex items-center">
                    <Bug className="h-4 w-4 mr-2" />
                    {language === 'te' ? 'గుర్తించిన సమస్యలు' : 'Identified Issues'}
                  </h4>
                  <ul className="space-y-1">
                    {data.issues.map((issue: string, index: number) => (
                      <li key={index} className="text-sm text-red-700 flex items-start">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {data.treatment && data.treatment.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'చికిత్స సిఫార్సులు' : 'Treatment Recommendations'}
                </h4>
                <ul className="space-y-1">
                  {data.treatment.map((treatment: string, index: number) => (
                    <li key={index} className="text-sm text-green-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {treatment}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.prevention && data.prevention.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'నివారణ చర్యలు' : 'Prevention Measures'}
                </h4>
                <ul className="space-y-1">
                  {data.prevention.map((prevention: string, index: number) => (
                    <li key={index} className="text-sm text-yellow-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {prevention}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {type === 'soil-analysis' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Droplets className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'మట్టి సమాచారం' : 'Soil Information'}
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>{language === 'te' ? 'రకం:' : 'Type:'}</strong> {data.soilType}</p>
                  <p><strong>{language === 'te' ? 'పరిస్థితి:' : 'Condition:'}</strong> {data.condition}</p>
                  <p><strong>{language === 'te' ? 'తేమ:' : 'Moisture:'}</strong> {data.moisture}</p>
                  <p><strong>{language === 'te' ? 'ఆకృతి:' : 'Texture:'}</strong> {data.texture}</p>
                  {data.color && (
                    <p><strong>{language === 'te' ? 'రంగు:' : 'Color:'}</strong> {data.color}</p>
                  )}
                </div>
              </div>
              
              {data.suitableCrops && data.suitableCrops.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center">
                    <Leaf className="h-4 w-4 mr-2" />
                    {language === 'te' ? 'అనుకూల పంటలు' : 'Suitable Crops'}
                  </h4>
                  <ul className="space-y-1">
                    {data.suitableCrops.map((crop: string, index: number) => (
                      <li key={index} className="text-sm text-green-700 flex items-start">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {crop}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {data.recommendations && data.recommendations.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'సిఫార్సులు' : 'Recommendations'}
                </h4>
                <ul className="space-y-1">
                  {data.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-sm text-yellow-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {type === 'document-ocr' && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              {language === 'te' ? 'వెలికితీసిన టెక్స్ట్' : 'Extracted Text'}
            </h4>
            <div className="bg-white p-3 rounded border max-h-64 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {data.text || data.rawResponse || (language === 'te' ? 'టెక్స్ట్ వెలికితీయబడలేదు' : 'No text extracted')}
              </pre>
            </div>
          </div>
        )}

        {/* Raw Response for debugging */}
        {data.rawResponse && (
          <details className="p-4 bg-gray-50 rounded-lg">
            <summary className="font-medium text-gray-800 cursor-pointer flex items-center">
              <Info className="h-4 w-4 mr-2" />
              {language === 'te' ? 'వివరణాత్మక ప్రతిస్పందన' : 'Detailed Response'}
            </summary>
            <div className="mt-2 p-3 bg-white rounded border max-h-32 overflow-y-auto">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {data.rawResponse}
              </pre>
            </div>
          </details>
        )}

        {/* Download Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadReport}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
          >
            <Download className="h-4 w-4 mr-2" />
            {language === 'te' ? 'రిపోర్ట్ డౌన్‌లోడ్ చేయండి' : 'Download Report'}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'te' ? 'చిత్ర విశ్లేషణ' : 'Image Analysis'}
        </h1>
        <p className="text-gray-600">
          {language === 'te' 
            ? 'AI తో పంట, మట్టి మరియు పత్రాల విశ్లేషణ'
            : 'AI-powered crop, soil, and document analysis'
          }
        </p>
      </motion.div>

      {/* Analysis Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'te' ? 'విశ్లేషణ రకం ఎంచుకోండి' : 'Select Analysis Type'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['crop-disease', 'soil-analysis', 'document-ocr'] as const).map((type) => {
            const config = getAnalysisTypeConfig(type);
            const Icon = config.icon;
            
            return (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnalysisType(type)}
                className={`p-6 rounded-xl border-2 transition-all relative overflow-hidden ${
                  analysisType === type
                    ? 'border-transparent bg-gradient-to-r ' + config.color + ' text-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                }`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="h-8 w-8" />
                    <span className="text-2xl">{config.emoji}</span>
                  </div>
                  <div className="text-sm font-medium">{config.title}</div>
                </div>
                
                {analysisType === type && (
                  <motion.div
                    layoutId="activeAnalysis"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        >
          <ImageUploader
            onImageSelect={handleImageSelect}
            analysisType={analysisType}
            language={language}
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
          />
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-orange-600" />
            {language === 'te' ? 'విశ్లేషణ ఫలితాలు' : 'Analysis Results'}
          </h3>
          
          <AnimatePresence mode="wait">
            {!analysisResult ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === 'te' 
                    ? 'విశ్లేషణ ఫలితాలు ఇక్కడ కనిపిస్తాయి'
                    : 'Analysis results will appear here'
                  }
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderAnalysisResult()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'te' ? 'ఇటీవలి విశ్లేషణలు' : 'Recent Analysis'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisHistory.slice(0, 6).map((analysis, index) => {
              const config = getAnalysisTypeConfig(analysis.type);
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setAnalysisResult(analysis)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg">{config.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{config.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(analysis.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {analysis.confidence && (
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-600 h-1 rounded-full"
                          style={{ width: `${analysis.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{analysis.confidence}%</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}