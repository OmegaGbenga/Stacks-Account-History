"use client";

import { useEffect, useState } from 'react';
import { useStacks } from '@/hooks/use-stacks';
import { addToHistory } from '@/lib/search-history';
import { BookmarkIcon } from 'lucide-react';

export function SaveToHistory({ address }: { address: string }) {
  const { userData } = useStacks();
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    if (!userData) {
      alert('Please connect your wallet first');
      return;
    }

    setSaving(true);
    try {
      await addToHistory(address);
      alert('Address saved to your search history! Transaction pending...');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save to history');
    }
    setSaving(false);
  };

  if (!mounted || !userData) return null;

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
      title="Save to my search history"
    >
      <BookmarkIcon className="h-4 w-4" />
      {saving ? 'Saving...' : 'Save'}
    </button>
  );
}