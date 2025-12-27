"use client";

import { useStacks } from "@/hooks/use-stacks";
import WalletSearch from "@/components/wallet-search";
import { SearchHistoryList } from "@/components/search-history-list";

export default function Home() {
  const { userData } = useStacks();

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Stacks Account History</h1>
        <span className="text-gray-400">
          Connect your wallet or search for an address
        </span>
      </div>
      <WalletSearch />
      {userData && <SearchHistoryList />}
    </main>
  );
}import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { authenticate } from '@/lib/stacks-connect';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />
      
      <div className="relative isolate pt-14">
        {/* Hero Section */}
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Stacks Account History
