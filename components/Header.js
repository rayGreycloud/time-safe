import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '1rem' }}>
      <Link route="/">
        <a href="" className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a href="" className="item">Campaigns</a>
        </Link>
        <Link route="/campaigns/new">
          <a href="" className="item">+</a>
        </Link>        

      </Menu.Menu>
    </Menu>
  );
};
