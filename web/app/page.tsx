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
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Explore transaction history, contract deployments, and account activities on the Stacks blockchain with a premium, high-performance interface.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" onClick={() => authenticate()}>Connect Wallet</Button>
                <Link href="/history" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors">
                  View History <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            
            {/* Stats/Features Grid */}
            <div className="mt-16 flow-root sm:mt-24">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                 <Card title="Real-time Tracking">
                    <p className="text-gray-400">Monitor transactions as they happen with WebSocket integration via Chainhooks.</p>
                 </Card>
                 <Card title="Deep Analysis">
                    <p className="text-gray-400">Analyze contract interactions and token transfers with intuitive visualizations.</p>
                 </Card>
                 <Card title="Secure Connection">
                    <p className="text-gray-400">Connect securely using Stacks Connect or WalletConnect standards.</p>
                 </Card>
