import { ethers, Signer } from 'ethers';
import { createCofheClient, createCofheConfig } from '@cofhe/sdk/web';
import { Encryptable } from '@cofhe/sdk';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

export interface InEuint32 {
  ctHash: string;
  securityZone: number;
  utype: number;
  signature: string;
}

export class FheHelper {
  /**
   * Encrypts a numerical value locally on the client using the official CoFHE SDK.
   * Outputs a valid InEuint32 structure that passes true zero-knowledge verification on Sepolia.
   */
  static async encryptUint32(value: number, signer: Signer): Promise<InEuint32> {
    try {
      const config = createCofheConfig({
        environment: 'web',
        supportedChains: []
      } as any);
      
      const cofheClient = createCofheClient(config);
      const account = await signer.getAddress();

      // Connect the SDK to the browser wallet
      const transport = custom((window as any).ethereum);
      const publicClient = createPublicClient({ chain: sepolia, transport });
      const walletClient = createWalletClient({ chain: sepolia, transport });
      await cofheClient.connect(publicClient as any, walletClient as any);

      // encryptInputs generates the ZK proof needed for production CoFHE Coprocessors
      const encryptedData = await cofheClient
        .encryptInputs([Encryptable.uint32(BigInt(value))])
        .setAccount(account)
        .execute();

      const res = encryptedData[0];
      return {
        ctHash: ethers.toBeHex(res.ctHash, 32),
        securityZone: res.securityZone,
        utype: res.utype,
        signature: res.signature
      };
    } catch (error) {
      console.error("Local encryption failed:", error);
      throw new Error("Failed to encrypt value: " + (error as Error).message);
    }
  }
}
