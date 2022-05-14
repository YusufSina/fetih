import { Loading } from 'react-loading-ui';

export const shortenAccountAddress = address => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

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

export const percent = (value, total) => (value / total) * 100;
