import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend directory .env
dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  groqApiKey: process.env.GROQ_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  fheSepoliaRpcUrl: process.env.FHE_SEPOLIA_RPC_URL || 'https://api.sepolia.fhenix.zone',
  cipherAlphaAddress: process.env.CIPHER_ALPHA_ADDRESS || '',
  privateKey: process.env.PRIVATE_KEY || '',
};

export const hasGroqKey = () => {
  return config.groqApiKey && !config.groqApiKey.includes('placeholder') && config.groqApiKey.startsWith('gsk_');
};

export const hasOpenAIKey = () => {
  return config.openaiApiKey && !config.openaiApiKey.includes('placeholder') && config.openaiApiKey.startsWith('sk-');
};
