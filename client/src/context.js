import React, { Component } from 'react';
import Config from './Config';
import uuid from 'uuid';

const Context = React.createContext();

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
      const tutorInsertRes = await fetch('/api/user', {
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

    case 'UPDATE_QUERY_FORM_CHECKBOX':
      const newQueryCheckboxValue = state.queryFormValue;
      newQueryCheckboxValue[
        action.payload.name
      ].checked = !newQueryCheckboxValue[action.payload.name].checked;
      return {
        ...state,
        queryFormValue: newQueryCheckboxValue
      };

    case 'UPDATE_QUERY_FORM':
      const newQueryValue = state.queryFormValue;
      newQueryValue[action.payload.name].value = action.payload.value;
      return {
        ...state,
        queryFormValue: newQueryValue
      };

    case 'FETCH_TUTOR_DOCS':
      const id = action.payload;
      const getTest = await fetch(`/api/test?id=${id}`);
      const getVideo = await fetch(`/api/video?id=${id}`);
      const getComment = await fetch(`/api/comment?id=${id}`);
      let newTest, newVideo, newComment;
      if (getTest.ok && getVideo.ok && getComment.ok) {
        await getTest
          .json()
          .then(value => {
            newTest = value;
          })
          .catch(() => {
            alert('test query error');
            return state;
          });
        await getVideo
          .json()
          .then(value => {
            newVideo = value;
          })
          .catch(() => {
            alert('video query error');
            return state;
          });
        await getComment
          .json()
          .then(value => {
            newComment = value;
          })
          .catch(() => {
            alert('comment query error');
            return state;
          });
      } else {
        alert('fetch error');
        return state;
      }
      console.log(newTest, newVideo, newComment, id);
      return {
        ...state,
        tutorTest: newTest,
        tutorVideo: newVideo,
        tutorComment: newComment,
        currentTutorId: id
      };

    case 'SEARCH_TUTOR':
      const deg2rad = deg => {
        return deg * (Math.PI / 180);
      };
      const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2 - lat1); // deg2rad below
        let dLon = deg2rad(lon2 - lon1);
        let a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km
        return d;
      };

      const queryValue = {};

      Object.keys(state.queryFormValue).forEach(key => {
        if (state.queryFormValue[key].type === 'checkbox') {
          queryValue[key] = state.queryFormValue[key].checked;
        } else {
          queryValue[key] = state.queryFormValue[key].value;
        }
      });
      const searchRes = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(queryValue)
      });
      if (searchRes.ok) {
        const searchResJson = await searchRes.json();
        if (searchResJson.error) {
          alert('query error');
          return state;
        }

        const filteredSearchRes = [];
        if (queryValue.distance) {
          searchResJson.forEach(tutor => {
            let dist = getDistanceFromLatLonInKm(
              tutor.LATITUDE,
              tutor.LONGITUDE,
              queryValue.myLatitude,
              queryValue.myLongitude
            );
            if (dist < parseInt(queryValue.maxDistance)) {
              filteredSearchRes.push(tutor);
            }
          });
        }
        return {
          ...state,
          searchResult: queryValue.distance ? filteredSearchRes : searchResJson
        };
      } else {
        alert('fetch error');
        return state;
      }

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
    insertFormValue: Config.defaultInsertFormValue,
    //query
    queryFormValue: Config.defaultQueryFormValue,
    searchResult: [],
    tutorTest: null,
    tutorVideo: null,
    tutorComment: null,
    currentTutorId: null,
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
