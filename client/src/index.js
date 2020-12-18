import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes'

//redux
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import reducers from './store/reducers'
import promiseMiddleware from 'redux-promise'
import {composeWithDevTools} from 'redux-devtools-extension'

const storeWithMiddleware = createStore(reducers, composeWithDevTools(applyMiddleware(promiseMiddleware)))

ReactDOM.render(
  <Provider store={storeWithMiddleware}>
    <Routes></Routes>
  </Provider>

,
  document.getElementById('root')
);
