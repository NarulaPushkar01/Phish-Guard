import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    setError('');
    
    // Check extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'eml' && ext !== 'txt') {
      setError('Invalid file type. Only .eml and .txt files are supported.');
      return false;
    }
    
    // Check size (max 16MB)
    if (file.size > 16 * 1024 * 1024) {
      setError('File is too large. Maximum size is 16MB.');
      return false;
    }
    
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <form 
        className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] ${
          dragActive 
            ? 'border-cyber-neon bg-cyber-neon/5 scale-[1.02]' 
            : 'border-white/20 bg-cyber-800/30 hover:border-cyber-cyan/50 hover:bg-cyber-800/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onSubmit={(e) => e.preventDefault()}
      >
        <input 
          ref={inputRef} 
          type="file" 
          id="input-file-upload" 
          className="hidden" 
          accept=".eml,.txt" 
          onChange={handleChange} 
        />
        
        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div 
              key="upload-prompt"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 transition-colors ${dragActive ? 'bg-cyber-neon/20' : 'bg-cyber-900 border border-white/10'}`}>
                <UploadCloud className={`w-10 h-10 ${dragActive ? 'text-cyber-neon animate-bounce' : 'text-cyber-cyan'}`} />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Drag & Drop suspicious email</h3>
              <p className="text-sm text-gray-400 mb-6">Supports .eml and .txt formats (Max 16MB)</p>
              <button 
                type="button" 
                className="btn-neon"
                onClick={onButtonClick}
              >
                Browse Files
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="file-selected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-md"
            >
              <div className="bg-cyber-900 border border-cyber-cyan/30 rounded-lg p-4 flex items-center mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                <File className="w-10 h-10 text-cyber-cyan mr-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate" title={selectedFile.name}>{selectedFile.name}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={clearFile}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-cyber-800 rounded ml-2"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button 
                type="button"
                className="w-full btn-primary flex justify-center py-3"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'INITIATING SCAN...' : 'ANALYZE THREAT'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {dragActive && !selectedFile && (
          <div className="absolute inset-0 z-10 rounded-xl bg-cyber-900/60 flex items-center justify-center backdrop-blur-sm border-2 border-cyber-neon border-dashed">
            <p className="text-2xl font-bold text-cyber-neon font-mono animate-pulse">DROP TO UPLOAD</p>
          </div>
        )}
      </form>

      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
