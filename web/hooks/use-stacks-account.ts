import { useState, useEffect } from 'react';
import { getUserData, userSession } from '@/lib/stacks-connect';

export function useStacksAccount() {
  const [address, setAddress] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
