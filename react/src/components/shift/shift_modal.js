import React, {Component} from 'react';
import axios from 'axios';
import parseISO from 'date-fns/parseISO';
import getUnixTime from 'date-fns/getUnixTime';
import fromUnixTime from 'date-fns/fromUnixTime';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';

class ShiftModal extends Component {
  constructor(props){
    super(props);
    this.state = {day: null, start_time: null, end_time: null, group: null, location: null}
  }

  formModal = () => {
    let header, day, time;
    if(this.props.editShift){
      header = "Edit Open Shift";
      time = fromUnixTime(this.props.editShift.start_time)
      day = getYear(time) + "-" + getMonth(time) + 1 + "-" + getDate(time);
      console.log(day);
    } else {
      header = "Add Open Shift";
      day = "";
    }
    if(this.props.modal) {
      return (
        <div className="modal is-active">
          <div className="modal-background">
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">{header}</p>
                <button onClick={this.props.onClose} className="delete" aria-label="close"></button>
              </header>
              <section className="modal-card-body">
                <form>
                  <div className="field">
                    <label className="label">Day</label>
                    <div className="control">
                      <input name="day" type="date" placeholder="yyyy-mm-dd" onChange={this.changeHandler}/>
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
                    <label className="label">Location</label>
                    <div className="control">
                      <div className="select">
                        <select defaultValue="select_a_location" name="location" onChange={this.changeHandler}>
                          <option disabled="disabled" value="select_a_location" hidden="hidden">Select a Location</option>
                          <option value="Remote">Remote</option>
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
    var groups = localStorage.getItem('group').split(",");
    var options = [];
    groups.forEach((group, index) =>
      options.push(
        <label key={index} className="radio mr-5">
          <input name='group' value={group} type="radio" onChange={this.changeHandler} />
          &nbsp;{group}
        </label>
      )
    );
    return options;
  }

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
        [name]: value
    }); 
  }

  submitForm = (event) => {
    if(this.state.day && this.state.start_time && this.state.end_time && this.state.group && this.state.location){
      event.preventDefault();
      this.setState({day: parseISO(this.state.day)});
      let start = new Date(this.state.day + " " + this.state.start_time);
      let end = new Date(this.state.day + " " + this.state.end_time);
      if(start <= Date.now() || end <= Date.now()){
        alert("You cannot create an open shift in the past.");
      } else if (start >= end) {
        alert("You cannot have a shift end before its start time.")
      }
      else {
        if(this.props.editShift !== false){
          axios.put("http://localhost:8080/shifts/update/"+ this.props.editShift._id, {
            start_time: getUnixTime(start), 
            end_time: getUnixTime(end), 
            group: this.state.group, 
            location: this.state.location, 
            status: "open"
          }).then((response) => {
            this.props.getOpenShifts();
            alert("Open shift edited successfully.");
            this.props.onClose();
          }).catch(function (err){  
              console.log(err)
          });
        } else {
          axios.post("http://localhost:8080/shifts", {
            start_time: getUnixTime(start), 
            end_time: getUnixTime(end), 
            group: this.state.group, 
            location: this.state.location, 
            status: "open"
          }).then((response) => {
            this.props.getOpenShifts();
            alert("Open shift added successfully.");
            this.props.onClose();
          }).catch(function (err){  
              console.log(err)
          });
        }
      }
    }
    else {
      alert("Please complete the form.")
    }
  }

  render() {
    return (
      <div>
        {this.formModal()}
      </div>
    );
  }
}

export default ShiftModal