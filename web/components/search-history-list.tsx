"use client";

import { useState, useEffect } from 'react';
import { useStacks } from '@/hooks/use-stacks';
import { getHistory, clearHistory } from '@/lib/search-history';
import { abbreviateAddress } from '@/lib/stx-utils';
import Link from 'next/link';
import { History, Trash2 } from 'lucide-react';

export function SearchHistoryList() {
  const { userData } = useStacks();
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (userData && showHistory) {
      loadHistory();
    }
  }, [userData, showHistory]);

  const loadHistory = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      const addresses = await getHistory(userData.profile.stxAddress.mainnet);
      setHistory(addresses);
    } catch (error) {
      console.error('Error loading history:', error);
    }
    setLoading(false);
  };

  const handleClear = async () => {
    if (!confirm('Clear all search history?')) return;
    
    setLoading(true);
    try {
      await clearHistory();
      setHistory([]);
      alert('History cleared! Wait for transaction to confirm.');
    } catch (error) {
      alert('Failed to clear history');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <button
        onClick={() => setShowHistory(!showHistory)}
        disabled={!userData}
        aria-disabled={!userData}
        title={userData ? "Toggle search history" : "Connect wallet to view history"}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors w-full justify-center ${
          userData
            ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
            : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed"
        }`}
      >
        <History className="h-4 w-4" />
        {showHistory ? 'Hide' : 'Show'} My Search History ({history.length})
      </button>

      {!userData && (
        <p className="text-gray-500 text-center text-sm mt-2">
          Connect your wallet to view your saved search history.
        </p>
      )}

      {showHistory && userData && (
        <div className="mt-4 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Saved Searches</h3>
            {history.length > 0 && (
              <button
                onClick={handleClear}
                disabled={loading}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
                Clear All
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-gray-400 text-center py-4">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No saved searches yet. Click "Save" on any address page to add it here.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((address, index) => (
                <Link
                  key={index}
                  href={`/${address}`}
                  className="block p-3 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{abbreviateAddress(address)}</span>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


