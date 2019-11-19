import React, { Component } from 'react';

const Context = React.createContext();

const defaultInsertFormValue = {
  username: {
    value: '',
    type: 'text'
  },
  password: {
    value: '',
    type: 'password'
  },
  firstname: {
    value: '',
    type: 'text'
  },
  lastname: {
    value: '',
    type: 'text'
  },
  gender: {
    value: 0,
    type: 'radio',
    description: {
      male: 0,
      female: 1
    }
  },
  birthday: {
    value: '',
    type: 'date'
  },
  latitude: {
    value: 0,
    type: 'number'
  },
  longitude: {
    value: 0,
    type: 'number'
  },
  isTutor: {
    value: 0,
    type: 'radio',
    description: {
      student: 0,
      tutor: 1
    }
  },
  bio: {
    value: '',
    type: 'textarea'
  }
};

const reducer = async (state, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_TABLE':
      try {
        const tableName = action.payload;
        const currentRowRes = await fetch(`/api/rows?tableName=${tableName}`);
        const currentColRes = await fetch(
          `/api/columns?tableName=${tableName}`
        );
        if (currentRowRes.ok && currentColRes.ok) {
          const currentRow = await currentRowRes.json();
          const currentCol = await currentColRes.json();
          if (currentRow.error || currentCol.error) {
            throw 'query error';
          } else {
            return {
              ...state,
              currentTable: action.payload,
              currentTableRow: currentRow,
              currentTableCol: currentCol,
              editMode: false
            };
          }
        } else {
          throw 'fetch error';
        }
      } catch (error) {
        alert(error);
        return state;
      }

    case 'ENTER_EDIT_MODE':
      const { idx, mode } = action.payload;

      const formValue = [];
      for (let i = 0; i < state.currentTableCol.length; i++) {
        const colName = state.currentTableCol[i].Field;
        formValue[colName] = state.currentTableRow[idx][colName].toString(10);
      }
      return {
        ...state,
        editMode: mode,
        editIdx: idx,
        formValue: formValue
      };

    case 'REMOVE_TABLE_LOCALLY':
      const targetIdx = action.payload;
      let newRows = [];
      for (let i = 0; i < state.currentTableRow.length; i++) {
        if (i !== targetIdx) {
          newRows.push(state.currentTableRow[i]);
        }
      }
      return {
        ...state,
        currentTableRow: newRows,
        editMode: false
      };

    case 'UPDATE_EDIT_FORM':
      const { name, value } = action.payload;
      const updatedFormValue = state.formValue;
      updatedFormValue[name] = value;
      return {
        ...state,
        formValue: updatedFormValue
      };

    case 'SUBMIT_EDIT_FORM':
      const setTypes = [];
      for (let i = 0; i < state.currentTableCol.length; i++)
        setTypes.push(state.currentTableCol[i].Type);
      const objectBody = {
        tableName: state.currentTable,
        types: [],
        keys: [],
        values: [],
        setTypes,
        setKeys: Object.keys(state.formValue),
        setValues: Object.values(state.formValue)
      };
      for (let i = 0; i < state.currentTableCol.length; i++) {
        if (state.currentTableCol[i].Key.toLowerCase() === 'pri') {
          objectBody.keys.push(state.currentTableCol[i].Field);
          objectBody.types.push(state.currentTableCol[i].Type);
          objectBody.values.push(
            Object.values(state.currentTableRow[state.editIdx])[i]
          );
        }
      }
      console.log(objectBody);
      const postRes = await fetch('/api/rows', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(objectBody)
      });
      if (postRes.ok) {
        const postResStatus = await postRes.json();
        if (postResStatus.success) {
          let editedRows = [];
          for (let i = 0; i < state.currentTableRow.length; i++) {
            if (i !== state.editIdx) editedRows.push(state.currentTableRow[i]);
            else editedRows.push(Object.values(state.formValue));
          }
          return {
            ...state,
            editMode: false,
            currentTableRow: editedRows
          };
        } else {
          return state;
        }
      } else {
        return state;
      }

    case 'UPDATE_INSERT_FORM':
      const newInsertFormValue = state.insertFormValue;
      newInsertFormValue[action.payload.name]['value'] = action.payload.value;
      return {
        ...state,
        insertFormValue: newInsertFormValue
      };

    default:
      return state;
  }
};

export class Provider extends Component {
  state = {
    //general
    allTableName: [],
    currentTable: null,
    currentTableCol: null,
    currentTableRow: null,
    //edit
    editMode: false,
    editIdx: null,
    formValue: {},
    //insert
    insertFormValue: defaultInsertFormValue,
    //reducer
    dispatch: action => {
      reducer(this.state, action)
        .then(state => {
          this.setState({
            ...state
          });
        })
        .catch(error => {
          alert(error);
          this.setState(this.state);
        });
    }
  };

  async componentDidMount() {
    const response = await fetch('/api/allTableName');
    let allTableName = [];
    if (response.ok) {
      allTableName = await response.json();
    } else {
      alert(response.status);
    }

    this.setState({
      ...this.state,
      allTableName
    });

    this.state.dispatch({
      type: 'CHANGE_CURRENT_TABLE',
      payload: allTableName[0]
    });
  }

  // componentDidUpdate() {
  //   console.log('update');
  // }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
