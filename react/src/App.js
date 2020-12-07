import React from 'react';
import './App.css';
import Home from "./components/home"
import OauthLogin from "./components/oauth/login"

function App() {
  return (
    <div>
      <Home />
      <OauthLogin />
    </div>
  
  );
}

export default App
