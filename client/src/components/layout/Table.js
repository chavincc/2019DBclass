import React, { Component } from 'react';
import { Consumer } from '../../context';

class Table extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const {
            currentTable,
            currentTableCol,
            currentTableRow,
            editMode,
            formValue,
            dispatch
          } = value;
          let idx = 0;

          const enterEdit = e => {
            const idx = parseInt(e.target.id.split('-')[1]);
            dispatch({
              type: 'ENTER_EDIT_MODE',
              payload: {
                mode: true,
                idx
              }
            });
          };

          const signalDelete = e => {
            const idx = parseInt(e.target.id.split('-')[1]);
            const data = {
              tableName: currentTable,
              keys: [],
              values: [],
              types: []
            };
            const rowValue = Object.values(currentTableRow[idx]);
            for (let i = 0; i < currentTableCol.length; i++) {
              if (currentTableCol[i].Key.toLowerCase() === 'pri') {
                data.keys.push(currentTableCol[i].Field);
                data.types.push(currentTableCol[i].Type);
                data.values.push(rowValue[i]);
              }
            }

            fetch('/api/rows', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(data)
            })
              .then(res => res.json())
              .then(res => {
                if (res.error) {
                  alert('error from delete');
                } else {
                  value.dispatch({
                    type: 'REMOVE_TABLE_LOCALLY',
                    payload: idx
                  });
                }
              });
          };

          return (
            <div className="main-table">
              <table>
                <tr>
                  {currentTableCol
                    ? currentTableCol.map(element => {
                        return <th>{element.Field}</th>;
                      })
                    : null}
                  {currentTableCol ? <th></th> : null}
                </tr>
                {editMode ? (
                  <tr id="edit-row">
                    {currentTableCol
                      ? currentTableCol.map(val => (
                          <td>
                            <input
                              form="edit-form"
                              autoComplete="off"
                              value={
                                formValue[val.Field] ? formValue[val.Field] : ''
                              }
                              name={val.Field}
                              onChange={e => {
                                dispatch({
                                  type: 'UPDATE_EDIT_FORM',
                                  payload: {
                                    name: e.target.name,
                                    value: e.target.value
                                  }
                                });
                              }}
                            />
                          </td>
                        ))
                      : null}
                    {currentTableCol ? (
                      <td className="button-cell">
                        <button
                          id="submit-edit-button"
                          form="edit-form"
                          onClick={e => {
                            e.preventDefault();
                            dispatch({
                              type: 'SUBMIT_EDIT_FORM'
                            });
                          }}
                        >
                          submit
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ) : null}

                {currentTableRow
                  ? currentTableRow.map(rows => {
                      return (
                        <tr>
                          {Object.values(rows).map(item => {
                            return <td>{item}</td>;
                          })}
                          <td className="button-cell">
                            <i
                              className="fas fa-pencil-alt edit-button"
                              id={`edit-${idx}`}
                              onClick={enterEdit}
                            ></i>
                            <i
                              className="fas fa-times delete-button"
                              id={`delete-${idx++}`}
                              onClick={signalDelete}
                            ></i>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </table>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default Table;
