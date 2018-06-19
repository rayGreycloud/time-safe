import React, { Component } from 'react';
import { Button, Card, Grid, Table } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    // Promise wrapper around calls for each request
    const requests = await Promise.all(
      // create array with length = # requests
      Array(parseInt(requestsCount))
        .fill()  // fill array
        // iterate over empty items
        .map((element, index) => {
          // get request and put in array at index
          return campaign.methods.requests(index).call();
        })
    );

    return { address, requests, requestsCount, approversCount };
  }
  
  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow 
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Body, Header, HeaderCell, Row } = Table;
    
    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button 
              primary 
              floated="right" 
              style={{ marginBottom: 10 }}
              >Add Request</Button>
          </a>
        </Link>
        
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount (ETH)</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRows()}
          </Body>
        </Table>
        <div>Found {this.props.requestsCount} requests</div>
      </Layout>
    );
  }
}

export default RequestIndex;