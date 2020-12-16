import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class SamlConsume extends Component {
  constructor(props){
    super()
    localStorage.setItem("loggedIn", true)
  }
  
  setAttributes = () => {
    axios.get("http://localhost:8080/saml/attributes").then( (response) => {
      let name = response.data.display_name.split(" ");
      localStorage.setItem("firstName", name[0]);
      localStorage.setItem("lastName", name[name.length - 1]);
      localStorage.setItem("email", response.data.eppn);
      localStorage.setItem("affiliation", response.data.affiliaton[0]);
      localStorage.setItem("netid", response.data.netid);
    }).catch( (error) => {
      console.log(error)
    });
  }

  returnToHomePage = () => {
    this.setAttributes();
    return <Redirect to='/' />
  }

  render(){
    return (<div>
      {this.returnToHomePage()}
    </div>);
  }
}

export default SamlConsume;