import { Loading } from 'react-loading-ui';
import { colors } from './Consts';

export const shortenAccountAddress = address =>
  `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

export const LoadingHelper = {
  ShowLoading: settings => {
    if (!document.getElementById('loading-ui')) {
      Loading(settings);
    }
  },
  HideLoading: () => {
    if (document.getElementById('loading-ui')) {
      Loading();
    }
  },
};

export const RandomColor = () => {
  const min = 1;
  const max = 108;
  const rand = Math.floor(min + Math.random() * (max - min));
  return colors[rand];
};
export const percent = (value, total) => (value / total) * 100;

export const areAccountsEqual = (account1, account2) => account1?.toLowerCase() === account2?.toLowerCase();
