import React, { Component } from 'react';
import { Consumer } from '../../context';

export default class InputGroup extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { name, formVal, type, id } = this.props;
          const updateInsertForm = e => {
            value.dispatch({
              type: 'UPDATE_INSERT_FORM',
              payload: {
                name: e.target.name,
                value: e.target.value
              }
            });
          };
          return (
            <div className="input-group" id={id}>
              <label htmlFor={name}>{name}</label>
              <input
                id={'input-' + name}
                onChange={updateInsertForm}
                name={name}
                value={formVal}
                type={type}
                autoComplete="off"
              />
            </div>
          );
        }}
      </Consumer>
    );
  }
}
