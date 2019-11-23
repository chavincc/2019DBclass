import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import './components/main.css';

import { Provider } from './context';
import Nav from './components/layout/Nav';
import Home from './components/page/Home';
import Edit from './components/page/Edit';
import Insert from './components/page/Insert';
import Query from './components/page/Query';
import TutorProfile from './components/page/TutorProfile';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider>
          <Router>
            <Nav />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/edit" component={Edit} />
              <Route exact path="/insert" component={Insert} />
              <Route exact path="/query" component={Query} />
              <Route path="/tutor/:id" component={TutorProfile} />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
