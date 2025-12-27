import { ChainhooksClient } from '@hirosystems/chainhooks-client';

const API_KEY = process.env.NEXT_PUBLIC_HIRO_API_KEY;

/**
 * Setup Chainhooks client
 */
export const chainhooks = new ChainhooksClient({
