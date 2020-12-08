import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class OauthLogin extends Component {
    constructor(props){
        super()
        this.state = { oauthCode: false, oauthAccessToken: false }
        this.checkOauthCode()
    }

    create_oauth_code_request = () => {
        const base_url = "https://oauth.oit.duke.edu/oidc/authorize"
        const redirect_uri = encodeURI(process.env.REACT_APP_OAUTH_REDIRECT_URI)
        const request_url = `${base_url}?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`
        
        console.log("Copy and paste this url into your web browser.");
        console.log(request_url);    
        window.location.href = request_url;
    }

    checkOauthCode = () => {
        let url_string = window.location.href
        let url = new URL(url_string);
        let code = url.searchParams.get("code");
        if(code){
          this.getAccessToken(code)
        }
    }

    getAccessToken = (code) => {
        var self = this;
        let url = process.env.REACT_APP_PRINT_BACKEND_HOST + "/oauth?code=" + code + "&claims=profile"
        axios.get(url)
          .then(function (response) {
            console.log(response);
            localStorage.setItem('accessToken', response.data.access_token);
            localStorage.setItem('idToken', response.data.id_token);
            self.setState({oauthAccessToken: true})
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    
    showActiveCode = () => {
        if (this.state.oauthAccessToken) {
            console.log(localStorage.getItem('accessToken'))
            return <Redirect to='/' />
        } 
    }

    render(){
        let button;
        button = <button onClick={this.create_oauth_code_request}>Login</button>
        return button;
    }
}

export default OauthLogin;