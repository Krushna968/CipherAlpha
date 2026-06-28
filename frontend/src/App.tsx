import React from 'react';
import { Header } from './components/Header.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { AgentPanel } from './components/AgentPanel.tsx';
import { ChatWindow } from './components/ChatWindow.tsx';
import { Recommendation } from './components/Recommendation.tsx';
import { useMetaMask } from './hooks/useMetaMask.ts';
import { AlertCircle, Terminal, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const {
    wallet,
    loadingStates,
    portfolioData,
    fheAnalytics,
    agentResult,
    errorMsg,
    connectWallet,
    disconnectWallet,
    executeZKAnalytics,
    refreshDashboard
  } = useMetaMask();

  const isOrchestrating = loadingStates.runningAgents;

  return (
    <div className="font-body-md text-body-md min-h-screen flex flex-col bg-[#0b0f19]">
      {/* Top Navbar */}
      <Header 
        wallet={wallet} 
        connectWallet={connectWallet} 
        disconnectWallet={disconnectWallet} 
      />

      {/* Main Content Dashboard */}
      <main className="mt-24 px-6 md:px-12 w-full max-w-[1440px] mx-auto flex-grow flex flex-col gap-6 pb-12">
        {/* Error Alert Display */}
        {errorMsg && (
          <div className="glass-panel p-4 rounded-xl border-error/30 bg-error/10 text-error flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Execution Warning</p>
              <p className="text-xs opacity-90 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Top metrics row and configuration form */}
        <Portfolio 
          portfolioData={portfolioData}
          fheAnalytics={fheAnalytics}
          loadingStates={loadingStates}
          onRunAnalytics={executeZKAnalytics}
          isConnected={wallet.isConnected}
        />

        {/* Core Layout Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: ChatGPT dialogue panel */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <ChatWindow 
              fheAnalytics={fheAnalytics} 
              walletAddress={wallet.address} 
            />
          </div>

          {/* Right Side: LangGraph Agent status and Recommendations */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AgentPanel 
              isRunning={isOrchestrating} 
              agentResult={agentResult} 
            />
            
            <Recommendation 
              agentResult={agentResult} 
              walletAddress={wallet.address}
              onSuccess={refreshDashboard}
            />
          </div>
        </div>
      </main>

      {/* Dashboard Footer */}
      <footer className="w-full py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center mt-auto bg-[#0f131d] border-t border-outline-variant/30">
        <div className="flex flex-col gap-1 mb-4 md:mb-0 text-center md:text-left">
          <span className="font-label-md text-sm text-on-surface font-bold">CipherAlpha AI</span>
          <span className="font-label-sm text-[11px] text-on-surface-variant">© 2026 CipherAlpha AI. Built with Fhenix &amp; CoFHE.js</span>
        </div>
        
        <div className="flex gap-8 items-center">
          <div className="flex gap-4">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-[11px]" href="#">Terms</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-[11px]" href="#">Privacy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-[11px]" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-[11px]" href="https://docs.fhenix.zone" target="_blank" rel="noreferrer">Documentation</a>
          </div>
          
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer border border-outline-variant/30">
              <Terminal className="w-4.5 h-4.5" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer border border-outline-variant/30">
              <Share2 className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
