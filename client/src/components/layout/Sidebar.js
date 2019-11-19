import React, { Component } from 'react';
import { Consumer } from '../../context';
import uuid from 'uuid';

class Sidebar extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { currentTable, allTableName } = value;

          return (
            <div
              className="sidebar"
              onClick={e => {
                if (e.target.className === 'sidebar-item') {
                  const targetTable = e.target.id.split('-')[2];
                  value.dispatch({
                    type: 'CHANGE_CURRENT_TABLE',
                    payload: targetTable
                  });
                }
              }}
            >
              <ul>
                {allTableName.map(element => {
                  return (
                    <li
                      className={
                        element === currentTable
                          ? 'sidebar-item sidebar-current'
                          : 'sidebar-item'
                      }
                      key={uuid()}
                      id={'sidebar-item-' + element}
                    >
                      {element}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default Sidebar;
