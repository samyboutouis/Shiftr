import React, {Component} from 'react';
import UserShow from './show'
import UserForm from './form'
import axios from 'axios';

class UserIndex extends Component {
  constructor(props){
    super()
    this.state= {users: false, selectedUser: false}
  }

  componentDidMount = () => {
    this.getUsers()
  }

  clearSelectedUser = () => {
    this.setState({ selectedUser: false})
  }


  drawSelectedUser = () => {
    if(this.state.selectedUser){
      return <UserShow clearSelectedUser={this.clearSelectedUser} user={this.state.selectedUser} getUsers={this.getUsers} />
    }
  }

  drawUsers = () => {
    if(this.state.users && !this.state.selectedUser){
      return <div>
        <h1>Users</h1>
        {this.mapUsers()}
        <UserForm getUsers={this.getUsers} clearSelectedUser={this.clearSelectedUser} reqType="create" />
      </div>
    }
  }

  getUsers = () => {
    let self = this;
    console.log('making web call');
    axios.get("http://localhost:8080/users").then( (response) => {
      self.setState({users: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  mapUsers = () => {
    let users = this.state.users
    return users.map((user,index) => 
      <div key={index}>
        <p>{user.name}</p> <button onClick={this.selectUser.bind(this, user)}>Select User</button>
      </div>
    )
  }

  selectUser = (user) => {
    this.setState({selectedUser: user})
  }

  render(){
    return(
      <div>
        {this.drawUsers()}
        {this.drawSelectedUser()}
        
      </div>
    )
  }
}

export default UserIndex