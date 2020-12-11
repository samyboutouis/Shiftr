import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import 'bootstrap/dist/css/bootstrap.min.css';

// TODO consider doing something like this to handle global host url
// in addition to adding auth to all you requests by default
// axios.defaults.baseURL = process.env.REACT_APP_DISCOVER_API_HOST 
// axios.defaults.headers.common['Authorization'] = bearerToken();

ReactDOM.render(
  (<React.StrictMode>
    <App />
  </React.StrictMode>),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
