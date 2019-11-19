import React, { Component } from 'react';

import Table from '../layout/Table';
import Sidebar from '../layout/Sidebar';

export default class Edit extends Component {
  render() {
    return (
      <div className="content-body">
        <Sidebar />
        <Table />
      </div>
    );
  }
}
