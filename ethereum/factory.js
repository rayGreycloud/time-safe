import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
import address from './contractDeployAddress';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  address.address
);

export default instance;
