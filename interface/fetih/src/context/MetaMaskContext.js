/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const MetaMaskContext = React.createContext();
const MetaMaskConsumer = MetaMaskContext.Consumer;

function MetaMaskProvider({ children }) {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');

  const initMetaMask = () => {
    window.ethereum.on('connect', connectInfo => {
      setChainId(connectInfo.chainId);
    });

    // window.ethereum.on('disconnect', connectInfo => {
    //   console.log('disconnect'); console.log(connectInfo);
    // });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  };

  const connectMetaMask = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount('');
    }
  };

  useEffect(() => {
    setIsMetaMaskInstalled(window.ethereum !== 'undefined');
  }, []);

  useEffect(() => {
    if (isMetaMaskInstalled) {
      initMetaMask();
    }
  }, [isMetaMaskInstalled]);

  return (
    <MetaMaskContext.Provider value={{ isMetaMaskInstalled, connectMetaMask, account, chainId }}>
      {children}
    </MetaMaskContext.Provider>
  );
}

MetaMaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MetaMaskContext, MetaMaskConsumer, MetaMaskProvider };
