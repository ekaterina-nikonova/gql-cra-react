import React, { useEffect } from 'react';
import './App.css';
import {authLogin, authLogout, authSignup} from "./auth";
import { getTodos } from "./api";

import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';

import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import ActionCable from 'actioncable'
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink'
import { ApolloLink } from 'apollo-link'

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

  const httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql',
    credentials: 'include',
    headers: { 'X-CSRF-TOKEN': localStorage.csrf }
  });

  const hasSubscriptionOperation = ({ query: { definitions } }) => {
    return definitions.some(
      ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription',
    )
  };

  const cable = ActionCable.createConsumer('ws://localhost:3000/cable');

  const link = ApolloLink.split(
    hasSubscriptionOperation,
    new ActionCableLink({ cable }),
    httpLink
  );

  const client = new ApolloClient({
    link,
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

        <Todos />
      </div>
    </ApolloProvider>
  );
}

const Todos = () => {
  const FETCH_TODOS = gql`
      { allTodos { title, id } }
  `;

  return (
    <Query query={FETCH_TODOS}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error</div>;

        const todosToRender = data.allTodos;

        return (
          <div>
            <h3>To-dos</h3>
            <TodoList todos={todosToRender} subscribeToMore={subscribeToMore} />
          </div>
        )
      }}
    </Query>
  );
};

const TodoList = ({ todos, subscribeToMore }) => {
  // Move out of render() to prevent duplicates
  // https://github.com/apollographql/react-apollo/issues/2656
  useEffect(() => subscribe(subscribeToMore), []);

  const TODO_ADDED = gql`
      subscription {
          todoAdded {
              id
              title
          }
      }
  `;

  const subscribe = subscribeToMore => {
    subscribeToMore({
      document: TODO_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const todoAdded = subscriptionData.data.todoAdded;

        return Object.assign({}, prev, {
          allTodos: [todoAdded, ...prev.allTodos],
          __typename: prev.allTodos.__typename
        })
      }
    })
  };

  return (
    todos.map(todo => <Todo key={todo.id} todo={todo} />)
  );
};

const Todo = ({ todo }) => <div>{todo.title}</div>;

export default App;
