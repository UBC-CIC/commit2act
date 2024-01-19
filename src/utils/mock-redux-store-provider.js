import * as React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import loginReducer from '../reducers/loginReducer';
import appStateReducer from '../reducers/appStateReducer';

export const mockInitialReduxStore = createStore(
  combineReducers({
    loginState: loginReducer,
    appState: appStateReducer,
  })
);

export const mockAuthReduxStore = createStore(
  combineReducers({
    loginState: () => ({ currentState: 'signedIn' }),
    appState: appStateReducer,
  })
);

export const MockReduxStoreProvider = ({
  children,
  store = mockInitialReduxStore,
  ...props
}) => (
  <Provider store={store} {...props}>
    {children}
  </Provider>
);
