import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';
// Using uppercase to avoid collision plus it's quasi-constructor function 
import Campaign from '../../ethereum/campaign';
import { Link } from '../../routes';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    // Get specific campaign instance
    const campaign = Campaign(props.query.address);
    // Returns array-like object
    const details = await campaign.methods.getDetails().call();

    // Details translation layer
    return {
      address: props.query.address, 
      minimumContribution: details[0],
      balance: details[1],
      requestsCount: details[2],
      approversCount: details[3],
      manager: details[4]
    };
  }
  
  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount  
    } = this.props;
        
    const items = [
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'The current balance in ether connected to this Campaign.'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of Approvers for this Campaign. Approvers have contributed the miniumum contribution amount or more.'
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'The minimum contribution amount in wei required to become an Approver.'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'Number of requests to withdraw money from the Campaign. Requests must be approved by a majority of the Approvers.'
      },
      {
        header: manager,
        meta: 'Manager address',
        description: 'Manager who created this Campaign. Only party able to create and finalize requests.',
        style: { overflowWrap: 'break-word' }
      }
    ];
    
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h4>{this.props.address}</h4>
        <hr style={{ height: '1px', border: '0', boxShadow: 'inset 0 2px 1px -2px rgba(0,0,0,0.5)' }}/>        
        <h3>Campaign Details</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}  
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button 
                    content="View Requests" 
                    primary
                  />
                </a>
              </Link>
            </Grid.Column>           
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
