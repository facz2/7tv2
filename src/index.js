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

import Locale from './lib/simple-locale'
import {connect} from 'react-redux'

export const zip=function(arr){
  return arr.reduce(function(obj, [k, v]){return { ...obj, [k]: v }}, {});
}

export const LOCALSTORAGE_KEY = 'Studios7TV'

const langFiles = require.context("./i18n", true, /^(.*\.(json$))/i);
const localeNames = langFiles.keys().map((i)=>{
  let L=i.match(/([a-z]{2}_[a-z]{2})/gi)
  if (L) return L[0]; return null;
}).filter((i)=>(i!==null))

export const locale = new Locale(localeNames.reduce((obj,v)=>( {...obj,[v]:v}),{}));
langFiles.keys().forEach((file,i)=>{ locale.load(locale[localeNames[i]], langFiles(file));});


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
