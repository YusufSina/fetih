import React, { useEffect, useState } from 'react';
import { FetihContract } from '../helpers/Consts';
import GameFooter from './GameFooter';
import Map from './Map';
import RightClickMenu from './RightClickMenu';
import Web3 from 'web3';

function Game() {
  const [showRightClickMenu, setShowRightClickMenu] = useState(false);
  const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });
  const [id, setId] = useState(0);

  useEffect(() => {
    document.oncontextmenu = e => {
      if (e.target.tagName === 'path') {
        e.preventDefault();
        setShowRightClickMenu(true);
        setCoordinates({ top: e.clientY + window.scrollY, left: e.clientX });
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

    const web3 = new Web3(window.ethereum);
    console.log(web3);
    // if (web3) {
    //   const contract = new web3.eth.Contract(FetihContract.ABI, FetihContract.ADDRESS);
    //   console.log(contract);
    //   console.log(web3);
    // }
  }, []);

  return (
    <>
      <Map />
      <RightClickMenu id={id} top={coordinates.top} left={coordinates.left} show={showRightClickMenu} />
      <GameFooter/>
    </>

  );
}

export default Game;
