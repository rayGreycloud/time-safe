pragma solidity ^0.4.17;

contract CampaignFactory {
  address[] public deployedCampaigns;
  
  function createCampaign(uint minimum) public {
    address newCampaign = new Campaign(minimum, msg.sender);
    deployedCampaigns.push(newCampaign);
  }
  
  function getDeployedCampaigns() public view returns (address[]) {
    return deployedCampaigns;
  }
}

contract Campaign {
  struct Request {
    string description;
    uint value;
    address recipient;
    bool complete;
    uint approvalCount;
    /* hashmap of contributor approvals*/
    mapping(address => bool) approvals;
  }
  
  Request[] public requests;  
  address public manager;
  uint public minimumContribution;
  uint public approversCount;
  /* hashmap of contributors */
  mapping(address => bool) public approvers;
  
  modifier restricted() {
    require(msg.sender == manager);
    _;
  }
  
  function Campaign(uint minimum, address creator) public {
    /* set campaign creator as manager */
    manager = creator;
    /* set minimum contribution requirement for campaign */
    minimumContribution = minimum;
  }
  
  function contribute() public payable {
    /* minimum contribution check */
    require(msg.value >= minimumContribution);
    /* add contributor to hashmap list */
    approvers[msg.sender] = true;
    /* increment approvers count */
    approversCount++;
  }
  
  function createRequest(string description, uint value, address recipient) public restricted {
    /* throws err if not marked memory - can't be storage */
    Request memory newRequest = Request({
      description: description,
      value: value,
      recipient: recipient,
      complete: false,
      approvalCount: 0
    });
    /* push new request into array of Requests */
    requests.push(newRequest);
  }
  
  function approveRequest(uint index) public {
    /* marked storage because want to manipulate storage variable */
    Request storage request = requests[index];
    /* must be contributor */
    require(approvers[msg.sender]);
    /* must not have approved already */
    require(!request.approvals[msg.sender]);

    /* add approver to hashmap list of approvals */
    request.approvals[msg.sender] = true;
    /* increment approval count */
    request.approvalCount++;
  }
  
  function finalizeRequest(uint index) public restricted {
    Request storage request = requests[index]; 

    require(request.approvalCount > (approversCount / 2));  
    require(!request.complete);

    request.recipient.transfer(request.value);
    request.complete = true;
  }
  
  /* get campaign details */
  function getDetails() public view returns (
    uint,
    uint,
    uint,
    uint,
    address
  )
  {
    return (
      minimumContribution,
      this.balance,
      requests.length,
      approversCount,
      manager
    );
  }
  
  /* get number of requests */
  function getRequestsCount() public view returns (uint) {
    return requests.length;
  }
  
}
