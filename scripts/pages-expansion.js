const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

function run(cmd, cwd = PROJECT_ROOT) {
    try {
        execSync(cmd, { cwd, stdio: 'pipe' });
    } catch (e) {
        // ignore
    }
}

function gitCommit(msg) {
    run('git add .');
    try {
        execSync(`git commit -m "${msg}"`, { cwd: PROJECT_ROOT, stdio: 'pipe' });
    } catch (e) {
        // ignore
    }
}

function gitBranch(name) {
    try {
        execSync(`git checkout -b ${name}`, { cwd: PROJECT_ROOT, stdio: 'pipe' });
    } catch (e) {
        run(`git checkout ${name}`);
    }
}

function gitMerge(branchName) {
    run('git checkout main');
    run(`git merge ${branchName} --no-ff -m "Merge branch '${branchName}'"`);
}

function microCommitFile(relPath, content, branchName, conventionalType = 'feat') {
    gitBranch(branchName);
    const absPath = path.join(PROJECT_ROOT, relPath);
    const dir = path.dirname(absPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (!fs.existsSync(absPath)) {
        fs.writeFileSync(absPath, '');
        gitCommit(`${conventionalType}: init ${path.basename(relPath)}`);
    }

    const lines = content.split('\n');
    let chunk = [];

    for (let i = 0; i < lines.length; i++) {
        chunk.push(lines[i]);
        const line = lines[i].trim();

        const isImport = line.startsWith('import ');
        const isComp = line.startsWith('export default function') || line.startsWith('export const');
        const isRet = line.trim().startsWith('return (');
        const isTagClose = line.trim().startsWith('</');

        if ((chunk.length >= 5) || (isImport && chunk.length > 1) || isComp || isRet || isTagClose) {
            const appending = chunk.join('\n') + '\n';
            fs.appendFileSync(absPath, appending);

            let msg = `${conventionalType}: update ${path.basename(relPath)}`;
            if (isImport) msg = `${conventionalType}: add imports ${path.basename(relPath)}`;
            else if (isComp) msg = `${conventionalType}: scaffold component ${path.basename(relPath)}`;
            else if (isRet) msg = `${conventionalType}: render structure ${path.basename(relPath)}`;

            gitCommit(msg);
            chunk = [];
        }
    }

    if (chunk.length > 0) {
        fs.appendFileSync(absPath, chunk.join('\n'));
        gitCommit(`${conventionalType}: complete ${path.basename(relPath)}`);
    }

    gitMerge(branchName);
}

const HOME_PAGE = `
import { Navbar } from '@/components/Navbar';
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
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
`;

const HISTORY_PAGE = `
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
                      <span className={\`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset \${tx.status === 'Success' ? 'bg-green-500/10 text-green-400 ring-green-500/20' : 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20'}\`}>
                        {tx.status}
                      </span>
                   </div>
                </div>
             </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
`;

// EXECUTION
(async () => {
    microCommitFile('web/app/page.tsx', HOME_PAGE.trim(), 'feat/page-home');
    microCommitFile('web/app/history/page.tsx', HISTORY_PAGE.trim(), 'feat/page-history');
    console.log("Pages Expansion Complete");
})();
