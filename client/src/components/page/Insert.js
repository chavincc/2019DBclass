import React, { Component } from 'react';
import { Consumer } from '../../context';

import InputGroup from '../layout/InputGroup';
import RadioGroup from '../layout/RadioGroup';
import TextAreaGroup from '../layout/TextAreaGroup';

export default class Insert extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const ifv = value.insertFormValue;
          let iter = 0;

          const tutorChecked = () => {
            return ifv['type']['description']['tutor']['checked'];
          };

          const formIsValid = () => {
            let isValid = true;
            Object.keys(ifv).forEach(key => {
              if (key === 'bio') {
                if (tutorChecked()) isValid = isValid && ifv[key].value;
              } else if (ifv[key].type === 'radio') {
                const ref = ifv[key].description;
                let check = false;
                Object.keys(ref).forEach(k => {
                  check = check || ref[k].checked;
                });
                isValid = isValid && check;
              } else {
                isValid = isValid && ifv[key].value;
              }
            });
            return isValid;
          };

          const signalInsert = () => {
            if (formIsValid()) {
              value.dispatch({
                type: 'STORE_USER',
                payload: tutorChecked() ? 1 : 0
              });
            }
          };

          return (
            <div className="insert-body-container">
              <h2 class="insert-header">create new user</h2>
              <div className="insert-body">
                {Object.keys(ifv).map(key => {
                  const element = ifv[key];
                  if (element.type === 'radio')
                    return <RadioGroup name={key} id={'fraction-' + iter++} />;
                  else if (element.type === 'textarea')
                    return (
                      <TextAreaGroup
                        name={key}
                        formValue={element.value}
                        id={'fraction-' + iter++}
                        disable={ifv['type']['description']['tutor']['checked']}
                      />
                    );
                  else
                    return (
                      <InputGroup
                        name={key}
                        type={element.type}
                        formValue={element.value}
                        id={'fraction-' + iter++}
                      />
                    );
                })}
                <button
                  id="create-user-button"
                  disabled={!formIsValid()}
                  onClick={signalInsert}
                >
                  {!formIsValid() ? 'Please Complete The Form' : 'Create User'}
                </button>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
