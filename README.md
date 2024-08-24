# **Noble to Ethereum USDC Bridge**

This project is a React application designed to bridge USDC between the Noble blockchain and the Ethereum network. The application connects to both the Noble and Ethereum networks via Keplr and MetaMask wallets, respectively, and facilitates the burning of USDC on Noble and minting on Ethereum. **Please note that this application operates on test networks (testnets).**

## **Table of Contents**

- [Installation](#installation)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Development](#development)
- [Build](#build)

## **Installation**

To install the project dependencies, run the following command:

```bash
npm install```

This will install all the necessary packages specified in the package.json file.


Scripts

In the package.json file, the following scripts are defined:

	•	dev: Starts the development server using Vite.
	•	build: Compiles TypeScript and builds the project using Vite.
	•	lint: Runs ESLint to check for code quality issues.
	•	preview: Serves the built project using Vite’s preview feature.


    Example Commands

	•	Start development server:

    npm run dev

    •	Build the project:

    npm run build

    Configuration

Vite Configuration

The project uses Vite as the build tool. The Vite configuration can be found in the vite.config.ts file. It includes plugins for React and environment variable management.

TypeScript Configuration

The TypeScript configuration is located in the tsconfig.json file. This file references additional configurations for different parts of the project, such as tsconfig.app.json and tsconfig.node.json.

Tailwind CSS

Tailwind CSS is used for styling, and its configuration can be found in the tailwind.config.js file. PostCSS is also used for processing CSS, and its configuration is in the postcss.config.js file.

Environment Variables

The project uses environment variables for various configurations, such as API keys and network settings. Environment variables are defined in a .env file at the root of the project. The following variables are required:

	•	VITE_CIRCLE_API_KEY: The API key for interacting with Circle’s CCTP.
	•	VITE_MNEMONIC: The mnemonic phrase for generating the Noble wallet.

Make sure to create a .env file in the root of your project with the appropriate values.

Example .env file:

VITE_CIRCLE_API_KEY=your-circle-api-key
VITE_MNEMONIC=your-mnemonic-phrase

Usage

Connecting Wallets

	•	Keplr Wallet: Used for connecting to the Noble blockchain.
	•	MetaMask Wallet: Used for connecting to the Ethereum network.

Bridging USDC

	1.	Connect to both wallets (Keplr and MetaMask).
	2.	Enter the amount of USDC to burn on Noble.
	3.	Provide the recipient Ethereum address.
	4.	Submit the transaction and monitor the status via the modal window.

Project Structure

The project is organized as follows:

	•	src/components/: Contains React components with business logic (e.g., KeplrWallet, MetaMaskWallet).
	•	src/UI/: Contains UI-focused React components (e.g., TransactionForm, TransactionModal).
	•	src/hooks/: Contains custom hooks (e.g., useBridgeUSDC, useNobleBalance).
	•	src/scripts/: Contains utility scripts for handling blockchain interactions (e.g., burnUSDCOnNoble, receiveMessageFromCCTP).
	•	src/configs/: Contains configuration files (e.g., noble-config.ts).

Dependencies

Key dependencies include:

	•	React: The core framework for building the user interface.
	•	Vite: The build tool used for development and production builds.
	•	TypeScript: For static typing in the project.
	•	ethers: A library for interacting with the Ethereum blockchain.
	•	@cosmjs: A suite of libraries for interacting with the Cosmos SDK blockchains, including Noble.

Development dependencies include ESLint, Tailwind CSS, and TypeScript tools.

Development

To start the development server, use:

npm run dev

This will launch the application at http://localhost:5173, where you can interact with the bridge interface.

To create a production build, run:

npm run build

This will compile the TypeScript files and bundle the application for deployment.
