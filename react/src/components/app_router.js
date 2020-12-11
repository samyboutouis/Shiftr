import React ,{Component} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


class AppRouter extends Component {

  render(){
    return (
      <div>
        <Router>
          <div>
            {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/saml/consume">
                <h1>Works</h1>
              </Route>
              
              {/* note that due to control flow the root path is at the bottom by design */}
              {/* <Route path="/">
                <Home />
              </Route> */}
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default AppRouter;
