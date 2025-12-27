import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

const PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo-id';

/**
 * Initialize WalletConnect Core
 */
const core = new Core({
  projectId: PROJECT_ID
