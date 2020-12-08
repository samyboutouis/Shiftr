import React, {Component} from 'react';

class OauthLogin extends Component {
    constructor(props){
        super()
        this.state = { oauthCode: false, oauthAccessToken: false }
    }

    create_oauth_code_request = () => {
        const base_url = "https://oauth.oit.duke.edu/oidc/authorize"
        const redirect_uri = encodeURI(process.env.REACT_APP_OAUTH_REDIRECT_URI)
        const request_url = `${base_url}?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`
        window.location.href = request_url;
    }

    render(){
        let button;
        button = <button onClick={this.create_oauth_code_request}>Login</button>
        return button;
    }
}

export default OauthLogin;