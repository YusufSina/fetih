import React from 'react';
import './App.css';
import Game from './components/Game';
import Introduction from './components/Introduction';
import ChainWarning from './components/Modals/ChainWarning';
import Title from './components/Title';
import { MetaMaskProvider, MetaMaskConsumer } from './context/MetaMaskContext';

function App() {
  return (
    <MetaMaskProvider>
      <Title />
      <MetaMaskConsumer>
        {({ account, chainId }) => {
          if (account === '') {
            return <Introduction />;
          }
          if (chainId !== '0x3') {
            return <ChainWarning />;
          }
          return <Game />;
        }}
      </MetaMaskConsumer>
    </MetaMaskProvider>
  );
}

export default App;
