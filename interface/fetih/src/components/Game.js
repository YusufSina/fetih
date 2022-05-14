import React, { useEffect, useState, useContext } from 'react';
import { MetaMaskContext } from '../context/MetaMaskContext';
import { FetihContract } from '../helpers/Consts';
import Map from './Map';
import RightClickMenu from './RightClickMenu';

function Game() {
  const { web3 } = useContext(MetaMaskContext);
  const [showRightClickMenu, setShowRightClickMenu] = useState(false);
  const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });
  const [id, setId] = useState(0);

  useEffect(() => {
    document.oncontextmenu = e => {
      if (e.target.tagName === 'path') {
        e.preventDefault();
        setShowRightClickMenu(true);
        setCoordinates({ top: e.clientY, left: e.clientX });
        setId(parseInt(e.target.id, 10));
      }
    };

    window.addEventListener('click', e => {
      if (e.target.getAttribute('id') !== 'attack-btn-drp') {
        setShowRightClickMenu(false);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        setShowRightClickMenu(false);
      }
    });

    if (web3) {
      const contract = new web3.eth.Contract(FetihContract.ABI, FetihContract.ADDRESS);

      contract.methods.getAllOwners().call().then(result => console.log(result));
    }
  }, []);

  return (
    <>
      <Map />
      <RightClickMenu id={id} top={coordinates.top} left={coordinates.left} show={showRightClickMenu} />
    </>

  );
}

export default Game;
