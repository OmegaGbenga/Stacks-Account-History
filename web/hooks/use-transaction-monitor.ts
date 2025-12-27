import { useState } from 'react';
import { chainhooks } from '@/lib/chainhooks';

export function useTransactionMonitor(txId: string) {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | 'unknown'>('unknown');

  useEffect(() => {
