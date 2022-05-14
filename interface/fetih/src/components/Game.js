/* eslint-disable no-prototype-builtins */
import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import GameFooter from './GameFooter';
import Map from './Map';
import RightClickMenu from './RightClickMenu';
import { MetaMaskContext } from '../context/MetaMaskContext';
import { areAccountsEqual, LoadingHelper, RandomColor } from '../helpers/Utilities';
import { FetihContract, NeighboringProvinces } from '../helpers/Consts';

function Game() {
  const { cityOwners, contractRef, account } = useContext(MetaMaskContext);

  const [showRightClickMenu, setShowRightClickMenu] = useState(false);
  const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });
  const [id, setId] = useState(0);
  const [ownerList, setOwnerList] = useState([]);
  const [ownerColorList, setOwnerColorList] = useState();

  const getAttackableCities = _ownerList => {
    if (id === 0) return [];
    const mappedOwnerList = _ownerList.map((_account, index) => ({ account: _account, landId: index + 1 })).filter(f => !areAccountsEqual(f.account, account));
    const neighboringProvinces = NeighboringProvinces[id];
    const result = neighboringProvinces.filter(f => mappedOwnerList.some(some => some.landId === f));
    return result;
  };

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

    async function fetchData() {
      LoadingHelper.ShowLoading();

      const owners = await cityOwners();
      const ownerColors = {};

      owners.forEach(e => {
        if (e !== FetihContract.ADDRESS && !ownerColors.hasOwnProperty(e)) {
          ownerColors[e] = RandomColor();
        }
      });

      setOwnerList(owners);
      setOwnerColorList(ownerColors);

      LoadingHelper.HideLoading();
    }
    fetchData();

    //* ************** Event Listeners ********************** */

    contractRef.current.events.BoughtCity(
      (error, event) => {
        if (!error) {
          const { tokenId, sender } = event.returnValues;
          setOwnerList(prev => {
            const newValue = [...prev];
            newValue[tokenId] = sender;
            return [...newValue];
          });
          toast.success('Şehri Başarı ile satın aldınız!');
        }
      },
    ).on('error', error => {
      toast.error(error.message);
    });

    contractRef.current.events.WonBattle(
      (error, event) => {
        if (!error) {
          const { emperor, conqueredTokenId } = event.returnValues;
          setOwnerList(prev => {
            const newValue = [...prev];
            newValue[conqueredTokenId] = emperor;
            return [...newValue];
          });
          toast.success('Son Yaptığınız Savaşı Kazandınız!');
        }
      },
    ).on('error', error => {
      toast.error(error.message);
    });

    contractRef.current.events.LostBattle(
      error => {
        if (!error) {
          toast.success('Son Yaptığınız Savaşı Kaybettiniz!');
        }
      },
    ).on('error', error => {
      toast.error(error.message);
    });

    contractRef.current.events.ClaimSoldier(
      error => {
        if (!error) {
          toast.warning('Askerleriniz Hazır!');
        }
      },
    ).on('error', error => {
      toast.error(error.message);
    });
  }, []);

  useEffect(() => {
    if (typeof ownerList === 'object' && Object.keys(ownerList).length > 0 && typeof ownerColorList === 'object' && Object.keys(ownerColorList).length > 0) {
      ownerList.forEach((f, index) => {
        if (f !== FetihContract.ADDRESS) {
          document
            .getElementById(index + 1)
            .setAttribute('fill', ownerColorList[f]);
        }
      });
    }
  }, [ownerList, ownerColorList]);

  return (
    <>
      <Map />
      <RightClickMenu
        id={id}
        top={coordinates.top}
        left={coordinates.left}
        show={showRightClickMenu}
        isCityEmpty={ownerList[id - 1] === FetihContract.ADDRESS}
        attackAbleCities={getAttackableCities(ownerList)}
        isCityMine={areAccountsEqual(ownerList[id - 1], account)}
      />
      <GameFooter />
    </>
  );
}

export default Game;
