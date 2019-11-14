import React from 'react';
import logo from './logo.svg';
import './App.css';
import {authLogin, authLogout, authSignup} from "./auth";
import { getTodos } from "./api";

import ApolloClientBoost from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { gql } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

function App() {

  /**
   * REST
   */

  const signUp = e => {
    e.preventDefault();
    authSignup({ email: 'user@example.com', password: 'userexamplepwd' });
  };

  const logIn = e => {
    e.preventDefault();
    authLogin({ email: 'user@example.com', password: 'userexamplepwd' })
  };

  const logOut = e => {
    e.preventDefault();
    authLogout();
  };

  const fetchTodos = e => {
    e.preventDefault();
    getTodos();
  };

  /**
   * Apollo
   */

  const clientBoost = new ApolloClientBoost({
    uri: 'http://localhost:3000/graphql',
    fetchOptions: {
      credentials: 'include', // does not include cookies
    },
    request: async operation => {
      operation.setContext({
        headers: {
          'X-CSRF-TOKEN': localStorage.csrf
        }
      })
    }
  });

  const client = new ApolloClient({
    link: createHttpLink({
      uri: 'http://localhost:3000/graphql', // only local URI (localhost:3001) -> ApolloClient from 'apollo-client'
      credentials: 'include',
      headers: {
        'X-CSRF-TOKEN': localStorage.csrf
      }
    }),
    cache: new InMemoryCache()
  });

  const FETCH_TODOS = gql`
    { allTodos { title } }
  `;

  const fetchTodosGQL = () => {
    client
      .query({ query: FETCH_TODOS })
      .then(result => console.log(result));
  };

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <div>
          <h2>REST</h2>
          <button onClick={signUp}>Sign Up</button>
          <button onClick={logIn}>Log In</button>
          <button onClick={logOut}>Log Out</button>
          <button onClick={fetchTodos}>Get todos</button>
        </div>

        <div>
          <h2>GraphQL</h2>
          <button onClick={fetchTodosGQL}>Get todos</button>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
