import React ,{Component} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './home';
import OauthConsume from './oauth/consume';
import UserForm from './user/form'

class AppRouter extends Component {
  render(){
    return (
      <div>
        <Router>
          <div>
            <Switch>
              <Route path="/oauth/consume">
                <OauthConsume />
              </Route>
              <Route path="/create/user">
                <UserForm reqType="create"/>
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default AppRouter;

