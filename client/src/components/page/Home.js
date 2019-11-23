import React from 'react';

export default function Home() {
  return (
    <div className="home-body">
      <h2>a prototype version of Tutor Here CRUD web app</h2>
      <p>for 2019/20 CUCP44 DB SYS class</p>
      <br />
      <p className="italic">this site allow you to do the following ...</p>
      <div className="info-group">
        <h3>insert</h3>
        <p>create new user (tutor / student) and insert into DB</p>
      </div>
      <div className="info-group">
        <h3>edit / delete</h3>
        <p>manipulate any tuple from every table available</p>
      </div>
      <div className="info-group">
        <h3>query</h3>
        <p>search tutor from your requirement and view their profile</p>
      </div>
    </div>
  );
}
