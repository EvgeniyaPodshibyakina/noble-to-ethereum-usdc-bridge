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

## **Installation**

To install the project dependencies, run the following command:

```npm install```

This will install all the necessary packages specified in the package.json file.

## **Scripts**

In the package.json file, the following scripts are defined:

•	<b>dev</b>: Starts the development server using Vite.</br>
•	<b>build</b>: Compiles TypeScript and builds the project using Vite.</br>
•	<b>lint</b>: Runs ESLint to check for code quality issues.</br>
•	<b>preview</b>: Serves the built project using Vite’s preview feature.</br>

Example Commands

•	Start development server:
```npm run dev```

The development server will start and can be accessed at http://localhost:5173/.

•	Build the project:
 ```npm run build```

 
## **Configuration**

<b>Vite Configuration</b>

The project uses Vite as the build tool. The Vite configuration can be found in the vite.config.ts file. It includes plugins for React and environment variable management.

<b>TypeScript Configuration</b>

The TypeScript configuration is located in the tsconfig.json file. This file references additional configurations for different parts of the project, such as tsconfig.app.json and tsconfig.node.json.

<b>Tailwind CSS</b>

Tailwind CSS is used for styling, and its configuration can be found in the tailwind.config.js file. PostCSS is also used for processing CSS, and its configuration is in the postcss.config.js file.

## **Environment Variables**

The project uses environment variables for various configurations, such as API keys and network settings. Environment variables are defined in a .env file at the root of the project. The following variables are required:

•   VITE_CIRCLE_API_KEY: The API key for interacting with Circle’s CCTP. </br>
•   VITE_MNEMONIC: The mnemonic phrase for generating the Noble wallet.

Make sure to create a .env file in the root of your project with the appropriate values.

<b>Example .env file:</b>

VITE_CIRCLE_API_KEY=your-circle-api-key </br>
VITE_MNEMONIC=your-mnemonic-phrase

## **Usage**

<b>Connecting Wallets</b>

•   Keplr Wallet: Used for connecting to the Noble blockchain. </br>
•   MetaMask Wallet: Used for connecting to the Ethereum network.

<b>Bridging USDC</b>

1.	Connect to both wallets (Keplr and MetaMask).
2.	Enter the amount of USDC to burn on Noble.
3.	Provide the recipient Ethereum address.
4.	Submit the transaction and monitor the status via the modal window.

## **Project Structure**

The project is organized as follows:

•	<b>src/components/:</b> Contains React components with business logic (e.g., KeplrWallet, MetaMaskWallet). </br>
•	<b>src/UI/:</b> Contains UI-focused React components (e.g., TransactionForm, TransactionModal). </br>
•	<b>src/hooks/:</b> Contains custom hooks (e.g., useBridgeUSDC, useNobleBalance). </br>
•	<b>src/scripts/:</b> Contains utility scripts for handling blockchain interactions (e.g., burnUSDCOnNoble, receiveMessageFromCCTP). </br>
•	<b>src/configs/:</b> Contains configuration files (e.g., noble-config.ts). </br>

## **Dependencies**

Key dependencies include:

•	<b>React</b>: The core framework for building the user interface.</br>
•	<b>Vite</b>: The build tool used for development and production builds.</br>
•	<b>TypeScript</b>: For static typing in the project.</br>
•	<b>ethers</b>: A library for interacting with the Ethereum blockchain.</br>
•	<b>@cosmjs</b>: A suite of libraries for interacting with the Cosmos SDK blockchains, including Noble.</br>

Development dependencies include ESLint, Tailwind CSS, and TypeScript tools.



 


