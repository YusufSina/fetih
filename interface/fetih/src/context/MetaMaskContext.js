/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useEffect, useRef, useState } from 'react';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { FetihContract } from '../helpers/Consts';

const MetaMaskContext = React.createContext();
const MetaMaskConsumer = MetaMaskContext.Consumer;

function MetaMaskProvider({ children }) {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
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

  useEffect(() => {
    setIsMetaMaskInstalled(window.ethereum !== undefined);
  }, []);

  useEffect(() => {
    if (isMetaMaskInstalled) {
      initMetaMask();
      web3Ref.current = new Web3(window.ethereum);
      contractRef.current = new web3Ref.current.eth.Contract(FetihContract.ABI, FetihContract.ADDRESS);
    }
  }, [isMetaMaskInstalled]);

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
