import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

const KeyboardShortcutsOverlay = ({ isOpen, onClose }) => {
  const shortcuts = [
    {
      category: 'Voice Assistant',
      keys: [
        { combo: 'Space', action: 'Start/Stop voice recognition' },
        { combo: 'S', action: 'Speak translation aloud' },
        { combo: 'C', action: 'Copy transcript to clipboard' },
        { combo: 'D', action: 'Download transcript file' },
        { combo: 'L', action: 'Clear all transcripts' },
      ],
    },
    {
      category: 'Navigation',
      keys: [
        { combo: 'Tab', action: 'Move to next element' },
        { combo: 'Shift + Tab', action: 'Move to previous element' },
        { combo: 'Enter', action: 'Activate selected element' },
        { combo: 'Esc', action: 'Close dialog or cancel action' },
        { combo: '/', action: 'Focus search input' },
      ],
    },
    {
      category: 'Accessibility',
      keys: [
        { combo: 'A', action: 'Open accessibility panel' },
        { combo: 'T', action: 'Increase text size' },
        { combo: 'Shift + T', action: 'Decrease text size' },
        { combo: 'H', action: 'Toggle high contrast mode' },
        { combo: 'M', action: 'Toggle dark mode' },
      ],
    },
    {
      category: 'General',
      keys: [
        { combo: '?', action: 'Show this help (keyboard shortcuts)' },
        { combo: 'Ctrl + K', action: 'Open command palette' },
        { combo: 'Ctrl + S', action: 'Save preferences' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Keyboard className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                      <p className="text-blue-100 text-sm">
                        Navigate faster with these shortcuts
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid md:grid-cols-2 gap-8">
                  {shortcuts.map((category, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                        <span>{category.category}</span>
                      </h3>
                      <div className="space-y-3">
                        {category.keys.map((shortcut, keyIdx) => (
                          <div
                            key={keyIdx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-gray-700 text-sm">
                              {shortcut.action}
                            </span>
                            <div className="flex items-center space-x-1">
                              {shortcut.combo.split('+').map((key, i) => (
                                <React.Fragment key={i}>
                                  {i > 0 && (
                                    <span className="text-gray-400 text-xs">+</span>
                                  )}
                                  <kbd className="px-3 py-1.5 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-900 shadow-sm">
                                    {key.trim()}
                                  </kbd>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Tip */}
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">💡 Pro Tip:</span> Press{' '}
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-bold">
                      ?
                    </kbd>{' '}
                    anytime to open this shortcuts panel
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsOverlay;
