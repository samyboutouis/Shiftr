import React, {Component} from 'react';
import axios from 'axios';
import parseISO from 'date-fns/parseISO';
import getUnixTime from 'date-fns/getUnixTime';

class AddOpen extends Component {
  constructor(props){
    super();
    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  }

  formModal = () => {
    if(this.props.modal) {
      return (
        <div className="modal is-active">
          <div className="modal-background">
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Add Open Shift</p>
                <button onClick={this.onClose} className="delete" aria-label="close"></button>
              </header>
              <section className="modal-card-body">
                <form>
                  <div className="field">
                    <label className="label">Day</label>
                    <div className="control">
                      <input name="day" type="date" onChange={this.changeHandler}/>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Start Time</label>
                    <div className="control">
                      <input name="start_time" type="time" onChange={this.changeHandler}/>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">End Time</label>
                    <div className="control">
                      <input name="end_time" type="time" onChange={this.changeHandler}/>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Group</label>
                    <div className="control">
                      {this.groupOptions()}
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Role</label>
                    <div className="control">
                      <div className="select">
                        <select defaultValue="select_a_role" name="role" onChange={this.changeHandler}>
                          <option disabled="disabled" value="select_a_role" hidden="hidden">Select a Role</option>
                          <option value="employee">Employee</option>
                          <option value="supervisor">Supervisor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </section>
              <footer className="modal-card-foot">
                <div className="control">
                  <input className="button is-success" type='submit' onClick={this.submitForm}/>
                </div>
              </footer>
            </div>
          </div>
        </div>
      );
    }
  }

  groupOptions = () => {
    var groups = localStorage.getItem('group').split(",")
    var options = []
    groups.forEach((group, index) =>
      options.push(
        <label key={index} className="radio mr-5">
          <input name='group' value={group} type="radio" onChange={this.changeHandler} />
          &nbsp;{group}
        </label>
      )
    )
    return options
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
    this.setState({day: parseISO(this.state.day)});
    axios.post("http://localhost:8080/shifts", {start_time: getUnixTime(this.state.start_time), end_time: getUnixTime(this.state.end_time)}).then((response) => {
      this.getOpenShifts();
    }).catch(function (err){  
        console.log(err)
    });
  }

  render() {
    return (
      <div>
        {this.formModal()}
      </div>
    );
  }
}

export default AddOpen