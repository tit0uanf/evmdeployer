import React, { useEffect, useState, useCallback } from 'react';
import { useDynamicContext, DynamicWidget, DynamicConnectButton } from '@dynamic-labs/sdk-react-core';

export const WalletOperations = () => {
  const { primaryWallet } = useDynamicContext();
  const [bytecode, setBytecode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [displayError, setDisplayError] = useState(false);
  
  const disabledButton = "cursor-not-allowed flex max-w-16 px-5 py-2.5 text-sm font-medium justify-center focus:outline-none  rounded-lg border border-gray-700   focus:z-10 focus:ring-4 focus:ring-gray-100  bg-gray-900 text-white"
  const enabledButton ="flex max-w-16 px-5 py-2.5 text-sm font-medium justify-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"

  const checkBytecode = useCallback(() => {
    const regex = /[^0-9A-Fa-f]/g;
    if(bytecode === "") {
      setErrorMsg("Bytecode should not be an empty string");
      return false;
    }
    else if(bytecode.startsWith("0x")) {
      setErrorMsg("Bytecode should not start with 0x");
      return false;
    }
    else if(regex.test(bytecode)) {
      setErrorMsg("Bytecode contains illegal character");
      return false;
    }
    else if (bytecode.length % 2 != 0) {
      setErrorMsg("Number of character must be pair");
      return false;
    }
    else{
      return true;
    }
  }, [bytecode]);



  const deployBytecode = async () => {
    if (!primaryWallet) {
      setErrorMsg("No wallet connected");
      setDisplayError(true);
    } else if(checkBytecode()) {
      try {
        const signer = await primaryWallet?.connector.ethers?.getSigner();
        const transaction = await signer?.sendUncheckedTransaction({
          data: "0x"+bytecode
        });
      } catch (error) {
        setErrorMsg(`Error deploying bytecode: ${error}`);
        setDisplayError(true);
      }
    } else {
      setDisplayError(true);
    }
  };
  
  useEffect(() => {

    setDisplayError(false);
    checkBytecode()
  }, [bytecode,checkBytecode]);


  const connectWallet = (
    <div  className="flex px-5 py-2.5 max-w-42 text-sm font-medium justify-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">Connect Wallet</div>
  ) as React.ReactElement;


  return (
    <div className="flex flex-col w-1/2 items-center">
      {primaryWallet ? <DynamicWidget variant='modal' /> :  <DynamicConnectButton>{connectWallet}</DynamicConnectButton> }

      <textarea
      onChange={(e) => setBytecode(e.target.value)}
      className="flex h-72 w-96 m-2.5 p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Input creation code here..."
      />
    {displayError ?
      <button onClick={deployBytecode} disabled className={disabledButton}>Deploy</button>
    :
      <button onClick={deployBytecode} className={enabledButton}>Deploy</button>
    }
      {displayError ? <span className='mt-1 text-gray-600'>{errorMsg}</span> : <></>}
    </div>
  );
};

export default WalletOperations;
