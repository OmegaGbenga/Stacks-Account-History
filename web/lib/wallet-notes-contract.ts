import { openContractCall } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  stringUtf8CV,
  principalCV,
  cvToJSON,
  callReadOnlyFunction,
} from '@stacks/transactions';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'wallet-notes';

// Save a note about an address
export async function saveNote(targetAddress: string, noteText: string) {
  const functionArgs = [
    principalCV(targetAddress),
    stringUtf8CV(noteText),
  ];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'save-note',
    functionArgs,
    network: new StacksMainnet(),
    anchorMode: AnchorMode.Any,
    appDetails: {
      name: 'Stacks Account History',
      icon: window.location.origin + '/vercel.svg',
    },
    onFinish: (data: any) => {
      console.log('Transaction ID:', data.txId);
      return data.txId;
    },
  };

  await openContractCall(options);
}

// Get a note about an address
export async function getNote(
  authorAddress: string,
  targetAddress: string
): Promise<string | null> {
  const functionArgs = [
    principalCV(authorAddress),
    principalCV(targetAddress),
  ];

  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-note',
      functionArgs,
      network: new StacksMainnet(),
      senderAddress: authorAddress,
    });

    const json = cvToJSON(result);
    
    if (json.value && json.value.value && json.value.value.note) {
      return json.value.value.note.value;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

// Delete a note
export async function deleteNote(targetAddress: string) {
  const functionArgs = [principalCV(targetAddress)];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'delete-note',
    functionArgs,
    network: new StacksMainnet(),
    anchorMode: AnchorMode.Any,
    appDetails: {
      name: 'Stacks Account History',
      icon: window.location.origin + '/vercel.svg',
    },
    onFinish: (data: any) => {
      console.log('Transaction ID:', data.txId);
      return data.txId;
    },
  };

  await openContractCall(options);
}