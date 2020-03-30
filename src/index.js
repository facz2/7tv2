import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import logger from 'redux-logger';
import { compose, createStore, applyMiddleware } from 'redux'
import reducer from './reducers/index'
import App from './components/App';
import './assets/index.css';
import './assets/fonts/icons/style.css'

import persistState from 'redux-localstorage';
import mergePersistedState from 'redux-localstorage/lib/mergePersistedState'
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';


import {connect} from 'react-redux'
import {locale as _locale}  from './lib/i18n' 

export const zip=function(arr){
  return arr.reduce(function(obj, [k, v]){return { ...obj, [k]: v }}, {});
}

export const LOCALSTORAGE_KEY = 'Studios7TV'


export const locale = _locale;

class MyLocaleString extends React.Component{
  render(){
    return <span>{locale.get(this.props.str||"",this.props.params||{})}</span>;
  }
}

MyLocaleString = connect((state)=>({locale: state.locale}))(MyLocaleString);

export const T = function(str,params={}){
  return <MyLocaleString str={str} params={params}/>
}


const storeReducer = compose(
  mergePersistedState()
)(reducer);

const storage = compose(
  filter(['cast','locale'])
)(adapter(window.localStorage));

const enhancer = compose(
  applyMiddleware(logger),
  persistState(storage, LOCALSTORAGE_KEY)
);

export const store = createStore(storeReducer , enhancer);

ReactDOM.render(
  <Provider store={store}>
  <App />
  </Provider>,
  document.getElementById('root')
);
