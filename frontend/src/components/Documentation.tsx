import React from 'react';
import { ArrowLeft, Shield, Zap, Lock, Terminal, Box, Activity } from 'lucide-react';

interface DocumentationProps {
  onBack: () => void;
}

export const Documentation: React.FC<DocumentationProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#07090D] text-[#e5e2e2] font-body-md overflow-x-hidden selection:bg-[#00dbe7]/30 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-[#07090D]/80 backdrop-blur-xl border-b border-white/10">
        <nav className="flex justify-between items-center px-8 md:px-[80px] py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3">
            <img alt="CipherAlpha Logo" className="h-10 w-10" src="https://lh3.googleusercontent.com/aida/AP1WRLuxjjXm7B5UhuzeY7wJN7ET6SdgjVx8WJKCiw4nQTXqA9hkt3fwt1uWGZubRDVZmPCCHHgz3vwdhZAnq4PzwPb9q9nPVge2l06xuUCqjkzYcNmomU54JIp9ISYiIfS_SAOl5dgUI5QH-YICHLftUrKQNgOW7ydPS7L53ZXOPbJosy_KmyS0qq1C-Kp41SEc16LtpBihGKRfjQuMcxNFx9WnQkiYkm91SYD2lfpOWEvLBlO0iot71QoG6pg" />
            <span className="font-h3 text-[24px] font-semibold tracking-tighter text-[#c5c6cc]">CipherAlpha Docs</span>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#c6c6cb] hover:text-[#00dbe7] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </nav>
      </header>

      <main className="max-w-[1000px] mx-auto px-8 mt-16 space-y-24">
        
        {/* Intro */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="font-code-label text-[14px] text-[#00dbe7] uppercase tracking-widest">Version 1.0</span>
          </div>
          <h1 className="font-h1 text-[48px] md:text-[64px] font-bold text-[#e5e2e2] leading-[1.1]">
            CipherAlpha <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00dbe7] to-[#00e476]">
              Developer Documentation
            </span>
          </h1>
          <p className="font-body-lg text-[20px] text-[#c6c6cb] max-w-2xl leading-relaxed">
            Welcome to the official documentation for CipherAlpha. Learn how our Fully Homomorphic Encryption (FHE) infrastructure powers confidential AI agents for Web3 investing.
          </p>
        </section>

        {/* Architecture Overview */}
        <section className="space-y-8">
          <h2 className="font-h2 text-[32px] font-semibold border-b border-white/10 pb-4">Architecture Overview</h2>
          <p className="text-[#c6c6cb] text-[16px] leading-relaxed">
            CipherAlpha leverages a multi-agent system combined with Fhenix's Fully Homomorphic Encryption (FHE) rollups. This allows AI agents to compute complex trading strategies and risk analysis without ever exposing the user's raw portfolio data or token balances.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#00e476]/50 transition-colors">
              <Shield className="w-10 h-10 text-[#00e476] mb-4" />
              <h3 className="text-[20px] font-bold mb-2">1. Local Encryption (CoFHE.js)</h3>
              <p className="text-[#c6c6cb] text-[14px] leading-relaxed">
                All sensitive data, such as wallet balances and asset allocations, are encrypted locally on the user's client using CoFHE.js before ever touching the network.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#00dbe7]/50 transition-colors">
              <Terminal className="w-10 h-10 text-[#00dbe7] mb-4" />
              <h3 className="text-[20px] font-bold mb-2">2. FHE Computation</h3>
              <p className="text-[#c6c6cb] text-[14px] leading-relaxed">
                The encrypted data is sent to the Fhenix network. Smart contracts process this encrypted data homomorphically. The network does not know what data it is processing.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#d2bbff]/50 transition-colors">
              <Zap className="w-10 h-10 text-[#d2bbff] mb-4" />
              <h3 className="text-[20px] font-bold mb-2">3. Agent Arbitration</h3>
              <p className="text-[#c6c6cb] text-[14px] leading-relaxed">
                LangGraph-powered AI agents propose various DeFi strategies. An arbitration contract automatically selects the optimal path by evaluating the encrypted results.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#ffb4ab]/50 transition-colors">
              <Lock className="w-10 h-10 text-[#ffb4ab] mb-4" />
              <h3 className="text-[20px] font-bold mb-2">4. Client Decryption</h3>
              <p className="text-[#c6c6cb] text-[14px] leading-relaxed">
                The final encrypted recommendation is returned to the user, who uses their private key to decrypt the insight locally. Alpha remains strictly confidential.
              </p>
            </div>
          </div>
        </section>

        {/* Integration Details */}
        <section className="space-y-8">
          <h2 className="font-h2 text-[32px] font-semibold border-b border-white/10 pb-4">Integration Details</h2>
          
          <div className="space-y-6">
            <h3 className="text-[24px] font-medium text-[#e5e2e2] flex items-center gap-3">
              <Box className="w-6 h-6 text-[#00dbe7]" />
              Smart Contracts
            </h3>
            <p className="text-[#c6c6cb] leading-relaxed">
              Our contracts are written in Solidity using `@fhenixprotocol/contracts`. We utilize `euint32` and `euint64` data types to handle encrypted financial balances.
            </p>
            <div className="bg-[#131314] rounded-xl p-6 border border-white/10 overflow-x-auto">
              <pre className="font-code-label text-[14px] text-[#00dbe7]">
                <code className="text-[#ffb4ab]">import</code> <code className="text-[#c5c6cc]">"@fhenixprotocol/contracts/FHE.sol";</code><br/><br/>
                <code className="text-[#d2bbff]">function</code> <code className="text-[#c5c6cc]">calculateRisk(euint64 encryptedBalance)</code> <code className="text-[#d2bbff]">public view returns</code> <code className="text-[#c5c6cc]">(euint32) {'{'}</code><br/>
                {'    '}euint32 riskScore = FHE.mul(encryptedBalance, FHE.asEuint64(2));<br/>
                {'    '}<code className="text-[#ffb4ab]">return</code> riskScore;<br/>
                <code className="text-[#c5c6cc]">{'}'}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-6 mt-12">
            <h3 className="text-[24px] font-medium text-[#e5e2e2] flex items-center gap-3">
              <Activity className="w-6 h-6 text-[#00e476]" />
              AI Agents (LangGraph)
            </h3>
            <p className="text-[#c6c6cb] leading-relaxed">
              The backend utilizes LangChain and LangGraph to construct a multi-agent system. We use Groq's extremely fast inference to simulate hundreds of DeFi scenarios in seconds. Because the input state is encrypted, the LLMs only orchestrate the FHE contract calls rather than reading the raw data directly.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
};
