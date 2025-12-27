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
}