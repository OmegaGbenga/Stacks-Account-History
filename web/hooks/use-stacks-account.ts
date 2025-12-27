import { useState, useEffect } from 'react';
import { getUserData, userSession } from '@/lib/stacks-connect';

export function useStacksAccount() {
  const [address, setAddress] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = getUserData();
      setAddress(userData?.profile?.stxAddress?.mainnet || null);
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
      setAddress(null);
    }
  }, []);

  return { address, isSignedIn };
