import React, {Component} from 'react'
import axios from 'axios';

class UserForm extends Component {
  constructor(props){
    super()
    this.state = {uid: null, netid: null, group: null, role: false, modal: false}
  }

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    }); 
  }

  submitForm = (event) => {
    event.preventDefault();
    let form_data = new FormData();
    let url; 

    //gather all the state values and store them into "FormData" trasit type
    for (let [key, value] of Object.entries(this.state)) {
      if(value && key!='modal') {form_data.append(key, value)};
    }

    //change the call if this is is a create or an update
    if(this.props.reqType === "create"){
      url = "http://localhost:8080/users" 
      axios.post(url, form_data, {
        headers: {'content-type': 'multipart/form-data'}
      }).then((response) => {
        this.setState({modal: false})
        this.props.updateUsers()
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

  addUserButton = () => {
    if(this.props.reqType === "create") {
      return <div onClick={this.toggleModal.bind(this)} className="rainbow-gradient right-button">Add Employee</div>
    }
  }

  toggleModal = () => {
      this.setState({modal: !this.state.modal})
  }

  formModal = () => {
    if(this.state.modal) {
      return <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          
          <header className="modal-card-head">
            <p className="modal-card-title">Add Employee</p>
            <button onClick={this.toggleModal.bind(this)} className="delete" aria-label="close"></button>
          </header>

          <section className="modal-card-body">
            <form>

              <div className="field">
                <label className="label">NetId</label>
                <div className="control">
                  <input className='input' name='netid' type="text" placeholder="e.g abc123" onChange={this.changeHandler} />
                </div>
              </div>

              <div className="field">
                <label className="label">Unique ID</label>
                <div className="control">
                  <input className='input' name='uid' type="text" placeholder="e.g 0123456" onChange={this.changeHandler} />
                </div>
              </div>

              <div className="field">
                <label className="label">Group</label>
                <div className="control">
                  <input className='input' name='group' type="text" placeholder="e.g CoLab" onChange={this.changeHandler} />
                </div>
              </div>

              <div className="field">
                <label className="label">Role</label>
                <div className="control">
                  <div className="select" onChange={this.changeHandler}>
                    <select defaultValue="select_a_role" name="role">
                      <option disabled="disabled" value="select_a_role" hidden="hidden">Select a Role</option>
                      <option value="employee">Employee</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

            </form>
          </section>

          <footer className="modal-card-foot">
            <div className="control">
              <input className="button is-success" onClick={this.submitForm} type='submit' />
            </div>
          </footer>

        </div>
        </div>
    }
  }

  render(){
      return(
        <div>
          {this.addUserButton()}
          {this.formModal()}
        </div>
      )
  }
}

export default UserForm