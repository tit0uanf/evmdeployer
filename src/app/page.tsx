"use client"
import React from 'react';
import {DynamicContextProvider} from "@dynamic-labs/sdk-react-core";
import { EthersExtension } from "@dynamic-labs/ethers-v6";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import WalletOperations from './wallet';

const LandingPage: React.FC = () => {
  const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;
  if (!environmentId) {
    throw new Error('Missing required environment variable: DYNAMIC_ENVIRONMENT_ID');
  }

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="mb-2 text-5xl font-extrabold ">EVM Bytecode Deployer</h1>
      <h2 className='mb-10'>Deploy EVM Bytecode on any EVM compatible Blockchain directly from your browser</h2>
      <DynamicContextProvider
      settings={{
        environmentId: environmentId,
        walletConnectorExtensions: [EthersExtension],
        walletConnectors: [EthereumWalletConnectors],

      }}
    >
        <WalletOperations />
      </DynamicContextProvider>

    </main>
  );
};

export default LandingPage;
