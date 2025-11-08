import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card3D from './Card3D';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  CircleDot,
  Copy,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

const VoiceAssistant = ({ accessibilitySettings }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  // Default: Hindi input → English output (more common use case in India)
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [error, setError] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'ja-JP', name: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'ar-SA', name: 'العربية (Arabic)', flag: '🇸🇦' },
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  ];

  // Load speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      if (voices.length > 0) {
      }
    };

    // Load voices immediately
    loadVoices();

    // Some browsers load voices asynchronously
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = null;
      }
    };
  }, []);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition not supported. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;
    recognition.maxAlternatives = 3; // Get 3 alternatives for better accuracy

    recognition.onresult = (event) => {
      let interim = '';
      let finalText = '';
      let bestConfidence = 0;

      // Process all results with better accuracy checking
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        
        // Get best alternative based on confidence
        let bestTranscript = result[0].transcript;
        let bestConf = result[0].confidence || 0;
        
        // Check all alternatives and pick the best one
        for (let j = 0; j < result.length && j < 3; j++) {
          const alt = result[j];
          if (alt.confidence > bestConf) {
            bestTranscript = alt.transcript;
            bestConf = alt.confidence;
          }
        }
        
        if (result.isFinal) {
          finalText += bestTranscript + ' ';
          bestConfidence = Math.max(bestConfidence, Math.round(bestConf * 100));
        } else {
          interim += bestTranscript;
        }
      }

      // Update confidence score
      if (bestConfidence > 0) {
        setConfidence(bestConfidence);
      }

      // Update interim results (gray text) - shows what's being detected in real-time
      setInterimTranscript(interim);

      // When we have final text, add to transcript and translate immediately
      if (finalText.trim()) {
        const cleanedText = finalText.trim();
        setTranscript(prev => (prev + ' ' + cleanedText).trim());
        // Clear interim after final text is added
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      const errors = {
        'not-allowed': 'Microphone access denied. Please allow permissions in browser settings.',
        'no-speech': 'No speech detected. Try speaking louder and clearer.',
        'network': 'Network error occurred. Check your internet connection.',
        'audio-capture': 'No microphone found. Please connect a microphone.',
        'aborted': 'Speech recognition stopped.',
      };
      
      // Only show error if it's critical
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(errors[event.error] || `Error: ${event.error}`);
      }
      
      // Stop listening for critical errors
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        setIsListening(false);
      }
      
      // Auto-restart for 'no-speech' errors to keep listening
      if (event.error === 'no-speech' && isListening) {
        setTimeout(() => {
          try {
            if (recognitionRef.current && isListening) {
              recognitionRef.current.start();
            }
          } catch (e) {
            console.log('Auto-restart failed:', e);
          }
        }, 100);
      }
    };

    recognition.onstart = () => {
      setError('');
    };

    recognition.onend = () => {
      console.log('Recognition ended, isListening:', isListening);
      
      if (isListening) {
        // Restart immediately if still listening (more responsive)
        setTimeout(() => {
          try {
            if (recognitionRef.current && isListening) {
              recognitionRef.current.start();
              console.log('Recognition restarted');
            }
          } catch (e) {
            console.error('Failed to restart:', e);
            // If restart fails, stop listening
            setIsListening(false);
            setError('Voice recognition stopped. Please click Start again.');
          }
        }, 50); // Reduced delay for faster restart
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
        }
      }
    };
  }, [selectedLanguage, isListening]);

  // Auto-translate when transcript changes (debounced for performance)
  useEffect(() => {
    if (!transcript || !transcript.trim()) {
      setTranslation('');
      return;
    }

    // Debounce translation to avoid too many API calls
    const debounceTimer = setTimeout(() => {
      translateText(transcript);
    }, 500); // Wait 500ms after user stops speaking

    return () => clearTimeout(debounceTimer);
  }, [transcript, selectedLanguage, targetLanguage]);

  // Translate using free API with better error handling and caching
  const translateText = async (text) => {
    if (!text || !text.trim()) {
      return;
    }

    const textToTranslate = text.trim();

    // Don't translate if already translating to avoid duplicate requests
    if (isTranslating) {
      return;
    }

    setIsTranslating(true);
    setError(''); // Clear any previous errors

    try {
      const sourceLang = selectedLanguage.split('-')[0];
      const targetLang = targetLanguage.split('-')[0];

      // If same language, no need to translate
      if (sourceLang === targetLang) {
        setTranslation(textToTranslate);
        setIsTranslating(false);
        return;
      }

      // Use Google Translate API through a CORS-friendly proxy
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();

      // Google Translate API returns array format: [[[translatedText, originalText, null, null, 3]]]
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const translatedText = data[0].map(item => item[0]).join('');
        setTranslation(translatedText);
        setError(''); // Clear error on success
      } else {
        throw new Error('Invalid translation response');
      }
    } catch (err) {
      console.error('Translation error:', err);
      
      // Fallback: Try MyMemory API
      try {
        const sourceLang = selectedLanguage.split('-')[0];
        const targetLang = targetLanguage.split('-')[0];
        
        const fallbackResponse = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${sourceLang}|${targetLang}`
        );
        
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.responseData && fallbackData.responseData.translatedText) {
          setTranslation(fallbackData.responseData.translatedText);
          setError(''); // Clear error on success
        } else {
          throw new Error('Fallback API also failed');
        }
      } catch (fallbackErr) {
        console.error('Fallback translation also failed:', fallbackErr);
        setTranslation('⚠️ Translation temporarily unavailable. Please try again.');
        setError('Translation service temporarily unavailable');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      // Stop listening
      console.log('Stopping voice recognition...');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
      setIsListening(false);
      setInterimTranscript('');
    } else {
      // Start listening
      console.log('Starting voice recognition...');
      setError('');
      setIsListening(true);
      
      if (recognitionRef.current) {
        try {
          // Stop any existing recognition before starting
          recognitionRef.current.stop();
          
          // Start after a brief delay to ensure clean start
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              console.log('Voice recognition started successfully');
            } catch (err) {
              console.error('Error starting recognition:', err);
              if (err.message.includes('already started')) {
                // Recognition is already running, just set state
                console.log('Recognition was already running');
              } else {
                setError('Microphone access required. Please allow microphone permissions.');
                setIsListening(false);
              }
            }
          }, 100);
        } catch (err) {
          console.error('Error in voice recognition setup:', err);
          setError('Failed to start voice recognition. Please check microphone permissions.');
          setIsListening(false);
        }
      }
    }
  };

  const handleTextToSpeech = () => {
    const textToSpeak = translation || transcript;
    if (!textToSpeak || !textToSpeak.trim()) {
      return;
    }
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    // Wait a moment for cancel to complete
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(textToSpeak.trim());
        
        // Use target language if translation exists, otherwise use input language
        const speechLang = translation ? targetLanguage : selectedLanguage;
        const langCode = speechLang.split('-')[0]; // e.g., 'mr' from 'mr-IN'
        utterance.lang = speechLang;
        utterance.rate = accessibilitySettings?.voiceSpeed || 0.9; // Slightly slower for better clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Get available voices and try to find a matching one
        const voices = synthRef.current.getVoices();
        
        // Try multiple matching strategies
        let matchingVoice = null;
        
        // Strategy 1: Exact match with full locale (e.g., mr-IN)
        matchingVoice = voices.find(voice => 
          voice.lang.toLowerCase() === speechLang.toLowerCase()
        );
        
        if (!matchingVoice) {
          // Strategy 2: Match language code only (e.g., mr)
          matchingVoice = voices.find(voice => 
            voice.lang.toLowerCase().startsWith(langCode.toLowerCase())
          );
        }
        
        if (!matchingVoice) {
          // Strategy 3: For Indian languages, try to find ANY Hindi voice as fallback
          // (since many can handle Devanagari script)
          const indianLangCodes = ['hi', 'mr', 'bn', 'te', 'ta', 'gu', 'kn', 'ml', 'pa'];
          if (indianLangCodes.includes(langCode)) {
            matchingVoice = voices.find(voice => 
              voice.lang.toLowerCase().startsWith('hi')
            );
          }
        }
        
        if (!matchingVoice) {
          // Strategy 4: Use any available voice from the same language family
          matchingVoice = voices.find(voice => 
            voice.name.toLowerCase().includes(langCode) ||
            voice.name.toLowerCase().includes(languages.find(l => l.code === speechLang)?.name.toLowerCase().split(' ')[0])
          );
        }
        
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        } else {
          
          // Use default voice but warn user
          setError(`Note: No ${languages.find(l => l.code === speechLang)?.name} voice found. Using default voice. Speech may not be accurate.`);
          setTimeout(() => setError(''), 6000);
        }
        
        utterance.onstart = () => {
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          setIsSpeaking(false);
          
          // Provide specific error messages
          const errorMessages = {
            'not-allowed': 'Speech permission denied. Please check browser settings.',
            'canceled': 'Speech was canceled.',
            'interrupted': 'Speech was interrupted.',
            'network': 'Network error during speech.',
            'synthesis-failed': 'Speech synthesis failed. Your system may not support this language.',
            'audio-hardware': 'Audio hardware error.',
          };
          
          const errorMsg = errorMessages[event.error] || `Text-to-speech failed (${event.error}). Your system may not have a ${languages.find(l => l.code === speechLang)?.name} voice installed.`;
          setError(errorMsg);
          
          // Auto-dismiss error after 6 seconds
          setTimeout(() => setError(''), 6000);
        };
        synthRef.current.speak(utterance);
        
      } catch (err) {
        setIsSpeaking(false);
        setError('Speech initialization failed. Please try again.');
        setTimeout(() => setError(''), 5000);
      }
    }, 100);
  };

  const stopSpeech = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  const copyToClipboard = (text) => {
    if (!text || !text.trim()) return;
    
    navigator.clipboard.writeText(text.trim()).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      setError('Failed to copy to clipboard');
    });
  };

  const clearAll = () => {
    setTranscript('');
    setInterimTranscript('');
    setTranslation('');
    setConfidence(0);
    setError('');
    setCopySuccess(false);
  };

  const downloadTranscript = () => {
    if (!transcript) return;
    const timestamp = new Date().toLocaleString();
    const content = `NEXUS Voice Assistant Transcript
Generated: ${timestamp}
Input Language: ${languages.find(l => l.code === selectedLanguage)?.name}
Target Language: ${languages.find(l => l.code === targetLanguage)?.name}
Confidence: ${confidence}%

ORIGINAL SPEECH:
${transcript}

TRANSLATION:
${translation || 'N/A'}
`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-transcript-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="voice" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background 3D Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">
              AI-Powered Voice Technology
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Multilingual Voice Assistant
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Speak naturally in your language. Our AI understands and translates
            in real-time with industry-leading accuracy.
          </p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">{error}</p>
                  <button
                    onClick={() => setError('')}
                    className="text-sm text-red-600 hover:text-red-700 mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Alert */}
        <AnimatePresence>
          {copySuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto mb-6"
            >
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-800 font-medium">Copied to clipboard!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Voice Control Panel */}
          <Card3D>
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">🎤 Voice Control</h3>
                <p className="text-gray-600">
                  {isListening ? '🔴 Listening... Speak now!' : 'Click microphone to start'}
                </p>
                {confidence > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Confidence: {confidence}%
                  </p>
                )}
              </div>

              {/* Microphone Visual */}
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                {/* Animated waves when listening */}
                {isListening && (
                  <>
                    <motion.div
                      className="absolute w-32 h-32 rounded-full bg-blue-400 opacity-20"
                      animate={{ scale: [1, 2.5, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute w-32 h-32 rounded-full bg-purple-400 opacity-20"
                      animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </>
                )}
                
                <motion.div
                  className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${
                    isListening
                      ? 'from-red-500 to-pink-500'
                      : 'from-blue-500 to-purple-500'
                  } flex items-center justify-center shadow-2xl cursor-pointer`}
                  onClick={handleVoiceInput}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isListening ? {
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.7)',
                      '0 0 0 20px rgba(239, 68, 68, 0)',
                    ],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: isListening ? Infinity : 0,
                  }}
                >
                  {isListening ? (
                    <CircleDot className="w-16 h-16 text-white" />
                  ) : (
                    <Mic className="w-16 h-16 text-white" />
                  )}
                </motion.div>
              </div>

            {/* Language Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎙️ Input Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isListening}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌍 Translate To
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button
                onClick={handleVoiceInput}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Start</span>
                  </>
                )}
              </button>

              <button
                onClick={isSpeaking ? stopSpeech : handleTextToSpeech}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isSpeaking
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
                disabled={!transcript && !translation}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-5 h-5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>Speak</span>
                  </>
                )}
              </button>

              <button
                onClick={clearAll}
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear</span>
              </button>
            </div>
            </div>
          </Card3D>

          {/* Transcript & Translation Display */}
          <div className="space-y-6">
            {/* Original Transcript */}
            <Card3D>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Original Speech</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">
                      {languages.find((l) => l.code === selectedLanguage)?.flag}
                    </span>
                    {transcript && (
                      <button
                        onClick={() => copyToClipboard(transcript)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="min-h-[120px] p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                  {transcript || interimTranscript ? (
                    <p className="text-gray-900 leading-relaxed">
                      {transcript}
                      <span className="text-gray-500 italic">{interimTranscript}</span>
                    </p>
                  ) : (
                    <p className="text-gray-400 italic text-center py-8">
                      🎤 Click "Start" and speak...
                    </p>
                  )}
                </div>
              </div>
            </Card3D>

            {/* Translation */}
            <Card3D>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Languages className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Translation</h4>
                    {isTranslating && (
                      <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">
                      {languages.find((l) => l.code === targetLanguage)?.flag}
                    </span>
                    {translation && (
                      <button
                        onClick={() => copyToClipboard(translation)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="min-h-[120px] p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                  {translation ? (
                    <p className="text-gray-900 leading-relaxed">{translation}</p>
                  ) : (
                    <p className="text-gray-400 italic text-center py-8">
                      🌍 Translation will appear here...
                    </p>
                  )}
                </div>
              </div>
            </Card3D>

            {/* Download Button */}
            {transcript && (
              <Card3D>
                <div className="p-4">
                  <button
                    onClick={downloadTranscript}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Transcript</span>
                  </button>
                </div>
              </Card3D>
            )}

            {/* Features List */}
            <motion.div 
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl p-6 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h4 className="font-semibold mb-4">✨ Real-Time Features</h4>
              <ul className="space-y-3">
                {[
                  '✅ Real Web Speech API',
                  '✅ 20+ Languages',
                  '✅ Live Translation',
                  '✅ Text-to-Speech',
                  '✅ Confidence Score',
                  '✅ Download & Copy',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceAssistant;
