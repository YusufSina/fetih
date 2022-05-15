/* eslint-disable no-inner-declarations */
/* eslint-disable no-prototype-builtins */
import React, { useEffect, useState, useContext } from 'react';
import GameFooter from './GameFooter';
import Map from './Map';
import RightClickMenu from './RightClickMenu';
import { MetaMaskContext } from '../context/MetaMaskContext';
import { areAccountsEqual } from '../helpers/Utilities';
import { FetihContract, NeighboringProvinces } from '../helpers/Consts';

function Game() {
  const { cityOwnerList, ownerColors, account } = useContext(MetaMaskContext);

  const [showRightClickMenu, setShowRightClickMenu] = useState(false);
  const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });
  const [id, setId] = useState(0);
  const [initFlag, setInıtFlag] = useState(false);

  const getAttackableCities = _ownerList => {
    if (id === 0) return [];
    const mappedOwnerList = _ownerList.map((_account, index) => ({ account: _account, landId: index + 1 })).filter(f => !areAccountsEqual(f.account, account));
    const neighboringProvinces = NeighboringProvinces[id];
    const result = neighboringProvinces.filter(f => mappedOwnerList.some(some => some.landId === f));
    return result;
  };

  useEffect(() => {
    if (!initFlag) {
      setInıtFlag(true);
      console.log('--init Game useEffect--');
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
    }
  }, [initFlag]);

  useEffect(() => {
    console.log('useEffect');
    console.log({ cityOwnerList });
    console.log({ ownerColors });
    if (typeof cityOwnerList === 'object' && Object.keys(cityOwnerList).length > 0 && typeof ownerColors === 'object' && Object.keys(ownerColors).length > 0) {
      cityOwnerList.forEach((f, index) => {
        if (f !== FetihContract.ADDRESS) {
          document
            .getElementById(index + 1)
            .setAttribute('fill', ownerColors[f]);
        }
      });
    }
  }, [cityOwnerList, ownerColors]);

  return (
    <>
      <Map />
      <RightClickMenu
        id={id}
        top={coordinates.top}
        left={coordinates.left}
        show={showRightClickMenu}
        isCityEmpty={areAccountsEqual(cityOwnerList[id - 1], FetihContract.ADDRESS)}
        attackAbleCities={getAttackableCities(cityOwnerList)}
        isCityMine={areAccountsEqual(cityOwnerList[id - 1], account)}
      />
      <GameFooter />
    </>
  );
}

export default Game;
