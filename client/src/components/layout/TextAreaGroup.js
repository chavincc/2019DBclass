import React, { Component } from 'react';
import { Consumer } from '../../context';

export default class TextAreaGroup extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { name, formValue, id, disable } = this.props;
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
            <div className="text-area-group" id={id}>
              <label htmlFor={name}>{name}</label>
              <textarea
                name={name}
                id={'text-area-' + name}
                cols="30"
                rows="10"
                value={formValue}
                onChange={updateInsertForm}
                spellCheck="false"
                maxLength="200"
                disabled={!disable}
              ></textarea>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
