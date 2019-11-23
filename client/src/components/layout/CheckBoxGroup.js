import React, { Component } from 'react';
import { Consumer } from '../../context';

export default class CheckBoxGroup extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { name, id, checked } = this.props;
          const updateQueryForm = e => {
            value.dispatch({
              type: 'UPDATE_QUERY_FORM_CHECKBOX',
              payload: {
                name: e.target.name
              }
            });
          };
          return (
            <div className="checkbox-group" id={id}>
              {checked ? (
                <input
                  type="checkbox"
                  name={name}
                  onChange={updateQueryForm}
                  checked
                />
              ) : (
                <input type="checkbox" name={name} onChange={updateQueryForm} />
              )}
              <label htmlFor={name}>{name}</label>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
