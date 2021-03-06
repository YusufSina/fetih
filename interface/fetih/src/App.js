import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Game from './components/Game';
import Introduction from './components/Introduction';
import ChainWarningModal from './components/Modals/ChainWarningModal';
import Title from './components/Title';
import { MetaMaskProvider, MetaMaskConsumer } from './context/MetaMaskContext';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <MetaMaskProvider>
        <Title />
        <MetaMaskConsumer>
          {({ account, chainId }) => {
            if (account === '') {
              return <Introduction />;
            }
            if (chainId !== '0x4') {
              return <ChainWarningModal />;
            }
            return <Game />;
          }}
        </MetaMaskConsumer>
      </MetaMaskProvider>
      <ToastContainer />
    </>
  );
}

export default App;
