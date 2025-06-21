import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  FileImage, 
  X, 
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { APP_CONFIG } from '../config/apiKeys';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onAnalysisComplete?: (result: any) => void;
  analysisType: 'crop-disease' | 'soil-analysis' | 'document-ocr';
  language: 'en' | 'te';
  isAnalyzing?: boolean;
  analysisResult?: any;
}

export default function ImageUploader({
  onImageSelect,
  onAnalysisComplete,
  analysisType,
  language,
  isAnalyzing = false,
  analysisResult
}: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size
      if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
        setUploadError(language === 'te' 
          ? 'फ़ाइल का आकार बहुत बड़ा है (अधिकतम 10MB)'
          : 'File size too large (max 10MB)'
        );
        return;
      }

      // Validate file type
      if (!APP_CONFIG.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        setUploadError(language === 'te'
          ? 'असमर्थित फ़ाइल प्रकार। कृपया JPG, PNG या WebP का उपयोग करें'
          : 'Unsupported file type. Please use JPG, PNG, or WebP'
        );
        return;
      }

      setUploadError(null);
      setSelectedImage(file);
      onImageSelect(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect, language]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': APP_CONFIG.SUPPORTED_IMAGE_TYPES.map(type => type.split('/')[1])
    },
    multiple: false,
    maxSize: APP_CONFIG.MAX_FILE_SIZE
  });

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadError(null);
  };

  const getAnalysisTypeLabel = () => {
    const labels = {
      'crop-disease': language === 'te' ? 'फसल रोग विश्लेषण' : 'Crop Disease Analysis',
      'soil-analysis': language === 'te' ? 'मिट्टी विश्लेषण' : 'Soil Analysis',
      'document-ocr': language === 'te' ? 'दस्तावेज़ स्कैनिंग' : 'Document Scanning'
    };
    return labels[analysisType];
  };

  const getAnalysisIcon = () => {
    switch (analysisType) {
      case 'crop-disease':
        return '🌱';
      case 'soil-analysis':
        return '🌍';
      case 'document-ocr':
        return '📄';
      default:
        return '📸';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center space-x-2">
          <span className="text-2xl">{getAnalysisIcon()}</span>
          <span>{getAnalysisTypeLabel()}</span>
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {language === 'te'
            ? 'छवि अपलोड करें या खींचकर छोड़ें'
            : 'Upload an image or drag and drop'
          }
        </p>
      </div>

      {/* Upload Area */}
      {!selectedImage ? (
        <motion.div
          {...getRootProps()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
          }`}
        >
          <input {...getInputProps()} />
          
          <motion.div
            animate={{ y: isDragActive ? -5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive
                ? (language === 'te' ? 'यहाँ छोड़ें' : 'Drop here')
                : (language === 'te' ? 'छवि अपलोड करें' : 'Upload Image')
              }
            </p>
            
            <p className="text-sm text-gray-500">
              {language === 'te'
                ? 'JPG, PNG या WebP (अधिकतम 10MB)'
                : 'JPG, PNG or WebP (max 10MB)'
              }
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="relative group">
            <img
              src={imagePreview!}
              alt="Selected"
              className="w-full h-64 object-cover rounded-xl shadow-md"
            />
            
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Analysis Overlay */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center"
                >
                  <div className="text-center text-white">
                    <Loader className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">
                      {language === 'te' ? 'विश्लेषण कर रहे हैं...' : 'Analyzing...'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* File Info */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileImage className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{selectedImage.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700">{uploadError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Result */}
      <AnimatePresence>
        {analysisResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                {language === 'te' ? 'विश्लेषण पूर्ण' : 'Analysis Complete'}
              </span>
            </div>
            <p className="text-sm text-green-700">
              {language === 'te'
                ? 'परिणाम नीचे देखें'
                : 'View results below'
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Capture Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            // Trigger camera input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                onDrop([file]);
              }
            };
            input.click();
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Camera className="h-4 w-4 mr-2" />
          {language === 'te' ? 'कैमरा खोलें' : 'Open Camera'}
        </button>
      </div>
    </div>
  );
}