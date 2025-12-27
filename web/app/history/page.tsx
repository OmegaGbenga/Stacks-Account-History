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
