import React, { Component } from 'react';
import { Consumer } from '../../context';
import { Link } from 'react-router-dom';

import CheckBoxGroup from '../layout/CheckBoxGroup';
import QueryInputGroup from '../layout/QueryInputGroup';
import { isNull } from 'util';

export default class Query extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const qfv = value.queryFormValue;
          const queryFormValueArr = Object.keys(qfv);
          const { searchResult } = value;

          const formIsValid = () => {
            let returnBool = true;

            if (!qfv.male.checked && !qfv.female.checked) returnBool = false;
            Object.keys(qfv).map(key => {
              if (qfv[key].type !== 'checkbox') {
                if (
                  qfv[qfv[key].dependency].checked &&
                  isNull(qfv[key].value)
                ) {
                  returnBool = returnBool && false;
                }
              }
              return null;
            });
            return returnBool;
          };

          const signalSearch = () => {
            value.dispatch({
              type: 'SEARCH_TUTOR'
            });
          };

          let idIncrementer = 0;

          return (
            <div className="query-body">
              <div className="query-header">
                <h3>Search Tutor</h3>
              </div>
              <div className="query-form">
                {qfv
                  ? queryFormValueArr.map(key => {
                      if (qfv[key].type === 'checkbox') {
                        return (
                          <CheckBoxGroup
                            name={key}
                            id={'query-' + idIncrementer++}
                            checked={qfv[key].checked}
                          />
                        );
                      } else {
                        return (
                          <QueryInputGroup
                            name={key}
                            type={qfv[key].type}
                            value={qfv[key].type}
                            id={'query-' + idIncrementer++}
                            disabled={!qfv[qfv[key].dependency].checked}
                          />
                        );
                      }
                    })
                  : null}

                <button
                  disabled={!formIsValid()}
                  onClick={signalSearch}
                  id={'query-' + idIncrementer++}
                >
                  Search Tutor
                </button>
                <div className="line" id={'query-' + idIncrementer++}></div>
                <div className="line" id={'query-' + idIncrementer++}></div>
              </div>

              <div className="search-result-body">
                {searchResult.map(obj => {
                  const { TUTORID, FIRSTNAME, LASTNAME } = obj;
                  return (
                    <Link
                      className="tutor-card"
                      id={'tutor-' + TUTORID}
                      to={`/tutor/${TUTORID}`}
                    >
                      {FIRSTNAME} {LASTNAME}
                    </Link>
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
