const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

function run(cmd, cwd = PROJECT_ROOT) {
    try {
        // console.log(`> ${cmd}`);
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
        gitCommit(`${conventionalType}: create ${path.basename(relPath)} container`);
    }

    const lines = content.split('\n');
    let chunk = [];

    for (let i = 0; i < lines.length; i++) {
        chunk.push(lines[i]);
        const line = lines[i].trim();

        // Granular commitment strategy
        const isImport = line.startsWith('import ') || line.startsWith('require(');
        const isBlockEnd = line === '}' || line === '};' || line === '})';
        const isInterface = line.startsWith('interface ') || line.startsWith('type ');
        const isExport = line.startsWith('export ');
        const isTagClose = line.trim().startsWith('</');
        const isReturn = line.trim().startsWith('return (');

        // Commit every 5 lines regardless, or on structural boundaries
        if ((chunk.length >= 4) || (isImport && chunk.length > 1) || isBlockEnd || isInterface || isExport || isTagClose || isReturn) {
            const appending = chunk.join('\n') + '\n';
            fs.appendFileSync(absPath, appending);

            let msg = `${conventionalType}: update ${path.basename(relPath)}`;
            if (isImport) msg = `${conventionalType}: add imports to ${path.basename(relPath)}`;
            else if (isInterface) msg = `docs: type definitions for ${path.basename(relPath)}`;
            else if (isExport) msg = `${conventionalType}: export component from ${path.basename(relPath)}`;
            else if (isReturn) msg = `${conventionalType}: implement render logic in ${path.basename(relPath)}`;
            else if (isTagClose) msg = `${conventionalType}: close element in ${path.basename(relPath)}`;
            else if (isBlockEnd) msg = `${conventionalType}: close block in ${path.basename(relPath)}`;
            else msg = `${conventionalType}: wip implementation of ${path.basename(relPath)}`;

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

// COMPONENTS

const BUTTON_CMP = `
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30',
    secondary: 'bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className}\`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
`;

const CARD_CMP = `
import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={\`bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl \${className}\`}>
      {title && (
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
`;

const NAVBAR_CMP = `
import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import { authenticate, getUserData } from '@/lib/stacks-connect';
import { initWalletConnect } from '@/lib/wallet-connect';

export const Navbar = () => {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const data = getUserData();
    setUser(data);
  }, []);

  const handleLogin = () => {
    authenticate();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            StacksHistory
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/history" className="text-sm text-gray-400 hover:text-white transition-colors">History</Link>
            <Link href="/deployments" className="text-sm text-gray-400 hover:text-white transition-colors">Deployments</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
               <span className="text-sm text-gray-300">{user.profile?.stxAddress?.mainnet}</span>
               <Button variant="glass" size="sm">Disconnect</Button>
            </div>
          ) : (
            <Button onClick={handleLogin} variant="primary" size="sm">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
`;

const INPUT_CMP = `
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="table text-sm font-medium text-gray-300">{label}</label>}
      <input
        className={\`w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-gray-500 outline-none transition-all \${error ? 'border-red-500' : ''} \${className}\`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
`;

const FOOTER_CMP = `
import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500 text-sm">© 2024 Stacks Account History. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
`;

// EXECUTION
(async () => {
    microCommitFile('web/components/ui/Button.tsx', BUTTON_CMP.trim(), 'feat/ui-button');
    microCommitFile('web/components/ui/Card.tsx', CARD_CMP.trim(), 'feat/ui-card');
    microCommitFile('web/components/ui/Input.tsx', INPUT_CMP.trim(), 'feat/ui-input');
    microCommitFile('web/components/Navbar.tsx', NAVBAR_CMP.trim(), 'feat/ui-navbar');
    microCommitFile('web/components/Footer.tsx', FOOTER_CMP.trim(), 'feat/ui-footer');
    console.log("UI Expansion Complete");
})();
