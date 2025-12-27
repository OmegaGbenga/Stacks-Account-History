// Defer import of openContractCall to client runtime to avoid SSR issues
import {
  fetchCallReadOnlyFunction,
  principalCV,
  cvToValue,
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

// TODO: Replace after deployment
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'search-history';

export async function addToHistory(searchedAddress: string) {
  const functionArgs = [principalCV(searchedAddress)];

  const { openContractCall } = await import('@stacks/connect');

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'add-to-history',
    functionArgs,
    network: STACKS_MAINNET,
    appDetails: {
      name: 'Stacks Account History',
      icon: 'https://cryptologos.cc/logos/stacks-stx-logo.png',
    },
    onFinish: (data: any) => {
      console.log('Transaction:', data.txId);
    },
  };

  await openContractCall(options);
}

export async function getHistory(userAddress: string): Promise<string[]> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-history',
      functionArgs: [principalCV(userAddress)],
      network: STACKS_MAINNET,
      senderAddress: CONTRACT_ADDRESS,
    });

    const value = cvToValue(result);
    return value.value || [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

export async function clearHistory() {
  const { openContractCall } = await import('@stacks/connect');

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'clear-history',
    functionArgs: [],
    network: STACKS_MAINNET,
    appDetails: {
      name: 'Stacks Account History',
      icon: 'https://cryptologos.cc/logos/stacks-stx-logo.png',
    },
    onFinish: (data: any) => {
      console.log('Transaction:', data.txId);
    },
  };

  await openContractCall(options);
}