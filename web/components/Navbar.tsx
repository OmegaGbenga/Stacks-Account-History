import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import { authenticate, getUserData } from '@/lib/stacks-connect';
import { initWalletConnect } from '@/lib/wallet-connect';

export const Navbar = () => {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

  const handleLogin = () => {
