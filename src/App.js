import React from 'react';
import logo from './logo.svg';
import './App.css';
import {authLogin, authLogout, authSignup} from "./auth";
import { getTodos } from "./api";

function App() {
  const signUp = e => {
    e.preventDefault();
    authSignup({ email: 'john@doe.com', password: 'johndoe123' });
  };

  const logIn = e => {
    e.preventDefault();
    authLogin({ email: 'john@doe.com', password: 'johndoe123' })
  };

  const logOut = e => {
    e.preventDefault();
    authLogout();
  };

  const fetchTodos = e => {
    e.preventDefault();
    getTodos();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <button onClick={signUp}>Sign Up</button>
        <button onClick={logIn}>Log In</button>
        <button onClick={logOut}>Log Out</button>
        <button onClick={fetchTodos}>Get todos</button>
      </header>
    </div>
  );
}

export default App;
