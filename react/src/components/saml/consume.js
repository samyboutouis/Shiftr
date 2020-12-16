import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class SamlConsume extends Component {
  constructor(props){
    super()
    localStorage.setItem("loggedIn", true)
  }
  
  setAttributes = () => {
    let self = this;
    axios.get("http://localhost:8080/saml/attributes").then( (response) => {
      console.log(response.data);
    }).catch( (error) => {
      console.log(error)
    });
    // localStorage.setItem("netid", this.state.attributes.netid);
    // console.log(this.state.attributes.netid);
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