import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component { 
  onApprove = async () => {
    const campaign = Campaign(this.props.address);   
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
  }
  
  onFinalize = async () => {
    const campaign = Campaign(this.props.address);   
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });    
  }

  render() {
    const { Cell, Row } = Table;
    const { id, request, approversCount } = this.props;
    const { description, value, recipient, approvalCount } = request;
    const readyToFinalize = request.approvalCount > approversCount / 2;   
    
    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{description}</Cell>
        <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>{approvalCount}/{approversCount}</Cell>
        <Cell>
          {request.complete ? null : (
            <Button 
              onClick={this.onApprove}
              color="green" 
              basic
            >Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (          
            <Button 
              onClick={this.onFinalize}
              color="teal" 
              basic
            >Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
