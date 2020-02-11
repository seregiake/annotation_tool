/*
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
          Buongiornissimo Caffè??
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

import React, { Component } from 'react';
import ContentRouter from './routes';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';
class App extends Component {
  render() {
    return (
      <div className="App" >
        <NavBar />

        <div style={{ minHeight:500, paddingRight: 50, paddingLeft: 50, paddingTop: 30, paddingBottom: 30 }}>
          <ContentRouter />
        </div>
        
        <Footer />
      </div>
    );
  }
}
export default App;

