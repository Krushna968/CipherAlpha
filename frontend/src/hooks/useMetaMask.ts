import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import { FheHelper } from '../utils/fhe.ts';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Deployed Smart Contract ABI
const CONTRACT_ABI = [
  "function updatePortfolio(tuple(uint256 ctHash, uint8 securityZone, uint8 utype, bytes signature) _portfolioValue, tuple(uint256 ctHash, uint8 securityZone, uint8 utype, bytes signature) _investmentBudget, tuple(uint256 ctHash, uint8 securityZone, uint8 utype, bytes signature) _riskPreference, tuple(uint256 ctHash, uint8 securityZone, uint8 utype, bytes signature) _liquidityPct, tuple(uint256 ctHash, uint8 securityZone, uint8 utype, bytes signature) _diversificationPct, tuple(uint256 ctHash, uint8 securityZone, uint8 utype, bytes signature) _expectedApy, tuple(uint256 ctHash, uint8 securityZone, uint8 utype, bytes signature) _maxDrawdown, tuple(uint256 ctHash, uint8 securityZone, uint8 utype, bytes signature) _timeHorizon) public",
  "function computeAnalytics() public",
  "function requestDecryption() public",
  "function getAnalyticsDecrypted() public view returns (uint32 riskScore, uint32 diversificationScore, uint32 liquidityScore, uint32 yieldExposure, uint32 portfolioHealth)"
];

const CONTRACT_ADDRESS = "0x7C3aed633E72a812Dde1f84C3F052a559DE4e3FF"; // Default placeholder / deployed address
const BACKEND_URL = "http://localhost:3001/api";

export interface WalletState {
  address: string | null;
  ethBalance: string;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: string | null;
}

export const useMetaMask = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    ethBalance: '0.00',
    isConnected: false,
    isConnecting: false,
    chainId: null
  });

  const [loadingStates, setLoadingStates] = useState({
    encrypting: false,
    updatingContract: false,
    calculatingFhe: false,
    requestingDecrypt: false,
    runningAgents: false
  });

  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [fheAnalytics, setFheAnalytics] = useState<any>(null);
  const [agentResult, setAgentResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Connect Wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setErrorMsg("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    setWallet(prev => ({ ...prev, isConnecting: true }));
    setErrorMsg(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      
      const balanceRaw = await provider.getBalance(address);
      const ethBalance = formatEther(balanceRaw);
      
      const network = await provider.getNetwork();
      const chainId = network.chainId.toString();

      setWallet({
        address,
        ethBalance: parseFloat(ethBalance).toFixed(4),
        isConnected: true,
        isConnecting: false,
        chainId
      });

      // Fetch indexer portfolio details
      await fetchBackendPortfolio(address);
    } catch (e: any) {
      console.error("Wallet connection failed:", e);
      setErrorMsg(e.message || "Failed to connect wallet.");
      setWallet(prev => ({ ...prev, isConnecting: false }));
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setWallet({
      address: null,
      ethBalance: '0.00',
      isConnected: false,
      isConnecting: false,
      chainId: null
    });
    setPortfolioData(null);
    setFheAnalytics(null);
    setAgentResult(null);
    setErrorMsg(null);
  };

  // Fetch backend indexed portfolio (balances and assets)
  const fetchBackendPortfolio = async (address: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolioData(data);
      }
    } catch (e) {
      console.error("Failed to load portfolio indexes:", e);
    }
  };

  /**
   * Encrypts and Executes Zero-Knowledge Portfolio Analytics on Fhenix
   */
  const executeZKAnalytics = async (inputs: {
    portfolioValue: number;
    investmentBudget: number;
    riskPreference: number;
    liquidityPct: number;
    diversificationPct: number;
    expectedApy: number;
    maxDrawdown: number;
    timeHorizon: number;
  }) => {
    if (!wallet.address) return;
    setErrorMsg(null);

    try {
      // 1. Client-Side Encryption via CoFHE.js
      setLoadingStates(prev => ({ ...prev, encrypting: true }));
      const [
        encVal, encBudget, encRisk, encLiq, encDiv, encApy, encDraw, encTime
      ] = await Promise.all([
        FheHelper.encryptUint32(inputs.portfolioValue),
        FheHelper.encryptUint32(inputs.investmentBudget),
        FheHelper.encryptUint32(inputs.riskPreference),
        FheHelper.encryptUint32(inputs.liquidityPct),
        FheHelper.encryptUint32(inputs.diversificationPct),
        FheHelper.encryptUint32(inputs.expectedApy),
        FheHelper.encryptUint32(inputs.maxDrawdown),
        FheHelper.encryptUint32(inputs.timeHorizon)
      ]);
      setLoadingStates(prev => ({ ...prev, encrypting: false, updatingContract: true }));

      // 2. Submit Encrypted Payload to Fhenix L2 Sepolia
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.updatePortfolio(
        encVal, encBudget, encRisk, encLiq, encDiv, encApy, encDraw, encTime
      );
      await tx.wait();

      setLoadingStates(prev => ({ ...prev, updatingContract: false, calculatingFhe: true }));

      // 3. Trigger Homomorphic Arithmetic on Fhenix VM
      const calcTx = await contract.computeAnalytics();
      await calcTx.wait();

      setLoadingStates(prev => ({ ...prev, calculatingFhe: false, requestingDecrypt: true }));

      // 4. Request Decryption Tasks
      const decryptTx = await contract.requestDecryption();
      await decryptTx.wait();

      setLoadingStates(prev => ({ ...prev, requestingDecrypt: false }));

      // 5. Query Decrypted Analytics
      const res = await contract.getAnalyticsDecrypted();
      const analytics = {
        riskScore: Number(res[0]),
        diversificationScore: Number(res[1]),
        liquidityScore: Number(res[2]),
        yieldExposure: Number(res[3]),
        portfolioHealth: Number(res[4])
      };
      setFheAnalytics(analytics);

      // Trigger LangGraph AI Orchestration
      await triggerOrchestration();
    } catch (e: any) {
      console.error("ZK Execution Failed:", e);
      setErrorMsg(e.message || "Failed to execute FHE contract analytics.");
      // Reset loading states
      setLoadingStates({
        encrypting: false,
        updatingContract: false,
        calculatingFhe: false,
        requestingDecrypt: false,
        runningAgents: false
      });
      
      // Fallback: fetch simulated analytics and run orchestration so flow works 100% on any RPC
      await runSimulatedOrchestration();
    }
  };

  // Run LangGraph Orchestrator via Backend API
  const triggerOrchestration = async () => {
    if (!wallet.address) return;
    setLoadingStates(prev => ({ ...prev, runningAgents: true }));
    try {
      const res = await fetch(`${BACKEND_URL}/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: wallet.address })
      });
      if (res.ok) {
        const data = await res.json();
        setAgentResult(data);
      }
    } catch (e) {
      console.error("Agent run failed:", e);
    } finally {
      setLoadingStates(prev => ({ ...prev, runningAgents: false }));
    }
  };

  // Heuristics Fallback if contract fails or not deployed
  const runSimulatedOrchestration = async () => {
    if (!wallet.address) return;
    setLoadingStates(prev => ({ ...prev, runningAgents: true }));
    try {
      // Fetch simulated metrics from backend
      const resAnal = await fetch(`${BACKEND_URL}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: wallet.address })
      });
      if (resAnal.ok) {
        const analyticalData = await resAnal.json();
        setFheAnalytics(analyticalData);
      }

      // Run Orchestration
      const res = await fetch(`${BACKEND_URL}/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: wallet.address })
      });
      if (res.ok) {
        const data = await res.json();
        setAgentResult(data);
      }
    } catch (e) {
      console.error("Fallback agent run failed:", e);
    } finally {
      setLoadingStates(prev => ({ ...prev, runningAgents: false }));
    }
  };

  // Reload balances and reset stats
  const refreshDashboard = async () => {
    if (wallet.address) {
      await fetchBackendPortfolio(wallet.address);
      if (fheAnalytics) {
        await triggerOrchestration();
      }
    }
  };

  // Auto-connect listener
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: any) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet();
        }
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return {
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
  };
};
