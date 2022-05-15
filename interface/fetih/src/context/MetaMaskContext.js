/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useEffect, useRef, useState } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { FetihContract } from '../helpers/Consts';
import { areAccountsEqual, LoadingHelper, RandomColor } from '../helpers/Utilities';

const MetaMaskContext = React.createContext();
const MetaMaskConsumer = MetaMaskContext.Consumer;

function MetaMaskProvider({ children }) {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [initflag, setInıtFlag] = useState(true);
  const [cityOwnerList, setCityOwnerList] = useState([]);
  const [ownerColors, setOwnerColors] = useState();

  const contractRef = useRef({});
  const web3Ref = useRef({});

  /** Meta Mask Functions */
  const initMetaMask = () => {
    window.ethereum.on('connect', connectInfo => {
      setChainId(connectInfo.chainId);
    });

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
  /** ***************************************** */

  /* Contract Functions */
  const battle = async (attackerId, defenderId) => {
    await contractRef.current.methods.battle(attackerId, defenderId).send({ from: account });
  };

  const buyLand = async landId => {
    await contractRef.current.methods.buyCity(landId).send({ from: account, value: web3Ref.current.utils.toWei('0.1', 'ether') });
  };

  const isTheBarrackBusy = async landId => {
    const isBarrackBusy = await contractRef.current.methods.isTheBarrackBusy(landId).call({ from: account });
    return isBarrackBusy;
  };

  const cityOwners = async () => {
    const allOwners = await contractRef.current.methods.getAllOwners().call();
    return allOwners;
  };

  const produceSoldiers = async landId => {
    if (!(await isTheBarrackBusy(landId))) {
      const toastId = toast.loading('Askerler kışlaya alınıyor...');
      await contractRef.current.methods.produceSoldiers(landId).send({ from: account }, (err, res) => {
        toast.dismiss(toastId);
        if (err) {
          toast.error('Askerler kışlaya alınırken bir hata meydana geldi!');
          return;
        }

        toast(t => (
          <span>
            Askerler kışlaya başarıyla alındı. 5 dakikaya hazır olacaklar! TxId:
            {' '}
            <b className="text-break">{res}</b>
            <button type="button" className="btn btn-light float-right" onClick={() => toast.dismiss(t.id)}>
              Kapat
            </button>
          </span>
        ), {
          duration: 20000,
          type: 'success',
        });
      });
    } else {
      toast.error('Kışlada zaten askerler eğitiliyor!');
    }
  };

  const isSoldiersClaimable = async landId => {
    const isSoldierClaimable = await contractRef.current.methods.isSoldiersClaimable(landId).call();
    return isSoldierClaimable;
  };

  const claimSoldiers = async landId => {
    if (!await isTheBarrackBusy(landId)) {
      toast.warning('Kışlada eğitilecek asker yok!');
      return;
    }

    if (await isSoldiersClaimable(landId)) {
      const toastId = toast.loading('Askerler kışladan allınıyor...');
      await contractRef.current.methods.claimSoldiers(landId).send({ from: account }, err => {
        toast.dismiss(toastId);
        if (err) {
          toast.error('Kışla yolunda kaza meydana geldi!');
          return;
        }

        toast(() => (
          <span>
            Askerleriniz savaş için hazır!
          </span>
        ), {
          duration: 20000,
          type: 'success',
        });
      });
    } else {
      toast.warning('Askerlerinizin eğitimi henüz bitmedi!');
    }
  };

  const getSoldierNumberByCityId = async landId => {
    const soldiers = await contractRef.current.methods.getSoldiersByCity(landId).call();
    return soldiers;
  };

  /** ****************************************** */

  /* Events */
  const initEvents = () => {
    contractRef.current.events.BoughtCity(
      (error, event) => {
        console.log('BoughtCity');
        if (!error) {
          const { sender, tokenId } = event.returnValues;
          const cityName = document.getElementById(tokenId).getAttribute('name');
          if (areAccountsEqual(account, sender)) {
            toast.success(`${cityName} şehrini satın aldınız!`, { toastId: 'boughtcity_success' });
          } else {
            toast.info(`${cityName} şehri satın alındı!`, { toastId: 'boughtcity_info' });
          }
          const newData = [...cityOwnerList];
          console.log({ cityOwnerList });
          newData[tokenId - 1] = sender.toLowerCase();
          console.log({ newData });
          setCityOwnerList([...newData]);

          const newOwnerColors = { ...ownerColors };
          console.log({ ownerColors });
          if (!newOwnerColors.hasOwnProperty(sender.toLowerCase())) {
            newOwnerColors[sender.toLowerCase()] = RandomColor();
            console.log({ newOwnerColors });
            setOwnerColors({ ...newOwnerColors });
          }
        }
      },
    ).on('error', error => {
      toast.error(error.message, { toastId: 'boughtcity_error' });
    });

    contractRef.current.events.WonBattle(
      (error, event) => {
        if (!error) {
          const { emperor, conqueredTokenId } = event.returnValues;
          const cityName = document.getElementById(conqueredTokenId).getAttribute('name');
          if (areAccountsEqual(account, emperor)) {
            toast.success(`${cityName} şehri ile olan savaşınızı kazandınız!`, { toastId: 'wonbattle_success' });
          } else {
            toast.info(`${cityName} şehri uzun süren savaşlara dayanamayarak düştü!`, { toastId: 'wonbattle_info' });
          }
          const newData = [...cityOwnerList];
          console.log({ cityOwnerList });
          newData[conqueredTokenId - 1] = emperor;
          console.log({ newData });
          setCityOwnerList([...newData]);
        }
      },
    ).on('error', error => {
      toast.error(error.message, { toastId: 'wonbattle_error' });
    });

    contractRef.current.events.LostBattle(
      (error, event) => {
        if (!error) {
          const { emperor, defenderTokenId } = event.returnValues;
          const cityName = document.getElementById(defenderTokenId).getAttribute('name');
          if (areAccountsEqual(account, emperor)) {
            toast.warn(`${cityName} şehri ile olan savaşınızı kaybettiniz!`, { toastId: 'lostbattle_warn' });
          } else {
            toast.info(`${cityName} şehri uzun süren savaştan galip ayrıldı!`, { toastId: 'lostbattle_info' });
          }
        }
      },
    ).on('error', error => {
      toast.error(error.message, { toastId: 'lostbattle_error' });
    });

    contractRef.current.events.ClaimSoldier(
      (error, event) => {
        if (!error) {
          const { emperor, defenderTokenId } = event.returnValues;
          if (areAccountsEqual(account, emperor)) {
            const cityName = document.getElementById(defenderTokenId).getAttribute('name');
            toast.info(`${cityName} şehrinde askerleriniz orduya katıldı!`, { toastId: 'claimsoldier_info' });
          }
        }
      },
    ).on('error', error => {
      toast.error(error.message, { toastId: 'claimsoldier_error' });
    });
  };
  /** ****************************************** */

  useEffect(() => {
    setIsMetaMaskInstalled(window.ethereum !== undefined);
  }, []);

  useEffect(() => {
    if (isMetaMaskInstalled) {
      if (initflag) {
        console.log('--init useEffect--');
        LoadingHelper.ShowLoading();
        setInıtFlag(false);
        initMetaMask();
        web3Ref.current = new Web3(window.ethereum);
        contractRef.current = new web3Ref.current.eth.Contract(FetihContract.ABI, FetihContract.ADDRESS);
        initEvents();
        const fetchData = async () => {
          const newCityOwners = await cityOwners();
          const newOwnerColors = {};

          newCityOwners.map(m => m.toLowerCase()).forEach(e => {
            if (!areAccountsEqual(e, FetihContract.ADDRESS) && !newOwnerColors.hasOwnProperty(e)) {
              newOwnerColors[e] = RandomColor();
            }
          });

          setCityOwnerList(newCityOwners.map(m => m.toLowerCase()));
          setOwnerColors(newOwnerColors);
          LoadingHelper.HideLoading();
        };
        fetchData();
      }
    }
  }, [isMetaMaskInstalled, initflag]);

  return (
    <MetaMaskContext.Provider
      value={{
        isMetaMaskInstalled,
        connectMetaMask,
        account,
        chainId,
        contractRef,
        battle,
        buyLand,
        produceSoldiers,
        isTheBarrackBusy,
        getSoldierNumberByCityId,
        cityOwners,
        isSoldiersClaimable,
        claimSoldiers,
        cityOwnerList,
        ownerColors,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
}

MetaMaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MetaMaskContext, MetaMaskConsumer, MetaMaskProvider };
