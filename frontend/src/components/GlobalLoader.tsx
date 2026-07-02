import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Terminal } from 'lucide-react';
import './GlobalLoader.css';

interface GlobalLoaderContextType {
  triggerLoader: (callback: () => void | Promise<void>, customText?: string) => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(undefined);

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) throw new Error("useGlobalLoader must be used within a GlobalLoaderProvider");
  return context;
};

export const GlobalLoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('INITIALIZING FHE ENCLAVE...');

  const triggerLoader = async (callback: () => void | Promise<void>, customText?: string) => {
    setLoadingText(customText || 'INITIALIZING FHE ENCLAVE...');
    setIsLoading(true);
    
    // Simulate complex network/encryption delay
    setTimeout(async () => {
      await callback();
      setTimeout(() => {
        setIsLoading(false);
      }, 400); // Hold briefly after callback finishes
    }, 1200);
  };

  return (
    <GlobalLoaderContext.Provider value={{ triggerLoader }}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07090D]/95 backdrop-blur-2xl"
          >
            {/* Ambient Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[400px] h-[400px] bg-[#00dbe7]/10 blur-[100px] rounded-full animate-pulse-slow"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Spinning / Encrypting Core */}
              <div className="relative flex items-center justify-center w-32 h-32 mb-8">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-[#00dbe7]/30 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border border-[#00e476]/40 rounded-full"
                />
                <div className="absolute inset-4 bg-[#131314] rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,219,231,0.2)]">
                  <Terminal className="w-8 h-8 text-[#00dbe7] animate-pulse" />
                </div>
              </div>
              
              <h2 className="font-code-label text-[18px] text-[#00dbe7] tracking-[0.3em] mb-4 typewriter-text">
                {loadingText}
              </h2>
              
              {/* Progress bar container */}
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-[#00dbe7] to-[#00e476]"
                />
              </div>
              
              <div className="flex gap-4 mt-8 opacity-70">
                <div className="flex items-center gap-2 text-[12px] font-mono text-[#c6c6cb]">
                  <Lock className="w-3 h-3 text-[#00e476]" />
                  <span>End-to-End Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-mono text-[#c6c6cb]">
                  <Shield className="w-3 h-3 text-[#00dbe7]" />
                  <span>Zero-Knowledge</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlobalLoaderContext.Provider>
  );
};
