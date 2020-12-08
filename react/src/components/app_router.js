import React ,{Component} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './home';

import OauthLogin from './oauth/login';


class AppRouter extends Component {

  render(){
    return (
      <div>
        <Router>
          <div>
            {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/oauth/consume">
                <OauthLogin />
              </Route>
              
              {/* note that due to control flow the root path is at the bottom by design */}
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
