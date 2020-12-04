import React, {Component} from 'react';
import axios from 'axios';

class OauthLogin extends Component {
    constructor(props){
        super()
        this.state = {notLoggedIn : true};
    }

    create_oauth_code_request = () => {
        const base_url = "https://oauth.oit.duke.edu/oidc/authorize"
        const redirect_uri = encodeURI(process.env.REACT_APP_OAUTH_REDIRECT_URI)
        const request_url = `${base_url}?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`
        
        console.log("Copy and paste this url into your web browser.");
        console.log(request_url);    
        window.location.href = request_url;
    }

    // componentDidUpdate = () => {
    //     this.check_login();
    // }

    // check_login = () => {
    //     let self = this;
    //     console.log('making web call');
    //     axios.get("http://localhost:8080/oauth/login").then( (response) => {
    //     self.setState({notLoggedIn: response.data})
    //     }).catch( (error) => {
    //     console.log(error)
    //     });
    // }

    render(){
        let button;
        if(this.state.notLoggedIn){
            button = <button onClick={this.create_oauth_code_request}>Login</button>
        }
        else{
            button = null;
        }
        return button;
    }
}

export default OauthLogin;