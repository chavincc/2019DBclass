import React, { Component } from 'react';
import { Consumer } from '../../context';

export default class RadioGroup extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { name } = this.props;
          const description = value.insertFormValue[name].description;
          const updateInsertForm = e => {
            console.log(e.target.value);
            // value.dispatch({
            //   type: 'UPDATE_INSERT_FORM',
            //   payload: {
            //     name: e.target.name,
            //     value: e.target.value
            //   }
            // });
          };
          return (
            <div className="radio-group">
              <label htmlFor={name}>{name}</label>
              {Object.keys(description).map(key => (
                <div className="radio-fraction">
                  <input
                    type="radio"
                    name={name}
                    value={description[key]}
                    onChange={updateInsertForm}
                  />
                  {key}
                  <br />
                </div>
              ))}
            </div>
          );
        }}
      </Consumer>
    );
  }
}
