import React, { Component } from 'react';
import { Consumer } from '../../context';

export default class RadioGroup extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { name, id } = this.props;
          const description = value.insertFormValue[name].description;
          const updateInsertForm = e => {
            value.dispatch({
              type: 'UPDATE_INSERT_FORM_RADIO',
              payload: {
                value: e.target.value,
                name: e.target.name,
                defineAs: e.target.id.split('-')[1]
              }
            });
          };
          return description ? (
            <div className="radio-group" id={id}>
              <label htmlFor={name}>{name}</label>
              {Object.keys(description).map(key => (
                <div className="radio-fraction">
                  <input
                    type="radio"
                    name={name}
                    id={'radio-' + key}
                    value={description[key]['value']}
                    checked={description[key]['checked']}
                    onChange={updateInsertForm}
                  />
                  {key}
                </div>
              ))}
            </div>
          ) : null;
        }}
      </Consumer>
    );
  }
}
