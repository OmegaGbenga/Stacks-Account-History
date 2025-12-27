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
                   <div className="text-right">
                      <p className="text-sm text-gray-300">{tx.age}</p>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${tx.status === 'Success' ? 'bg-green-500/10 text-green-400 ring-green-500/20' : 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20'}`}>
                        {tx.status}
                      </span>
                   </div>
                </div>
             </Card>
