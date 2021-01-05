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
      return <div className="container is-max-widescreen">
        <div className="columns mt-5 pr-6">
          <div className="column">
            <div className="rainbow-gradient">Admins</div>
            {this.mapUsers(this.state.users.admins)}
          </div>
          <div className="column">
            <div className="rainbow-gradient">Supervisors</div>
            {this.mapUsers(this.state.users.supervisors)}
          </div>
          <div className="column">
            <div className="rainbow-gradient">Employees</div>
            {this.mapUsers(this.state.users.employees)}
          </div>
        </div>
        {/* <div onClick={this.addUser} className="rainbow-gradient right-button">Add Employee</div> */}
        <UserForm reqType="create" />
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

  mapUsers = (users) => {
    return users.map((user,index) =>
      <div className="card employee-card" key={index}>
        {/* <button onClick={this.selectUser.bind(this, user)}>Select User</button> */}
        <p className="title is-4">{user.name}</p>
        <p className="subtitle is-6">{user.netid}</p>
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
