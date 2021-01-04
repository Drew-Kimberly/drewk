import React from 'react';

import { ReactComponent as Logo } from './logo.svg';
import star from './star.svg';
import { Navbar } from '@drewk/react-ui/navbar';

import { Route, Link } from 'react-router-dom';

export function App() {
  return (
    <>
      <Navbar></Navbar>
      <h1>
        <br />
        <hr />
        <br />
        <div role="navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/page-2">Page 2</Link>
            </li>
          </ul>
        </div>
        <Route
          path="/"
          exact
          render={() => (
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          )}
        />
        <Route
          path="/page-2"
          exact
          render={() => (
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          )}
        />
      </h1>
    </>
  );
}

export default App;
