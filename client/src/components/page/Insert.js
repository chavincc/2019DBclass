import React, { Component } from 'react';
import { Consumer } from '../../context';

import InputGroup from '../layout/InputGroup';
import RadioGroup from '../layout/RadioGroup';

export default class Insert extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const ifv = value.insertFormValue;
          return (
            <div className="insert-body">
              <div className="general-input">
                {Object.keys(ifv).map(key => {
                  const element = ifv[key];
                  if (element.type === 'radio')
                    return <RadioGroup name={key} formValue={element.value} />;
                  else if (element.type === 'textarea') return <textarea />;
                  else
                    return (
                      <InputGroup
                        name={key}
                        type={element.type}
                        formValue={element.value}
                      />
                    );
                })}
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
