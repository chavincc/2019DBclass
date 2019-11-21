const express = require('express');
const mysql = require('mysql');
const util = require('util');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const databaseName = 'testdb';

const connection = mysql.createConnection({
  host: '35.198.235.22',
  user: 'root',
  password: 'tutorherepassword',
  database: databaseName
});

const query = util.promisify(connection.query).bind(connection);

const typeNeedQuote = type => {
  const t = type.split('(')[0].toLowerCase();
  if (t.includes('int')) return false;
  if (['decimal', 'float', 'double', 'bit'].includes(t)) return false;
  return true;
};

const addQuote = (type, data) => {
  let out = data;
  if (typeNeedQuote(type)) {
    out = `'${data}'`;
  }
  return out;
};

const formatData = (type, data) => {
  if (type.includes('date') || type.includes('time')) {
    data = data.replace('Z', '').replace('T', ' ');
  }
  return data;
};

const getAllTableName = async () => {
  try {
    const qstring =
      "select TABLE_NAME from information_schema.tables where TABLE_TYPE = 'BASE TABLE' and TABLE_SCHEMA='" +
      databaseName +
      "'";
    const row = await query(qstring);
    return row;
  } catch (error) {
    return { error: true };
  }
};

const getColumns = async tableName => {
  try {
    const qstring = 'describe ' + tableName;
    const result = await query(qstring);
    return result;
  } catch (error) {
    return { error: true };
  }
};

const getRows = async tableName => {
  try {
    const qstring = 'select * from ' + tableName;
    const result = await query(qstring);
    return result;
  } catch (error) {
    return { error: true };
  }
};

const deleteFromDB = async (tableName, keys, values, types) => {
  try {
    let v;

    v = typeNeedQuote(types[0]) ? `'${values[0]}'` : values[0];
    let qWhere = `where ${keys[0]}=${v}`;

    for (let i = 1; i < keys.length; i++) {
      v = typeNeedQuote(types[i]) ? `'${values[i]}'` : values[i];
      qWhere += ` and ${keys[i]}=${v}`;
    }

    let qstring = `delete from ${tableName} ${qWhere}`;
    const result = await query(qstring);
    return result;
  } catch (error) {
    return { error: true };
  }
};

const updateDB = async (
  tableName,
  keys,
  values,
  types,
  setKeys,
  setValues,
  setTypes
) => {
  try {
    let v;

    v = typeNeedQuote(setTypes[0]) ? `'${setValues[0]}'` : setValues[0];
    v = formatData(setTypes[0], v);
    let qSet = 'set ';
    qSet += `${setKeys[0]}=${v}`;
    for (let i = 1; i < setKeys.length; i++) {
      v = typeNeedQuote(setTypes[i]) ? `'${setValues[i]}'` : setValues[i];
      v = formatData(setTypes[i], v);
      qSet += `,${setKeys[i]}=${v}`;
    }

    v = typeNeedQuote(types[0]) ? `'${values[0]}'` : values[0];
    v = formatData(types[0], v);
    let qWhere = 'where ';
    qWhere += `${keys[0]}=${v} `;
    for (let i = 1; i < keys.length; i++) {
      v = typeNeedQuote(types[i]) ? `'${values[i]}'` : values[i];
      v = formatData(types[i], v);
      qWhere += `and ${keys[i]}=${v}`;
    }

    let qString = `update ${tableName} ${qSet} ${qWhere}`;

    const result = await query(qString);
    return result;
  } catch (error) {
    return { error: true };
  }
};

const insertIntoDB = async (tableName, keys, values, types) => {
  try {
    let v;

    let sVal = '';
    for (let i = 0; i < values.length; i++) {
      let sValFract = typeNeedQuote(types[0])
        ? `'${values[i][0]}'`
        : values[i][0];
      for (let j = 1; j < values[i].length; j++) {
        v = typeNeedQuote(types[j]) ? `'${values[i][j]}'` : values[i][j];
        sValFract += `, ${v}`;
      }
      sVal += `(${sValFract}),`;
    }
    sVal = sVal.substring(0, sVal.length - 1);

    let sCol = keys[0];
    for (let i = 1; i < keys.length; i++) {
      sCol += `, ${keys[i]}`;
    }

    let qstring = `insert into ${tableName} (${sCol}) values ${sVal}`;
    const result = await query(qstring);
    return result;
  } catch (error) {
    return { error: true };
  }
};

const findUser = async userID => {
  let qstring = `select * from USR where USERID= '${userID}'`;
  const res = await query(qstring);
  return res;
};

app.get('/api/user', (req, res) => {
  const userID = req.query.id;
  findUser(userID)
    .then(value => {
      if (value.length === 0) res.json({ found: false });
      else res.json({ found: true });
    })
    .catch(error => {
      res.json({ error: true, message: error });
    });
});

app.get('/api/allTableName', (req, res) => {
  getAllTableName()
    .then(value => {
      const obj = [];
      value.forEach(o => {
        obj.push(o.TABLE_NAME);
      });
      res.json(obj);
    })
    .catch(() => {
      res.json({ error: true });
    });
});

app.get('/api/columns', (req, res) => {
  const tableName = req.query.tableName;
  getColumns(tableName)
    .then(value => {
      res.json(value);
    })
    .catch(() => res.json({ error: true }));
});

app.get('/api/rows', (req, res) => {
  const tableName = req.query.tableName;

  getRows(tableName)
    .then(value => {
      res.json(value);
    })
    .catch(() => res.json({ error: true }));
});

app.delete('/api/rows', (req, res) => {
  const { tableName, keys, values, types } = req.body;

  try {
    if (tableName && keys && values && types) {
      deleteFromDB(tableName, keys, values, types)
        .then(value => {
          if (value.error) throw error;
          else {
            res.json({ success: true });
          }
        })
        .catch(() => {
          res.json({ error: true });
        });
    } else throw error;
  } catch (error) {
    res.json({
      error: true
    });
  }
});

app.put('/api/rows', (req, res) => {
  const {
    tableName,
    keys,
    values,
    types,
    setKeys,
    setValues,
    setTypes
  } = req.body;
  try {
    if (
      tableName &&
      keys &&
      values &&
      types &&
      setKeys &&
      setValues &&
      setTypes
    ) {
      updateDB(tableName, keys, values, types, setKeys, setValues, setTypes)
        .then(value => {
          if (value.error) throw error;
          else {
            res.json({ success: true });
          }
        })
        .catch(() => {
          res.json({ error: true });
        });
    } else {
      throw error;
    }
  } catch (error) {
    res.json({ error: true });
  }
});

app.post('/api/rows', (req, res) => {
  const { tableName, keys, values, types } = req.body;

  try {
    if (tableName && keys && values && types) {
      insertIntoDB(tableName, keys, values, types)
        .then(value => {
          if (value.error) throw error;
          else {
            res.json({ success: true });
          }
        })
        .catch(() => {
          res.json({ error: true });
        });
    } else throw error;
  } catch (error) {
    res.json({
      error: true
    });
  }
});

app.post('/api/tutor', (req, res) => {
  try {
    const {
      userType,
      userID,
      firstname,
      lastname,
      gender,
      birthday,
      phone,
      username,
      latitude,
      longitude,
      password,
      bio
    } = req.body;
    let qstring = `CALL INSERT_USER(
    ${addQuote('int', userType)},
    ${addQuote('char', userID)}, ${addQuote('char', firstname)},
    ${addQuote('char', lastname)}, ${addQuote('int', gender)},
    ${addQuote('date', birthday)}, ${addQuote('char', phone)},
    ${addQuote('char', username)}, ${addQuote('int', latitude)},
    ${addQuote('int', longitude)}, ${addQuote('char', password)},
    ${addQuote('char', bio)})`;
    query(qstring);
    res.json({ success: true });
  } catch (error) {
    res.json({ error: true });
  }
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
