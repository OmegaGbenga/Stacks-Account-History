import { ChainhooksClient } from '@hirosystems/chainhooks-client';

const API_KEY = process.env.NEXT_PUBLIC_HIRO_API_KEY;

/**
 * Setup Chainhooks client
 */
export const chainhooks = new ChainhooksClient({
    apiKey: API_KEY,
    network: 'mainnet' // or testnet
});

export async function registerHook(predicate: any) {
    try {
        const result = await chainhooks.register(predicate);
        return result;
    } catch (e) {
        console.error("Chainhook error", e);
        return null;
    }
