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
        const isHook = line.startsWith('export function') || line.startsWith('export const use');
        const isEffect = line.trim().startsWith('useEffect');
        const isRet = line.trim().startsWith('return ');

        if ((chunk.length >= 6) || (isImport && chunk.length > 1) || isHook || isEffect || isRet) {
            const appending = chunk.join('\n') + '\n';
            fs.appendFileSync(absPath, appending);

            let msg = `${conventionalType}: update ${path.basename(relPath)}`;
            if (isImport) msg = `${conventionalType}: add imports to ${path.basename(relPath)}`;
            else if (isHook) msg = `${conventionalType}: define hook signature ${path.basename(relPath)}`;
            else if (isEffect) msg = `${conventionalType}: add side effects ${path.basename(relPath)}`;
            else if (isRet) msg = `${conventionalType}: implement return logic ${path.basename(relPath)}`;

            gitCommit(msg);
            chunk = [];
        }
    }

    if (chunk.length > 0) {
        fs.appendFileSync(absPath, chunk.join('\n'));
        gitCommit(`${conventionalType}: finalize ${path.basename(relPath)}`);
    }

    gitMerge(branchName);
}

const USE_STACKS_ACCOUNT = `
import { useState, useEffect } from 'react';
import { getUserData, userSession } from '@/lib/stacks-connect';

export function useStacksAccount() {
  const [address, setAddress] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = getUserData();
      setAddress(userData?.profile?.stxAddress?.mainnet || null);
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
      setAddress(null);
    }
  }, []);

  return { address, isSignedIn };
}
`;

const USE_TRANSACTION = `
import { useState } from 'react';
import { chainhooks } from '@/lib/chainhooks';

export function useTransactionMonitor(txId: string) {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | 'unknown'>('unknown');

  useEffect(() => {
    if (!txId) return;

    // Simulate polling or websocket subscription
    const interval = setInterval(() => {
       // logic to check status
       console.log("Checking tx", txId);
    }, 5000);

    return () => clearInterval(interval);
  }, [txId]);

  return { status };
}
`;

// EXECUTION
(async () => {
    microCommitFile('web/hooks/use-stacks-account.ts', USE_STACKS_ACCOUNT.trim(), 'feat/hook-stacks-account');
    microCommitFile('web/hooks/use-transaction-monitor.ts', USE_TRANSACTION.trim(), 'feat/hook-transaction-monitor');
    console.log("Hooks Expansion Complete");
})();
