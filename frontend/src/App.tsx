import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar.tsx';
import { AgentPanel } from './components/AgentPanel.tsx';
import { ChatWindow } from './components/ChatWindow.tsx';
import { Recommendation } from './components/Recommendation.tsx';
import { useMetaMask } from './hooks/useMetaMask.ts';
import { ToastProvider, useToast } from './components/Toast.tsx';
import { Shield, Zap, Lock } from 'lucide-react';

const HeroScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mb-8"
    >
      <div className="absolute inset-0 bg-tertiary/20 blur-[60px] rounded-full" />
      <Shield className="w-24 h-24 text-tertiary relative z-10" />
    </motion.div>
    <motion.h2 
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
      className="text-4xl font-bold text-on-surface mb-4 tracking-tight"
    >
      Encrypted <span className="text-transparent bg-clip-text bg-gradient-to-r from-tertiary to-secondary">DeFi Intelligence</span>
    </motion.h2>
    <motion.p 
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
      className="text-on-surface-variant max-w-md mx-auto mb-8 font-mono text-xs leading-relaxed"
    >
      Connect your wallet to initialize the CoFHE.js secure enclave. 
      Zero-knowledge proofs and LangGraph agents will analyze your portfolio homomorphically.
    </motion.p>
    <motion.div 
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
      className="flex gap-4 justify-center"
    >
      <span className="flex items-center gap-2 text-[10px] text-on-surface-variant font-mono bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/20">
        <Lock className="w-3 h-3 text-secondary" /> FHE Secured
      </span>
      <span className="flex items-center gap-2 text-[10px] text-on-surface-variant font-mono bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/20">
        <Zap className="w-3 h-3 text-tertiary" /> Multi-Agent Active
      </span>
    </motion.div>
  </div>
);

const AppInner: React.FC = () => {
  const {
    wallet, loadingStates, portfolioData, fheAnalytics, agentResult, errorMsg,
    connectWallet, disconnectWallet, executeZKAnalytics, refreshDashboard,
  } = useMetaMask();

  const { showToast } = useToast();
  const [pipelineExecuted, setPipelineExecuted] = useState(false);

  const getPipelineStep = (): number => {
    if (pipelineExecuted) return 5;
    if (agentResult) return 4;
    if (loadingStates.runningAgents) return 3;
    if (loadingStates.updatingContract || loadingStates.calculatingFhe || loadingStates.requestingDecrypt) return 2;
    if (loadingStates.encrypting) return 1;
    return 0;
  };
  const pipelineStep = getPipelineStep();

  useEffect(() => {
    if (errorMsg) showToast('error', errorMsg, 'SYSTEM ERROR');
  }, [errorMsg, showToast]);

  useEffect(() => {
    if (agentResult?.selected) {
      showToast('success', `Agent [${agentResult.selected.agentName}] selected for execution.`, 'ARBITRATION COMPLETE');
    }
  }, [agentResult, showToast]);

  useEffect(() => {
    if (pipelineExecuted) {
      showToast('success', 'Strategy successfully verified on Fhenix L2.', 'EXECUTION CONFIRMED');
    }
  }, [pipelineExecuted, showToast]);

  useEffect(() => {
    if (loadingStates.encrypting) setPipelineExecuted(false);
  }, [loadingStates.encrypting]);

  return (
    <div className="font-sans text-on-surface min-h-screen h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-[0]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 w-full h-full max-w-[1600px] mx-auto p-4 flex flex-col lg:flex-row gap-4 overflow-hidden">
        
        {/* LEFT: Sidebar (3 cols) */}
        <div className="w-full lg:w-[25%] flex-shrink-0 flex flex-col gap-4">
          <Sidebar 
            wallet={wallet}
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
            portfolioData={portfolioData}
            fheAnalytics={fheAnalytics}
            loadingStates={loadingStates}
            onRunAnalytics={executeZKAnalytics}
          />
        </div>

        {/* CENTER: Chat / Hero (5 cols) */}
        <div className="w-full lg:w-[45%] flex flex-col h-full bg-surface-variant/30 rounded-2xl border border-outline-variant/30 backdrop-blur-xl relative overflow-hidden">
           <AnimatePresence mode="wait">
            {!wallet.isConnected ? (
              <motion.div key="hero" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
                <HeroScreen />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col">
                {/* Scanner effect when agents running */}
                {loadingStates.runningAgents && <div className="absolute inset-0 z-0 pointer-events-none scan-line opacity-50" />}
                <div className="relative z-10 h-full flex flex-col">
                  <ChatWindow fheAnalytics={fheAnalytics} walletAddress={wallet.address} />
                </div>
              </motion.div>
            )}
           </AnimatePresence>
        </div>

        {/* RIGHT: Agent Panel & Execution (4 cols) */}
        <div className="w-full lg:w-[30%] flex-shrink-0 flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide pr-2 pb-10">
          <AgentPanel 
            isRunning={loadingStates.runningAgents}
            agentResult={agentResult}
            pipelineStep={pipelineStep}
          />
          <Recommendation 
            agentResult={agentResult}
            portfolioData={portfolioData}
            walletAddress={wallet.address}
            onSuccess={async () => {
              setPipelineExecuted(true);
              await refreshDashboard();
            }}
          />
        </div>

      </main>
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppInner />
  </ToastProvider>
);

export default App;
