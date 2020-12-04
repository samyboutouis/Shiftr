import React, {Component} from 'react';
import UserIndex from './user/index';
import Navbar from './navbar';
class Home extends Component {
  constructor(props){
    super();
    this.state = {name: "World"}
  }

  render(){
    return(

      <div>
        <Navbar />
        <h1>Hello {this.state.name}</h1>
        <UserIndex />
      </div>
    )
  }
}


export default Home;
