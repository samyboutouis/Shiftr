import React ,{Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './home';
import UserForm from './user/form'
import SamlConsume from './saml/consume'

class AppRouter extends Component {
  render(){
    return (
      <div>
        <Router>
          <div>
            <Switch>

              <Route path="/saml/consume">
                <SamlConsume />
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

