import React, {Component} from 'react';
import UserShow from './show'
import UserForm from './form'
import axios from 'axios';

class UserIndex extends Component {
  constructor(props){
    super()
    this.state= {users: false, selectedUser: false }
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
      return <div className="container is-max-widescreen">
        <h1 className="title my-5">Employees</h1>
        <div className="columns mt-5 pr-6">
          <div className="column">
            {this.drawEmployees(this.state.users)}
          </div>
          <div className="column is-2">
            <UserForm updateUsers={this.componentDidMount} reqType="create" />
          </div>
        </div>
      </div>
    }
  }

  getUsers = () => {
    let self = this;
    axios.get("http://localhost:8080/users/employee_list").then( (response) => {
      self.setState({users: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  drawEmployees = (users) => {
    return <table className = "table is-bordered is-striped is-narrow is-fullwidth">
        <thead> 
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>NetID</th>
              <th>Email</th>
              <th>Groups</th>
            </tr>
        </thead> 
        <tbody>
            {this.mapUsers(users)}
        </tbody>
      </table>
  }

  mapUsers = (users) => {
    return users.map((user,index) =>
      <tr key={index}>
        <td> {user.name}</td>
        <td> {user.role}</td>
        <td> {user.netid}</td>
        <td> {user.email}</td>
        <td>{Array.isArray(user.group) ? user.group.join(', ') : user.group} </td>
      </tr>
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
