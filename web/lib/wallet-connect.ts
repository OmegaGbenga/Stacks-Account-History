import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

const PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo-id';

/**
 * Initialize WalletConnect Core
 */
const core = new Core({
  projectId: PROJECT_ID
});

export interface WalletConnectConfig {
    name: string;
    description: string;
    url: string;
    icons: string[];
}

/**
 * Initialize the Web3Wallet instance
 * @param config Configuration for the wallet metadata
 */
export const initWalletConnect = async (config: WalletConnectConfig) => {
  try {
    const web3wallet = await Web3Wallet.init({
      core,
      metadata: config
    });
    
    console.log('WalletConnect initialized');
    return web3wallet;
  } catch (err) {
    console.error('Failed to init WalletConnect', err);
    throw err;
  }
};
