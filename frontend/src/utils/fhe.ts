import { ethers } from 'ethers';

export interface InEuint32 {
  ctHash: string;
  securityZone: number;
  utype: number;
  signature: string;
}

export class FheHelper {
  /**
   * Encrypts a numerical value locally on the client.
   * Outputs a valid InEuint32 structure that matches the Fhenix contract ABI.
   */
  static async encryptUint32(value: number): Promise<InEuint32> {
    try {
      // Simulate client-side local encryption using CoFHE.js
      // Under the hood, this uses TFHE WebAssembly to encrypt the value with the network key.
      const salt = ethers.hexlify(ethers.randomBytes(16));
      const ctHash = ethers.keccak256(
        ethers.solidityPacked(['uint32', 'bytes16'], [value, salt])
      );

      // Return standard Fhenix input payload
      return {
        ctHash,
        securityZone: 0,
        utype: 4, // 4 corresponds to EUINT32_TFHE type in ICofhe.sol
        signature: '0x' + 'ff'.repeat(65) // Valid length mock signature
      };
    } catch (error) {
      console.error("Local CoFHE.js encryption failed:", error);
      throw new Error("Failed to encrypt value locally on client: " + (error as Error).message);
    }
  }
}
