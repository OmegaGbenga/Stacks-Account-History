import { useState } from 'react';
import { chainhooks } from '@/lib/chainhooks';

export function useTransactionMonitor(txId: string) {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | 'unknown'>('unknown');

  useEffect(() => {
    if (!txId) return;

    // Simulate polling or websocket subscription
    const interval = setInterval(() => {
       // logic to check status
       console.log("Checking tx", txId);
