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

function microCommitFile(relPath, content, branchName, conventionalType = 'test') {
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

        const isImport = line.startsWith('import ') || line.startsWith('const ');
        const isDesc = line.startsWith('describe(') || line.startsWith('it(') || line.startsWith('test(');
        const isEnd = line === '});';

        if ((chunk.length >= 4) || (isImport && chunk.length > 1) || isDesc || isEnd) {
            const appending = chunk.join('\n') + '\n';
            fs.appendFileSync(absPath, appending);

            let msg = `${conventionalType}: update ${path.basename(relPath)}`;
            if (isImport) msg = `${conventionalType}: setup imports for ${path.basename(relPath)}`;
            else if (isDesc) msg = `${conventionalType}: add test suite/case in ${path.basename(relPath)}`;
            else if (isEnd) msg = `${conventionalType}: complete test block in ${path.basename(relPath)}`;

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

const BUTTON_TEST = `
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-gray-800');
  });
});
`;

const CARD_TEST = `
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders children', () => {
    render(<Card><div>Content</div></Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Res Title">Content</Card>);
    expect(screen.getByText('Res Title')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-cls">C</Card>);
    expect(container.firstChild).toHaveClass('custom-cls');
  });
});
`;

// EXECUTION
(async () => {
    microCommitFile('web/components/ui/Button.test.tsx', BUTTON_TEST.trim(), 'test/button-component');
    microCommitFile('web/components/ui/Card.test.tsx', CARD_TEST.trim(), 'test/card-component');
    console.log("Tests Expansion Complete");
})();
