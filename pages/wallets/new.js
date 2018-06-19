import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };
  
  onSubmit = async (e) => {
    e.preventDefault();
    
    this.setState({ loading: true, errorMessage: '' });
    
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });
    } catch (err) {
      this.setState({ errorMessage: err.message.split("\n")[0] });
    }
    
    this.setState({ loading: false }); 
    Router.pushRoute('/');
  }
  
  render() {
    return (
      <Layout>
        <h3>Create a new Campaign</h3>
        
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Set Minimum Contribution</label>
            <Input 
              label='wei' 
              labelPosition='right'
              placeholder='Enter minimum contribution required in wei'
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })}
            />
          </Form.Field>
          
          <Message error header="Oops! Something went wrong..." content={this.state.errorMessage} />
          
          <Button loading={this.state.loading} primary>Create Campaign</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
