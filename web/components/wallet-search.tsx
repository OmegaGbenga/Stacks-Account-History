'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WalletSearch() {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Function to validate Stacks address
  const isValidStacksAddress = (addr: string): boolean => {
    // Stacks mainnet addresses start with 'SP' 
    // Stacks testnet addresses start with 'ST'
    return (addr.startsWith('SP') || addr.startsWith('ST')) && addr.length >= 39;
  };

  // Handle the search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError('');

    // Remove any whitespace from the address
    const trimmedAddress = address.trim();

    // Validate the address
    if (!trimmedAddress) {
      setError('Please enter a Stacks address');
      return;
    }

    if (!isValidStacksAddress(trimmedAddress)) {
      setError('Please enter a valid Stacks address (starts with SP or ST)');
      return;
    }

    // Navigate to the address page
    router.push(`/${trimmedAddress}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search Input */}
        <div>
          <label 
            htmlFor="address" 
            className="block text-sm font-medium mb-2 text-gray-300"
          >
            Enter Stacks Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="SP... or ST..."
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                   py-3 px-6 rounded-lg transition-colors duration-200 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   focus:ring-offset-gray-900"
        >
          Search Wallet
        </button>
      </form>

      {/* Helper Text */}
      <div className="mt-4 text-sm text-gray-400">
        <p>
          💡 <strong>Tip:</strong> Stacks addresses start with "SP" (mainnet) or "ST" (testnet)
        </p>
      </div>
    </div>
  );
}