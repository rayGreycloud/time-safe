const assert = require('assert');
const ganache = require('ganache-cli')
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // deploy new factory
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });
    
  factory.setProvider(provider);
  
  // create campaign
  await factory.methods.createCampaign('10000000').send({
    from: accounts[0],
    gas: '1000000'
  });
  
  // get first item in deployed campaigns array using destructuring 
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // get test instance of campaign 
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe('Campaigns', () => {
  it('should deploy a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  
  it('should mark caller as campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });
  
  it('should allow user to contribute and mark as approver', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],      
      value: '10000000'
    });
    // mapping returns bool
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    // if false, then not contributor and test fails
    assert(isContributor);
  });
  
  it('should allow contribution if equal or greater than minimum', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[2],      
        value: '10000000'
      });
    } catch (err) {
      // If err then test failed
      assert(false);
      return;
    }
    // If no error, test passed
    assert(true);    
  });
  
  it('should not allow contribution if less than minimum', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[3],
        value: '1000000'
      });
    } catch (err) {
      // If err then test passed
      assert(true);
      return;
    }
    // If no error, test failed
    assert(false);    
  });
  
  it('should allow manager to create request', async () => {
    await campaign.methods
      .createRequest('Buy Widgets', '1000000', accounts[4])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    
    const request = await campaign.methods.requests(0).call();
    
    assert.equal('Buy Widgets', request.description);
    assert.equal(accounts[4], request.recipient);
    assert.equal(false, request.complete);
  });
  
  it('should not allow contributor to create request', async () => {
    // New contributor
    await campaign.methods.contribute().send({
      from: accounts[5],  
      value: '10000000'
    });    
    // Contributor calls createRequest
    try {
    await campaign.methods
      .createRequest('Buy Widgets', '1000000', accounts[4])
      .send({
        from: accounts[5],
        gas: '1000000'
      });
    } catch (err) {
      // If error, test passes 
      assert(true);
      return;
    }
    // If no error, test fails
    assert(false);
  });
  
  it('should process requests', async () => {
    let balance = await web3.eth.getBalance(accounts[7]);
    balance = web3.utils.fromWei(balance, 'ether');
    startBalance = parseFloat(balance);
        
    await campaign.methods.contribute().send({
      from: accounts[6],    
      value: web3.utils.toWei('10', 'ether')
    });    
    
    await campaign.methods
      .createRequest('Buy Widgets', web3.utils.toWei('5', 'ether'), accounts[7])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    
    await campaign.methods
      .approveRequest(0)
      .send({
        from: accounts[6],
        gas: '1000000'      
      });
    
    await campaign.methods
      .finalizeRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'        
      });
    
    balance = await web3.eth.getBalance(accounts[7]);
    balance = web3.utils.fromWei(balance, 'ether');
    endBalance = parseFloat(balance);
    
    assert(endBalance = startBalance + 5);  
  });
});
