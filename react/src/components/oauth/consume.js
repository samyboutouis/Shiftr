import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class OauthConsume extends Component {
    constructor(props){
        super()
        this.state = { oauthCode: false, oauthAccessToken: false, userPresent: false}
    }

    componentDidMount() {
        this.checkOauthCode()
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
            console.log(this.state.oauthAccessToken);
            console.log(localStorage.getItem('accessToken'));
            this.isUserPresent(localStorage.getItem('idToken'));
            if(!this.state.userPresent){
                return <Redirect to='/create/user' />
            }
            else {
                return <Redirect to='/' />
            }
        } 
    }

    isUserPresent = (idToken) => {
        console.log("STARTING USER CHECK")
        let token = JSON.parse(idToken);
        let email = token.sub;
        let self = this;
        axios.get("http://localhost:8080/users/find_email/"+email).then( (response) => {
            console.log(response)
            self.setState({userPresent: response.data})
        }).catch( (error) => {
            console.log(error)
        });
    }

    render(){
        return (<div>
            {this.showActiveCode()}
        </div>);
    }
}

export default OauthConsume;