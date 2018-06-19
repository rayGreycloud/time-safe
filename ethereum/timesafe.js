import web3 from './web3';
import Timesafe from './build/TimeLockedWallet.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(Timesafe.interface), address);
};
