import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: null
    };
  }

  changeCurrent = e => {
    this.setState({
      currentPage: e.target.id
    });
  };

  render() {
    const { currentPage } = this.state;
    return (
      <div className="main-nav">
        <div className="container">
          <div className="nav-left">
            <p className="nav-brand">Tutor Here</p>
          </div>
          <div className="nav-right">
            <Link
              className={
                currentPage === 'nav-insert'
                  ? 'nav-item nav-current'
                  : 'nav-item'
              }
              id="nav-insert"
              to="/insert"
              onClick={this.changeCurrent}
            >
              insert
            </Link>
            <Link
              className={
                currentPage === 'nav-update-delete'
                  ? 'nav-item nav-current'
                  : 'nav-item'
              }
              id="nav-update-delete"
              to="/edit"
              onClick={this.changeCurrent}
            >
              edit / delete
            </Link>
            <Link
              className={
                currentPage === 'nav-query'
                  ? 'nav-item nav-current'
                  : 'nav-item'
              }
              id="nav-query"
              to="/query"
              onClick={this.changeCurrent}
            >
              query
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Nav;
