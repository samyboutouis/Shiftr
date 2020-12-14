import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class SamlConsume extends Component {
    constructor(props){
        super()
        localStorage.setItem("loggedIn", true)
    }

   
    returnToHomePage = () => {
        return <Redirect to='/' />
    }

    render(){
        return (<div>
            {this.returnToHomePage()}
        </div>);
    }
}

export default SamlConsume;