# Stacks Account History

This repository contains the source code for the Stacks Account History application, a blockchain-based solution built on the Stacks network. It includes Clarity smart contracts, a web frontend, and associated deployment configuration.

## Project Architecture

The codebase is organized into the following primary directories:

*   **contracts/**: Contains the Clarity smart contracts defining the on-chain logic.
*   **web/**: The frontend application, built with Next.js and React, for interacting with the Stacks blockchain.
*   **scripts/**: Utility scripts for automation, testing, and maintenance tasks.
*   **settings/**: Network configuration files for various deployment environments (Mainnet, Testnet, Devnet).
*   **deployments/**: Records of contract deployments and their artifacts.

## Prerequisites

Ensure the following tools are installed in your development environment:

*   **Node.js** (v18 or higher)
*   **Clarinet**: The Stacks development kit for testing and deploying contracts.
*   **Git**: Version control system.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/OmegaGbenga/Stacks-Account-History.git
    cd Stacks-Account-History
    ```

2.  Install dependencies for the web application:
    ```bash
    cd web
    npm install
    ```

## Development

### Smart Contracts

Contracts are located in the `contracts/` directory. Configuration for the Stacks environment is managed via `Clarinet.toml`.

To run contract tests:
```bash
clarinet test
```

To start a local Clarinet console:
```bash
clarinet console
```

### Web Application

The frontend is located in the `web/` directory.

To start the development server:
```bash
cd web
npm run dev
```
The application will be available at `http://localhost:3000`.

## Deployment

Network settings are defined in the `settings/` directory.

To deploy contracts to the testnet, use the provided configuration in `settings/Testnet.toml`. ensure your private keys are securely managed and not committed to version control.
