import * as React from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const mockReduxStore = createStore(reducers, applyMiddleware(thunk));

export const MockReduxStoreProvider = ({ children, ...props }) => (
  <Provider store={mockReduxStore} {...props}>
    {children}
  </Provider>
);
