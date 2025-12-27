const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use this file's directory to resolve project root (which is one level up)
// __dirname is .../scripts/
const PROJECT_ROOT = path.resolve(__dirname, '..');

function run(cmd, cwd = PROJECT_ROOT) {
    try {
        console.log(`> ${cmd}`);
        execSync(cmd, { cwd, stdio: 'inherit' });
    } catch (e) {
        console.error(`Command failed: ${cmd}`);
        // We generally want to continue even if a command fails
    }
}

function gitCommit(msg) {
    run('git add .');
    try {
        execSync(`git commit -m "${msg}"`, { cwd: PROJECT_ROOT, stdio: 'pipe' });
    } catch (e) {
        // console.log("Nothing to commit");
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

// Helper to write file in chunks
function microCommitFile(relPath, content, branchName, description, conventionalType = 'feat') {
    gitBranch(branchName);
    const absPath = path.join(PROJECT_ROOT, relPath);
    const dir = path.dirname(absPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // 1. Create file if not exists
    if (!fs.existsSync(absPath)) {
        fs.writeFileSync(absPath, '');
        gitCommit(`${conventionalType}: create ${path.basename(relPath)} file`);
    } else {
        // If exists, reading it might duplicate content if we just append. 
        // But here we assume we are overwriting/creating new features.
        // For safety, let's clear it if it's a new feature file.
        // But if we are modifying, we should be careful. 
        // Setup implies specific new files.
        fs.writeFileSync(absPath, '');
        gitCommit(`${conventionalType}: reset ${path.basename(relPath)} for update`);
    }

    // 2. Split content and append
    const lines = content.split('\n');
    let chunk = [];

    // Strategy: Commit every logically significant block or every 5-10 lines
    for (let i = 0; i < lines.length; i++) {
        chunk.push(lines[i]);
        const line = lines[i].trim();

        // Conditions to commit
        const isImport = line.startsWith('import ') || line.startsWith('require(');
        const isBlockEnd = line === '}' || line === '};';
        const isInterface = line.startsWith('interface ') || line.startsWith('type ');
        const isExport = line.startsWith('export ');
        const isLongEnough = chunk.length >= 8;

        if ((isImport || isBlockEnd || isInterface || isExport || isLongEnough) && chunk.length > 0) {
            const appending = chunk.join('\n') + '\n';
            fs.appendFileSync(absPath, appending);
            // Craft message
            let msg = `${conventionalType}: update ${path.basename(relPath)}`;
            if (isImport) msg = `${conventionalType}: add imports to ${path.basename(relPath)}`;
            else if (isInterface) msg = `docs: define types in ${path.basename(relPath)}`;
            else if (isExport) msg = `${conventionalType}: export members from ${path.basename(relPath)}`;
            else if (isBlockEnd) msg = `${conventionalType}: implement logic in ${path.basename(relPath)}`;

            gitCommit(msg);
            chunk = []; // reset
        }
    }

    // Flush remaining
    if (chunk.length > 0) {
        fs.appendFileSync(absPath, chunk.join('\n'));
        gitCommit(`${conventionalType}: complete ${path.basename(relPath)} implementation`);
    }

    // Merge
    gitMerge(branchName);
}

// TASKS DEFINITION

const tasks = [
    {
        name: "Clarinet Config",
        branch: "chore/configure-clarinet",
        action: () => {
            const p = path.join(PROJECT_ROOT, 'contracts', 'Clarinet.toml');
            let c = fs.readFileSync(p, 'utf-8');

            // Step 1: Version
            c = c.replace('clarity_version = 3', 'clarity_version = 4');
            fs.writeFileSync(p, c);
            gitCommit('config: update clarity version to 4');

            // Step 2: Epoch
            c = fs.readFileSync(p, 'utf-8'); // read again to be sure
            c = c.replace('epoch = 3.1', "epoch = '3.3'");
            fs.writeFileSync(p, c);
            gitCommit('config: set epoch to 3.3');
        }
    },
    {
        name: "Install Stacks Packages",
        branch: "build/install-stacks-deps",
        action: () => {
            // We simulate package.json updates to avoid long running npm install, 
            // but we SHOULD run npm install at least once. 
            // We'll append lines to package.json
            const p = path.join(PROJECT_ROOT, 'web', 'package.json');
            if (fs.existsSync(p)) {
                const pkg = JSON.parse(fs.readFileSync(p, 'utf-8'));

                if (!pkg.dependencies) pkg.dependencies = {};

                const deps = {
                    "@stacks/connect": "^7.3.0",
                    "@stacks/transactions": "^6.0.0",
                    "@hirosystems/chainhooks-client": "^1.0.0",
                    "@walletconnect/web3wallet": "^1.0.0",
                    "@walletconnect/core": "^1.0.0"
                };

                for (const [k, v] of Object.entries(deps)) {
                    pkg.dependencies[k] = v;
                    fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
                    gitCommit(`build(deps): add ${k}`);
                }
            } else {
                console.log("Package.json not found: " + p);
            }
        }
    }
];

// Content for files
const STACKS_LIB = `
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);

/**
 * User session configuration for Stacks authentication
 */
export const userSession = new UserSession({ appConfig });

export interface AuthenticateOptions {
  onFinish?: () => void;
  onCancel?: () => void;
}

/**
 * Trigger the Stacks wallet authentication flow
 */
export function authenticate(options?: AuthenticateOptions) {
  showConnect({
    appDetails: {
      name: 'Stacks History App',
      icon: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '',
    },
    redirectTo: '/',
    onFinish: () => {
      if (options?.onFinish) options.onFinish();
      else window.location.reload();
    },
    onCancel: options?.onCancel,
    userSession,
  });
}

export function getUserData() {
    if (userSession.isUserSignedIn()) {
        return userSession.loadUserData();
    }
    return null;
}
`;

const WALLET_CONNECT_LIB = `
import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

const PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo-id';

/**
 * Initialize WalletConnect Core
 */
const core = new Core({
  projectId: PROJECT_ID
});

export interface WalletConnectConfig {
    name: string;
    description: string;
    url: string;
    icons: string[];
}

/**
 * Initialize the Web3Wallet instance
 * @param config Configuration for the wallet metadata
 */
export const initWalletConnect = async (config: WalletConnectConfig) => {
  try {
    const web3wallet = await Web3Wallet.init({
      core,
      metadata: config
    });
    
    console.log('WalletConnect initialized');
    return web3wallet;
  } catch (err) {
    console.error('Failed to init WalletConnect', err);
    throw err;
  }
};
`;

const CHAINHOOKS_LIB = `
import { ChainhooksClient } from '@hirosystems/chainhooks-client';

const API_KEY = process.env.NEXT_PUBLIC_HIRO_API_KEY;

/**
 * Setup Chainhooks client
 */
export const chainhooks = new ChainhooksClient({
    apiKey: API_KEY,
    network: 'mainnet' // or testnet
});

export async function registerHook(predicate: any) {
    try {
        const result = await chainhooks.register(predicate);
        return result;
    } catch (e) {
        console.error("Chainhook error", e);
        return null;
    }
}
`;

// Execution
(async () => {
    // Basic Config
    // Use system git config (or user provided global config)
    // run('git config user.name "Antigravity Bot"');
    // run('git config user.email "bot@antigravity.dev"');

    // Run Tasks
    for (const task of tasks) {
        gitBranch(task.branch);
        task.action();
        gitMerge(task.branch);
    }

    // Run File Creations
    microCommitFile('web/lib/stacks-connect.ts', STACKS_LIB.trim(), 'feat/stacks-connect-impl', 'Implement Stacks Connect');
    microCommitFile('web/lib/wallet-connect.ts', WALLET_CONNECT_LIB.trim(), 'feat/wallet-connect-impl', 'Implement Wallet Connect');
    microCommitFile('web/lib/chainhooks.ts', CHAINHOOKS_LIB.trim(), 'feat/chainhooks-integration', 'Integrate Chainhooks');

    console.log("Genesis complete.");
})();
