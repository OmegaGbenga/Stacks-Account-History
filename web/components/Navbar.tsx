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
    authenticate();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            StacksHistory
          </Link>
