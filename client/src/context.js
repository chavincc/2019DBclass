import React, { Component } from 'react';
import Config from './Config';
import uuid from 'uuid';

const Context = React.createContext();

const defaultInsertFormValue = Config.defaultInsertFormValue;

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

    case 'STORE_USER':
      const userType = action.payload;
      const ifvRef = state.insertFormValue;
      const insertBodyData = {};
      Object.keys(ifvRef).forEach(key => {
        if (ifvRef[key].type === 'radio') {
          const ref = ifvRef[key]['description'];
          Object.keys(ref).forEach(k => {
            if (ref[k].checked) insertBodyData[key] = ref[k].value;
          });
        } else {
          insertBodyData[key] = ifvRef[key].value;
        }
      });
      insertBodyData['userID'] = uuid().substring(0, 15);
      insertBodyData['userType'] = userType;
      const tutorInsertRes = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(insertBodyData)
      }).catch(error => {
        alert(error);
      });
      if (tutorInsertRes.ok) {
        const tutorInsertFetchRes = await tutorInsertRes.json();
        if (tutorInsertFetchRes.success) {
          alert('user created');
          return {
            ...state,
            insertFormValue: Config.defaultInsertFormValue
          };
        } else if (tutorInsertFetchRes.error) alert('query error');
        else alert('not query error');
      }

      return state;

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

    case 'UPDATE_INSERT_FORM_RADIO':
      const newInsertRadioValue = state.insertFormValue;

      Object.keys(
        newInsertRadioValue[action.payload.name]['description']
      ).forEach(subitem => {
        const ref =
          newInsertRadioValue[action.payload.name]['description'][subitem];
        if (action.payload.defineAs === subitem) ref.checked = true;
        else ref.checked = false;
      });

      return {
        ...state,
        insertFormValue: newInsertRadioValue
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

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
