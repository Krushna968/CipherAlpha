import React from 'react';
import { WalletState } from '../hooks/useMetaMask.ts';

interface HeaderProps {
  wallet: WalletState;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

export const Header: React.FC<HeaderProps> = ({ wallet, connectWallet, disconnectWallet }) => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-3 max-w-[1440px] mx-auto bg-glass-bg backdrop-blur-xl border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-3">
        <img 
          alt="CipherAlpha AI Logo" 
          className="w-10 h-10 object-contain rounded-lg" 
          src="/logo.png" 
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida/AP1WRLtIB5e6bkSVsXOFPrQSQ4ihvQ4RO-pevh0cz3ARdIOwodv3qUiWs8Nfd2BAQ4Gu3Ekv7VxOnGaPDy_mrJ-xc1pakPFRAsrj2_tmwRI4lWLEXAJLfexXixboPARspmLZV2BNQ29zRKLAIFkLvoIl-D-tWpmrD4iFbWffQ6GnNm9Gcd08Yp395oupX0Yj22nkRGDUN03y1mH4FPOV7OvReGzYmBMGgicjucvhTo_WJdZvgoOe7CgtOUQbnr8";
          }}
        />
        <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">CipherAlpha AI</span>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <a className="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md transition-colors" href="#">Dashboard</a>
        <a className="text-on-surface-variant hover:text-primary pb-1 font-label-md text-label-md transition-colors" href="https://docs.fhenix.zone" target="_blank" rel="noreferrer">Fhenix Docs</a>
        <a className="text-on-surface-variant hover:text-primary pb-1 font-label-md text-label-md transition-colors" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
      <div className="flex items-center">
        {wallet.isConnected && wallet.address ? (
          <button 
            onClick={disconnectWallet}
            className="border border-tertiary/40 bg-tertiary/10 text-tertiary px-6 py-2 rounded-lg font-label-md text-label-md font-bold transition-all hover:bg-tertiary/20 scale-95 active:scale-90"
          >
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </button>
        ) : (
          <button 
            onClick={connectWallet}
            disabled={wallet.isConnecting}
            className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all scale-95 active:scale-90 disabled:opacity-50"
          >
            {wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  );
};
