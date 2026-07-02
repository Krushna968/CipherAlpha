import React, { useEffect } from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onStart: () => void;
  onViewDocs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onViewDocs }) => {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      const triggerBottom = window.innerHeight * 0.85;
      
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < triggerBottom) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    const handleMouseMove = (e: MouseEvent) => {
      const heroImage = document.querySelector('.parallax-img') as HTMLImageElement;
      if (heroImage) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="font-body-md selection:bg-secondary-fixed-dim/30 bg-[#07090D] text-[#e5e2e2] overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl border-b border-white/10 shadow-[0_0_24px_rgba(0,219,231,0.1)] transition-all duration-300 ease-in-out">
        <nav className="flex justify-between items-center px-8 md:px-[80px] py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3">
            <img alt="CipherAlpha Logo" className="h-10 w-10" src="https://lh3.googleusercontent.com/aida/AP1WRLuxjjXm7B5UhuzeY7wJN7ET6SdgjVx8WJKCiw4nQTXqA9hkt3fwt1uWGZubRDVZmPCCHHgz3vwdhZAnq4PzwPb9q9nPVge2l06xuUCqjkzYcNmomU54JIp9ISYiIfS_SAOl5dgUI5QH-YICHLftUrKQNgOW7ydPS7L53ZXOPbJosy_KmyS0qq1C-Kp41SEc16LtpBihGKRfjQuMcxNFx9WnQkiYkm91SYD2lfpOWEvLBlO0iot71QoG6pg" />
            <span className="font-h3 text-[32px] font-semibold tracking-tighter text-[#c5c6cc]">CipherAlpha</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[16px]">
            <a className="text-[#c5c6cc] border-b-2 border-[#c5c6cc] pb-1" href="#">Home</a>
            <a className="text-[#c6c6cb] hover:text-[#c5c6cc] transition-colors" href="#">Technology</a>
            <a className="text-[#c6c6cb] hover:text-[#c5c6cc] transition-colors" href="#">Features</a>
            <a className="text-[#c6c6cb] hover:text-[#c5c6cc] transition-colors" href="#">Security</a>
            <a className="text-[#c6c6cb] hover:text-[#c5c6cc] transition-colors" href="#">Documentation</a>
            <a className="text-[#c6c6cb] hover:text-[#c5c6cc] transition-colors" href="#">GitHub</a>
          </div>
        </nav>
      </header>

      <main className="relative pt-32 circuit-trace">
        <section className="max-w-[1440px] mx-auto px-8 md:px-[80px] min-h-[80vh] flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 space-y-8 reveal active">
            <div className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full border border-[#00e476]/20">
              <span className="w-2 h-2 rounded-full bg-[#00e476] status-pulse"></span>
              <span className="font-code-label text-[14px] text-[#00e476] uppercase tracking-widest">Powered by Fhenix FHE</span>
            </div>
            <h1 className="font-h1 text-[40px] md:text-[64px] font-bold text-[#e5e2e2] leading-[1.1]">Confidential AI for <span className="text-[#00dbe7]">Web3 Investing</span></h1>
            <p className="font-h3 text-[32px] font-light text-[#c6c6cb]">Intelligence Without Exposure</p>
            <p className="font-body-lg text-[18px] text-[#c6c6cb] max-w-lg">
              Leverage the power of Fully Homomorphic Encryption (FHE) to analyze your crypto portfolio with advanced AI models. Your data remains encrypted even during computation.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <button 
                onClick={onStart}
                className="bg-[#00dbe7] text-[#131314] px-8 py-4 rounded-xl font-bold text-[18px] hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,219,231,0.3)]"
              >
                Start Now
              </button>
              <button 
                onClick={onViewDocs}
                className="border border-[#45474b] hover:border-[#00dbe7] px-8 py-4 rounded-xl font-medium text-[18px] transition-all backdrop-blur-md"
              >
                View Documentation
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative reveal active" style={{ transitionDelay: '200ms' }}>
            <div className="absolute -inset-4 bg-[#00dbe7]/5 blur-[100px] rounded-full"></div>
            <img className="parallax-img relative z-10 w-full h-auto rounded-2xl border border-white/5 shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6oAIvw6mXDouEDRNd_9m-MJtmDrKJ3BQa-Pu75wK6A1p0iTSgIR8NEPrziyiUJIogMycyiewrcJlhHn_m4K1G1U2awNSx7FkGDvf0EDqfB7T02MatXGPgRyVNEavlQ879RmBfwanIzCly7yWe-KhX_tl8SwOVQhwZ5y5uJy2yaZLKlmXENIqSP8y2bRAgXs95-NbJb88rRlTqtgiuBfdl7-KF-ZwSptmIY1sfu_z33mYlXAx5h_ngry49k2o_OB5mdrMfS3j4gEI" alt="A cinematic, high-fidelity 3D visualization" />
          </div>
        </section>

        <section className="py-24 border-y border-[#45474b]/10 bg-[#131314]/30">
          <div className="max-w-[1440px] mx-auto px-8 md:px-[80px] text-center overflow-hidden">
            <p className="font-code-label text-[14px] text-[#c6c6cb] mb-10 uppercase tracking-widest">Integrating with the industry leaders</p>
            <div className="flex marquee items-center gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700 pr-20">
              <span className="font-h3 text-[32px] font-semibold">Fhenix</span>
              <span className="font-h3 text-[32px] font-semibold">CoFHE.js</span>
              <span className="font-h3 text-[32px] font-semibold">Monad</span>
              <span className="font-h3 text-[32px] font-semibold">MetaMask</span>
              <span className="font-h3 text-[32px] font-semibold">Ethereum</span>
              <span className="font-h3 text-[32px] font-semibold">Sepolia</span>
              <span className="font-h3 text-[32px] font-semibold">Arbitrum</span>
              <span className="font-h3 text-[32px] font-semibold">EigenLayer</span>
              {/* Duplicate set for infinite scroll */}
              <span className="font-h3 text-[32px] font-semibold" aria-hidden="true">Fhenix</span>
              <span className="font-h3 text-[32px] font-semibold" aria-hidden="true">CoFHE.js</span>
              <span className="font-h3 text-[32px] font-semibold" aria-hidden="true">Monad</span>
              <span className="font-h3 text-[32px] font-semibold" aria-hidden="true">MetaMask</span>
              <span className="font-h3 text-[32px] font-semibold" aria-hidden="true">Ethereum</span>
              <span className="font-h3 text-[32px] font-semibold" aria-hidden="true">Sepolia</span>
              <span className="font-h3 text-[32px] font-semibold" aria-hidden="true">Arbitrum</span>
              <span className="font-h3 text-[32px] font-semibold" aria-hidden="true">EigenLayer</span>
            </div>
          </div>
        </section>

        <section className="py-32 px-8 md:px-[80px] max-w-[1440px] mx-auto">
          <div className="mb-20 text-center reveal">
            <h2 className="font-h2 text-[48px] font-semibold mb-4">Infrastructure of Privacy</h2>
            <p className="font-body-lg text-[18px] text-[#c6c6cb] max-w-2xl mx-auto">Next-generation financial intelligence built on a foundation of cryptographic sovereignty.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-10 rounded-3xl reveal" style={{ transitionDelay: '100ms' }}>
              <span className="material-symbols-outlined text-4xl text-[#00dbe7] mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <h3 className="font-h3 text-[32px] font-semibold mb-4">Confidential AI</h3>
              <p className="text-[#c6c6cb] leading-relaxed">Our models process insights without ever seeing the raw data, thanks to groundbreaking FHE technology.</p>
            </div>
            <div className="glass-card p-10 rounded-3xl reveal" style={{ transitionDelay: '200ms' }}>
              <span className="material-symbols-outlined text-4xl text-[#00dbe7] mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              <h3 className="font-h3 text-[32px] font-semibold mb-4">Encrypted Analytics</h3>
              <p className="text-[#c6c6cb] leading-relaxed">View your portfolio risk and growth potential through a lens that ensures your balances remain private.</p>
            </div>
            <div className="glass-card p-10 rounded-3xl reveal" style={{ transitionDelay: '300ms' }}>
              <span className="material-symbols-outlined text-4xl text-[#00dbe7] mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <h3 className="font-h3 text-[32px] font-semibold mb-4">Private Smart Contracts</h3>
              <p className="text-[#c6c6cb] leading-relaxed">Deploy logic that executes based on hidden variables, preventing frontrunning and alpha leakage.</p>
            </div>
            <div className="glass-card p-10 rounded-3xl reveal" style={{ transitionDelay: '400ms' }}>
              <span className="material-symbols-outlined text-4xl text-[#00dbe7] mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              <h3 className="font-h3 text-[32px] font-semibold mb-4">Risk Intelligence</h3>
              <p className="text-[#c6c6cb] leading-relaxed">Real-time threat detection across DeFi protocols, tailored to your specific asset holdings privately.</p>
            </div>
            <div className="glass-card p-10 rounded-3xl reveal" style={{ transitionDelay: '500ms' }}>
              <span className="material-symbols-outlined text-4xl text-[#00dbe7] mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <h3 className="font-h3 text-[32px] font-semibold mb-4">DeFi Optimization</h3>
              <p className="text-[#c6c6cb] leading-relaxed">Maximize yield across multiple chains using AI agents that understand complex liquidity dynamics.</p>
            </div>
            <div className="glass-card p-10 rounded-3xl reveal" style={{ transitionDelay: '600ms' }}>
              <span className="material-symbols-outlined text-4xl text-[#00dbe7] mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>vpn_key</span>
              <h3 className="font-h3 text-[32px] font-semibold mb-4">User Controlled</h3>
              <p className="text-[#c6c6cb] leading-relaxed">You own the keys. You own the data. You own the results. Total sovereign intelligence.</p>
            </div>
          </div>
        </section>

        <section className="py-32 bg-[#0e0e0e]/50">
          <div className="max-w-[1440px] mx-auto px-8 md:px-[80px]">
            <div className="mb-20 reveal">
              <h2 className="font-h2 text-[48px] font-semibold mb-4">The Encryption Pipeline</h2>
              <p className="font-body-lg text-[18px] text-[#c6c6cb]">How CipherAlpha maintains 100% data confidentiality.</p>
            </div>
            <div className="relative flex flex-col md:flex-row justify-between items-start gap-8 py-10 overflow-x-auto no-scrollbar">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-[#00dbe7]/5 via-[#00dbe7]/50 to-[#00dbe7]/5 hidden md:block"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center min-w-[140px] reveal">
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-4 border-[#00dbe7]/40 shadow-[0_0_15px_rgba(0,219,231,0.2)]">
                  <span className="material-symbols-outlined text-[#00dbe7]">account_balance_wallet</span>
                </div>
                <p className="font-code-label text-xs uppercase tracking-tighter">Wallet</p>
              </div>
              
              <div className="hidden md:flex items-center pt-8">
                <span className="material-symbols-outlined text-[#00dbe7]/30">chevron_right</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center min-w-[140px] reveal" style={{ transitionDelay: '100ms' }}>
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-4 border-[#00dbe7]/40">
                  <span className="material-symbols-outlined text-[#00dbe7]">lock</span>
                </div>
                <p className="font-code-label text-xs uppercase tracking-tighter">Encrypted Portfolio</p>
              </div>

              <div className="hidden md:flex items-center pt-8">
                <span className="material-symbols-outlined text-[#00dbe7]/30">chevron_right</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center min-w-[140px] reveal" style={{ transitionDelay: '200ms' }}>
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-4 border-[#00dbe7]/40">
                  <span className="material-symbols-outlined text-[#00dbe7]">terminal</span>
                </div>
                <p className="font-code-label text-xs uppercase tracking-tighter">Fhenix FHE</p>
              </div>

              <div className="hidden md:flex items-center pt-8">
                <span className="material-symbols-outlined text-[#00dbe7]/30">chevron_right</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center min-w-[140px] reveal" style={{ transitionDelay: '300ms' }}>
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-4 border-[#00dbe7]/40">
                  <span className="material-symbols-outlined text-[#00dbe7]">smart_toy</span>
                </div>
                <p className="font-code-label text-xs uppercase tracking-tighter">AI Agents</p>
              </div>

              <div className="hidden md:flex items-center pt-8">
                <span className="material-symbols-outlined text-[#00dbe7]/30">chevron_right</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center min-w-[140px] reveal" style={{ transitionDelay: '400ms' }}>
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-4 border-[#00dbe7]/40">
                  <span className="material-symbols-outlined text-[#00dbe7]">gavel</span>
                </div>
                <p className="font-code-label text-xs uppercase tracking-tighter">Arbitration</p>
              </div>

              <div className="hidden md:flex items-center pt-8">
                <span className="material-symbols-outlined text-[#00dbe7]/30">chevron_right</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center min-w-[140px] reveal" style={{ transitionDelay: '500ms' }}>
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-4 border-[#00dbe7]/40">
                  <span className="material-symbols-outlined text-[#00dbe7]">visibility_off</span>
                </div>
                <p className="font-code-label text-xs uppercase tracking-tighter">Private Recs</p>
              </div>

              <div className="hidden md:flex items-center pt-8">
                <span className="material-symbols-outlined text-[#00dbe7]/30">chevron_right</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center min-w-[140px] reveal" style={{ transitionDelay: '600ms' }}>
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-4 border-[#00e476] shadow-[0_0_15px_rgba(0,228,118,0.3)]">
                  <span className="material-symbols-outlined text-[#00e476]">key_visualizer</span>
                </div>
                <p className="font-code-label text-xs uppercase tracking-tighter">User Decrypts</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-8 md:px-[80px] max-w-[1440px] mx-auto">
          <div className="relative glass-card rounded-[40px] p-8 md:p-16 overflow-hidden reveal">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#00e476]/10 blur-[100px]"></div>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/3">
                <h2 className="font-h2 text-[48px] font-semibold mb-6">Built for Terminal Speed</h2>
                <p className="font-body-lg text-[18px] text-[#c6c6cb] mb-8">CipherAlpha's dashboard provides a bird's eye view of your financial health across 12+ chains, all under a cloak of privacy.</p>
                <div className="flex items-center gap-3 text-[#00e476] font-code-label text-[14px]">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span>Powered by Confidential AI</span>
                </div>
              </div>
              <div className="md:w-2/3 glass-card rounded-2xl p-1 border-white/10 shadow-2xl overflow-hidden">
                <img className="w-full h-auto rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpLLkz0tsJ5HDI5mNTaBTTXgHkKyf7jyMO9I0Ln9VTm1Awd0XImHppbk0Z0bCELw00vZlmZCxjem38cMo8diFjuOkdm5rIRyPnUW6X-ZAfAsSsCaQ_TKzyM1ypyvEq4qyHTsHVYo0stKmwHPW52YStr49-bgRWmOMy-sALg9KiIb0KlZhM383PSDZ9Pc8TyHHCie9_CQlsHdiT2yU3ONd0QhfOEQ5n51C-L5Ivhur49qYJUJ4iVDa3QCxslXCKEFUaOwpfByz6Is" alt="Dashboard interface" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-8 md:px-[80px] max-w-[1440px] mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="font-h2 text-[48px] font-semibold">Why Confidentiality Matters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-10 border-red-500/20 reveal">
              <h3 className="font-h3 text-[32px] font-semibold mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">warning</span>
                Traditional AI
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 text-[#c6c6cb]">
                  <span className="material-symbols-outlined text-red-500/50 mt-1">close</span>
                  <span>Data is decrypted on centralized servers before processing.</span>
                </li>
                <li className="flex items-start gap-4 text-[#c6c6cb]">
                  <span className="material-symbols-outlined text-red-500/50 mt-1">close</span>
                  <span>Exposure risk to platform hacks and internal leaks.</span>
                </li>
                <li className="flex items-start gap-4 text-[#c6c6cb]">
                  <span className="material-symbols-outlined text-red-500/50 mt-1">close</span>
                  <span>Models can 'memorize' your private financial history.</span>
                </li>
                <li className="flex items-start gap-4 text-[#c6c6cb]">
                  <span className="material-symbols-outlined text-red-500/50 mt-1">close</span>
                  <span>Third-party tracking of your alpha and strategy.</span>
                </li>
              </ul>
            </div>
            <div className="glass-card rounded-3xl p-10 border-[#00e476]/20 reveal" style={{ transitionDelay: '200ms' }}>
              <h3 className="font-h3 text-[32px] font-semibold mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00e476]">verified</span>
                CipherAlpha
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 text-[#e5e2e2]">
                  <span className="material-symbols-outlined text-[#00e476] mt-1">check_circle</span>
                  <span>Computations happen on fully encrypted data via FHE.</span>
                </li>
                <li className="flex items-start gap-4 text-[#e5e2e2]">
                  <span className="material-symbols-outlined text-[#00e476] mt-1">check_circle</span>
                  <span>No entity—not even us—can ever see your raw balances.</span>
                </li>
                <li className="flex items-start gap-4 text-[#e5e2e2]">
                  <span className="material-symbols-outlined text-[#00e476] mt-1">check_circle</span>
                  <span>Decryption only happens locally on your device.</span>
                </li>
                <li className="flex items-start gap-4 text-[#e5e2e2]">
                  <span className="material-symbols-outlined text-[#00e476] mt-1">check_circle</span>
                  <span>On-chain privacy preserves your strategic edge.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-32 px-8 md:px-[80px] max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-8 glass-card rounded-2xl reveal">
              <p className="font-stat-value text-[48px] font-bold text-[#00dbe7] mb-2">1.2M+</p>
              <p className="font-code-label text-[#c6c6cb] text-xs uppercase">Encrypted Computations</p>
            </div>
            <div className="text-center p-8 glass-card rounded-2xl reveal" style={{ transitionDelay: '100ms' }}>
              <p className="font-stat-value text-[48px] font-bold text-[#00dbe7] mb-2">450K</p>
              <p className="font-code-label text-[#c6c6cb] text-xs uppercase">AI Decisions</p>
            </div>
            <div className="text-center p-8 glass-card rounded-2xl reveal" style={{ transitionDelay: '200ms' }}>
              <p className="font-stat-value text-[48px] font-bold text-[#00e476] mb-2">0</p>
              <p className="font-code-label text-[#c6c6cb] text-xs uppercase">Data Exposure</p>
            </div>
            <div className="text-center p-8 glass-card rounded-2xl reveal" style={{ transitionDelay: '300ms' }}>
              <p className="font-stat-value text-[48px] font-bold text-[#00dbe7] mb-2">100%</p>
              <p className="font-code-label text-[#c6c6cb] text-xs uppercase">User Ownership</p>
            </div>
          </div>
        </section>

        <section className="py-32 px-8 md:px-[80px] max-w-[1440px] mx-auto text-center reveal">
          <div className="max-w-4xl mx-auto glass-card rounded-[40px] p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00dbe7]/10 via-transparent to-[#00e476]/10 pointer-events-none"></div>
            <h2 className="font-h1 text-[40px] md:text-[64px] font-bold mb-8">Secure Your Financial Future</h2>
            <p className="font-body-lg text-[18px] text-[#c6c6cb] mb-12 max-w-xl mx-auto">Join the private financial revolution today. Encrypt your alpha with CipherAlpha.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={onStart}
                className="bg-[#00dbe7] text-[#131314] px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(0,219,231,0.4)]"
              >
                Get Started Now
              </button>
              <button className="glass-card px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border border-white/20">
                Join Discord
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 border-t border-[#45474b]/30 bg-[#0e0e0e] mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 md:px-[80px] max-w-[1440px] mx-auto gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img alt="CipherAlpha Logo" className="h-8 w-8" src="https://lh3.googleusercontent.com/aida/AP1WRLuxjjXm7B5UhuzeY7wJN7ET6SdgjVx8WJKCiw4nQTXqA9hkt3fwt1uWGZubRDVZmPCCHHgz3vwdhZAnq4PzwPb9q9nPVge2l06xuUCqjkzYcNmomU54JIp9ISYiIfS_SAOl5dgUI5QH-YICHLftUrKQNgOW7ydPS7L53ZXOPbJosy_KmyS0qq1C-Kp41SEc16LtpBihGKRfjQuMcxNFx9WnQkiYkm91SYD2lfpOWEvLBlO0iot71QoG6pg" />
              <span className="font-h3 text-[32px] font-semibold text-[#e5e2e2]">CipherAlpha</span>
            </div>
            <p className="font-body-md text-[#c6c6cb] max-w-xs">Privacy by Design. Intelligence by Encryption. The future of Web3 asset management.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="flex flex-col gap-3">
              <p className="font-code-label text-[#c5c6cc] uppercase">Platform</p>
              <a className="text-[#c6c6cb] hover:text-[#00e476] transition-colors" href="#">Launch App</a>
              <a className="text-[#c6c6cb] hover:text-[#00e476] transition-colors" href="#">Security Audit</a>
              <a className="text-[#c6c6cb] hover:text-[#00e476] transition-colors" href="#">Bug Bounty</a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-code-label text-[#c5c6cc] uppercase">Developers</p>
              <a className="text-[#c6c6cb] hover:text-[#00e476] transition-colors" href="#">Documentation</a>
              <a className="text-[#c6c6cb] hover:text-[#00e476] transition-colors" href="#">GitHub</a>
              <a className="text-[#c6c6cb] hover:text-[#00e476] transition-colors" href="#">API Reference</a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-code-label text-[#c5c6cc] uppercase">Community</p>
              <a className="text-[#c6c6cb] hover:text-[#00e476] transition-colors" href="#">Twitter</a>
              <a className="text-[#c6c6cb] hover:text-[#00e476] transition-colors" href="#">Discord</a>
              <a className="text-[#c6c6cb] hover:text-[#00e476] transition-colors" href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="px-8 md:px-[80px] max-w-[1440px] mx-auto mt-16 pt-8 border-t border-[#45474b]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-code-label text-[14px] text-[#c6c6cb]">© 2024 CipherAlpha. Powered by Fhenix.</p>
          <div className="flex gap-6">
            <a className="font-code-label text-[14px] text-[#c6c6cb] hover:text-[#00dbe7] transition-colors" href="#">Terms of Service</a>
            <a className="font-code-label text-[14px] text-[#c6c6cb] hover:text-[#00dbe7] transition-colors" href="#">Legal Disclosure</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
