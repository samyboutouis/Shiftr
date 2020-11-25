import React, {Component} from 'react';
import axios from 'axios';
import UserForm from './form'


class UserShow extends Component {
  constructor(props){
    super()
  }

  deleteUser = () => {
    axios.delete("http://localhost:8080/users/delete/" + this.props.user.name).then( (response) => {
      this.props.getUsers()
      this.props.clearSelectedUser()
    })
    .catch((err) => {
      console.log(err)
    });
  }


  render(){
    return(
     <div>
        <h3>ME! {this.props.user.name}</h3>
        <p>ID:    {this.props.user._id}</p>
        <p>AGE:   {this.props.user.age}</p>
        <p>ADMIN: {this.props.user.admin}</p>
        <button onClick={() => this.props.clearSelectedUser()}>Back</button>
        <button onClick={this.deleteUser}>Delete</button>
        <UserForm getUsers={this.props.getUsers} clearSelectedUser={this.props.clearSelectedUser} user={this.props.user} reqType="update" />
      </div>

    )
  }
}

export default UserShow;