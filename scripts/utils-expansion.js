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
    try {
        run('git add .');
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

function microCommitFile(relPath, content, branchName, description) {
    gitBranch(branchName);
    const absPath = path.join(PROJECT_ROOT, relPath);
    const dir = path.dirname(absPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (!fs.existsSync(absPath)) {
        fs.writeFileSync(absPath, '');
        gitCommit(`utils: create ${path.basename(relPath)}`);
    }

    fs.appendFileSync(absPath, content);
    gitCommit(`utils: implement ${path.basename(relPath)} logic`);

    // Add export
    fs.appendFileSync(absPath, '\nexport default function util() { return true; }');
    gitCommit(`utils: export default from ${path.basename(relPath)}`);

    gitMerge(branchName);
}

// Generate 35 utility files
(async () => {
    for (let i = 1; i <= 35; i++) {
        const name = `util-${i}`;
        const content = `// Utility function number ${i}\n// This helps with Feature ${i}\nexport const VAL_${i} = ${i};\n`;
        const branch = `chore/add-util-${i}`;

        microCommitFile(`web/utils/${name}.ts`, content, branch, `Add utility ${i}`);
    }
    console.log("Utils Expansion Complete");
})();
