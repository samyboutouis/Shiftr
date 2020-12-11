import React, {Component} from 'react'
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class UserForm extends Component {
  constructor(props){
    super()
    this.state = {firstName: null, lastName: null, group: null, admin: false, submitted: false}
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
    let url; 

    //gather all the state values and store them into "FormData" trasit type
    for (let [key, value] of Object.entries(this.state)) {
      if(value) {form_data.append(key, value)};
    }

    //change the call if this is is a create or an update
    if(this.props.reqType === "create"){
      url = "http://localhost:8080/users" 
      axios.post(url, form_data, {
        headers: {'content-type': 'multipart/form-data'}
      }).then((response) => {
        this.setState({submitted: true})
      }).catch(function (err){  
        console.log(err)
      });
    }else{
      url = "http://localhost:8080/users/update/" + this.props.user._id
      axios.put(url, form_data, {
        headers: {'content-type': 'multipart/form-data'}
      }).catch(function (err){  
        console.log(err)
      });
    }
  }

  render(){
    if(!this.state.submitted){
      return(
        <div></div>
        // <Container>
        //   <Form>
        //     <Form.Row>
        //       <Form.Group as={Col} controlId="formGridFirstName">
        //         <Form.Label>First Name</Form.Label>
        //         <Form.Control type="text" placeholder="Enter first name" name='firstName' onChange={this.changeHandler}/>
        //       </Form.Group>
        //       <Form.Group as={Col} controlId="formGridLastName">
        //         <Form.Label>Last Name</Form.Label>
        //         <Form.Control type="text" placeholder="Enter last name" name='lastName' onChange={this.changeHandler}/>
        //       </Form.Group>
        //     </Form.Row>
        //     <Form.Group controlId="formGridEmail">
        //       <Form.Label>Email</Form.Label>
        //       <Form.Control type="email" placeholder="Enter your netID email" name='email' onChange={this.changeHandler}/>
        //     </Form.Group>
        //     <Form.Row>
        //       <Form.Group as={Col} controlId="formGridRole">
        //         <Form.Label>Role</Form.Label>
        //         <Form.Control type="text" placeholder="Enter role" name='role' onChange={this.changeHandler}/>
        //       </Form.Group>
        //       <Form.Group as={Col} controlId="formGridAffiliation">
        //         <Form.Label>Affiliation</Form.Label>
        //         <Form.Control type="text" placeholder="Enter affiliation" name='affiliation' onChange={this.changeHandler}/>
        //       </Form.Group>
        //     </Form.Row>
        //     <Button variant="primary" type="submit" onClick={this.submitForm}>
        //       Submit
        //     </Button>
        //   </Form>
        // </Container>
      )
    }
    else {
      return <Redirect to='/' />
    }
  }
}

export default UserForm