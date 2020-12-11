import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class OauthConsume extends Component {
    constructor(props){
        super()
        this.state = { oauthCode: false, oauthAccessToken: false, userPresent: false}
    }

    getAccessToken = (code) => {
        console.log("GETTING TOKEN")
        var self = this;
        let url = process.env.REACT_APP_EXPRESS_OAUTH_UR + "?code=" + code + "&claims=profile"
        axios.get(url)
          .then(function (response) {
            localStorage.setItem('accessToken', response.data.access_token);
            localStorage.setItem('idToken', JSON.stringify(response.data.id_token));
            self.setState({oauthAccessToken: true})
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    
    showActiveCode = () => {
        if (this.state.oauthAccessToken) {
            //console.log(this.state.oauthAccessToken);
            //console.log(localStorage.getItem('accessToken'));
            return <Redirect to='/' />
        } 
    }

    render(){
        return (<div>
            {this.showActiveCode()}
        </div>);
    }
}

export default OauthConsume;