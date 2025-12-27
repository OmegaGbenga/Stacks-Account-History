import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';

export default function HistoryPage() {
  const transactions = [
    { id: '0x123...abc', type: 'Contract Call', age: '2 mins ago', status: 'Success' },
    { id: '0x456...def', type: 'Token Transfer', age: '15 mins ago', status: 'Pending' },
    { id: '0x789...ghi', type: 'Contract Deploy', age: '1 hour ago', status: 'Success' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Transaction History</h1>
        
        <div className="space-y-4">
          {transactions.map((tx) => (
             <Card key={tx.id} className="hover:border-indigo-500/50 transition-colors">
                <div className="flex justify-between items-center">
                   <div>
                      <p className="font-mono text-indigo-400">{tx.id}</p>
                      <p className="text-sm text-gray-400">{tx.type}</p>
                   </div>
