import React, { Component } from 'react';
import { Consumer } from '../../context';

export default class QueryInputGroup extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { name, formVal, type, id, disabled } = this.props;
          const updateQueryForm = e => {
            value.dispatch({
              type: 'UPDATE_QUERY_FORM',
              payload: {
                name: e.target.name,
                value: e.target.value
              }
            });
          };
          return (
            <div className="input-group" id={id}>
              <label htmlFor={name}>{name}</label>
              {disabled ? (
                <input
                  id={'input-' + name}
                  onChange={updateQueryForm}
                  name={name}
                  value={formVal}
                  type={type}
                  autoComplete="off"
                  disabled
                />
              ) : (
                <input
                  id={'input-' + name}
                  onChange={updateQueryForm}
                  name={name}
                  value={formVal}
                  type={type}
                  autoComplete="off"
                />
              )}
            </div>
          );
        }}
      </Consumer>
    );
  }
}
