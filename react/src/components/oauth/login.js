import React, {Component} from 'react';

class OauthLogin extends Component {
    constructor(props){
        super()
    }

    create_oauth_code_request = () => {
            const base_url = "https://oauth.oit.duke.edu/oidc/authorize"
            const redirect_uri = encodeURI(process.env.REACT_APP_OAUTH_REDIRECT_URI)
            const request_url = `${base_url}?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`
          
            console.log("Copy and paste this url into your web browser.");
            console.log(request_url);    
            window.location.href = request_url;
    }

    render(){
        return(
            <button onClick={this.create_oauth_code_request}>Login</button>
        )
    }
}

export default OauthLogin;