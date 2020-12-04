import React, {Component} from 'react'
import axios from 'axios';


class UserForm extends Component {
  constructor(props){
    super()
    this.state = {name: null, age: null, admin: false}
  }

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if(event.target.type === "checkbox") {
      this.setState({
        [name]: event.target.checked
      });
    }
    else {
      this.setState({
        [name]: value
    }); 
    }
  }

  submitForm = (event) => {
    event.preventDefault();
    let form_data = new FormData();
    let request;
    let url; 

    //gather all the state values and store them into "FormData" trasit type
    for (let [key, value] of Object.entries(this.state)) {
      if(value) {form_data.append(key, value)};
    }

    //change the call if this is is a create or an update
    if(this.props.reqType === "create"){
      url = "http://localhost:8080/users" 
      request =  axios.post(url, form_data, {
        headers: {'content-type': 'multipart/form-data'}
      })
    }else{
      url = "http://localhost:8080/users/update/" + this.props.user._id
      request =  axios.put(url, form_data, {
        headers: {'content-type': 'multipart/form-data'}
      })
    }

   request.then((response) => {
      this.props.getUsers()
      this.props.clearSelectedUser()
    })
    .catch(function (err){  
      console.log(err)
    })
  }



  render(){
    return(
      <form>
        <label>Name</label>
        <input name='name' type="text" onChange={this.changeHandler} />

        <label>Age</label>
        <input name='age' type="text" onChange={this.changeHandler} />

        <label>Admin</label>
        <input name='admin' type="checkbox" onChange={this.changeHandler} />

        <input onClick={this.submitForm} type='submit' />
      </form>
    )
  }
}

export default UserForm