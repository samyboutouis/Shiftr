import React, {Component} from 'react';
import UserIndex from './user/index'
import ShiftIndex from './shift/index'

class Home extends Component {
  constructor(props){
    super();
    this.state = {name: "Danai"}
  }

  render(){
    return(
      <div>
        <h1>Hello {this.state.name}</h1>
        <UserIndex /> 
        <ShiftIndex />
      </div>
    )
  }
}

export default Home;