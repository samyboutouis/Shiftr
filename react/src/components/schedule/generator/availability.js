import React, {Component} from 'react';
import UserAvailability from './userAvailability'
import axios from 'axios';

class Availability extends Component {
  constructor(props){
    super()
    this.state= {users: null }
  }

  componentDidMount = () => {
    this.getUsers()
  }

  drawUsers = () => {
    if(this.state.users){
        return this.state.users.map((user,index) =>
        <div key={index}>
          <UserAvailability user={user} />
        </div>
      )
    }
  }

  getUsers = () => {
    let self = this;
    console.log('making web call');
    // axios.get("http://localhost:8080/schedule/temp_users").then( (response) => {
      // axios.get("http://localhost:8080/users").then( (response) => {
        axios.get("http://localhost:8080/schedule/rank_users/Code+").then( (response) => {
        console.log(response)
      self.setState({users: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  render(){
    return(
      <div>
        {this.drawUsers()}        
      </div>
    )
  }
}

export default Availability
