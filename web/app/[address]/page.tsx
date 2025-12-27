import { TransactionsList } from "@/components/txns-list";
import { fetchAddressTransactions } from "@/lib/fetch-address-transactions";
import { formatSTX } from "@/lib/stx-utils";
import { SaveToHistory } from "../../components/save-to-history";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

async function fetchAccountInfo(address: string) {
  try {
    const response = await fetch(
      `https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`,
      { next: { revalidate: 30 } }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching account info:", error);
    return null;
  }
}

export default async function Activity({
  params,
}: {
  params: { address: string };
}) {
  const { address } = params;

  const [initialTransactions, accountInfo] = await Promise.all([
    fetchAddressTransactions({ address }),
    fetchAccountInfo(address),
  ]);

  const stxBalance = accountInfo
    ? Number(accountInfo.stx.balance) / 1000000
    : 0;
  const lockedBalance = accountInfo
    ? Number(accountInfo.stx.locked) / 1000000
    : 0;
  const totalBalance = stxBalance + lockedBalance;

  return (
    <main className="flex h-[100vh-4rem] flex-col p-8 gap-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">{address}</h1>
        <Link
          href={`https://explorer.hiro.so/address/${address}`}
          target="_blank"
          className="rounded-lg flex gap-1 bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ExternalLink className="h-4 w-4" />
          View on Hiro
        </Link>
      </div>

      {accountInfo && (
        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="border border-gray-800 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatSTX(totalBalance)} STX
              </p>
            </div>

            <div className="border border-gray-800 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Available</p>
              <p className="text-2xl font-bold text-green-400">
                {formatSTX(stxBalance)} STX
              </p>
            </div>

            <div className="border border-gray-800 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Locked</p>
              <p className="text-2xl font-bold text-orange-400">
                {formatSTX(lockedBalance)} STX
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <p className="text-gray-400">
              Total Transactions:
              <span className="text-white font-semibold ml-2">
                {initialTransactions.total || 0}
              </span>
            </p>
          </div>
        </div>
      )}

      <SaveToHistory address={address} />

      <TransactionsList address={address} transactions={initialTransactions} />
    </main>
  );
}
