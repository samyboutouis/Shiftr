import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class SamlConsume extends Component {
  constructor(props){
    super(props);
    this.state = {loggedIn: false};
  }

  setAttributes = () => {
    let self = this;
    axios.get("http://localhost:8080/saml/attributes").then( (response) => {
      let name = response.data.display_name.split(" ");
      localStorage.setItem("firstName", name[0]);
      localStorage.setItem("lastName", name[name.length - 1]);
      localStorage.setItem("email", response.data.eppn);
      localStorage.setItem("affiliation", response.data.affiliaton[0]);
      localStorage.setItem("netid", response.data.netid);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("group", response.data.group);
      localStorage.setItem("loggedIn", true);
      self.setState({loggedIn: true});
    }).catch( (error) => {
      console.log(error)
    });
  }

  returnToHomePage = () => {
    const res = this.setAttributes();
    if(this.state.loggedIn){
      return <Redirect to='/' />;
    }
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
}

  render(){
    return (<div>
      {this.returnToHomePage()}
    </div>);
  }
}

export default SamlConsume;