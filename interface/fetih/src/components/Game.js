import React, { useEffect, useState } from 'react';
import GameFooter from './GameFooter';
import Map from './Map';
import RightClickMenu from './RightClickMenu';

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
