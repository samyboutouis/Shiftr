import React, {Component} from 'react'
import axios from 'axios';
import lastDayOfWeek from "date-fns/lastDayOfWeek";
import getUnixTime from 'date-fns/getUnixTime'
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'

class BuildSchedule extends Component {
  constructor(props){
    super()
    this.state = {
      group: null, 
      modal: true, 
      data: null, 
      start_date: null, 
      end_date: null}
    window.scrollTo(0,0)
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
    if(this.state.group && this.state.start_date && this.state.end_date) {
      var start_parts = this.state.start_date.split("-")
      var start = toDate(new Date(start_parts[0], start_parts[1]-1, start_parts[2], 0, 0, 0))
      var end_parts = this.state.end_date.split("-")
      var end = toDate(new Date(end_parts[0], end_parts[1]-1, end_parts[2], 23, 59, 59))

      let url = "http://localhost:8080/schedule/assign_shifts/" + this.state.group + '/' + getUnixTime(start) + '/' + getUnixTime(end)
      axios.put(url).then((response) => {
          console.log(response.data)
          this.props.toggleBuildSchedule(response.data)
      }).catch(function (err){  
          console.log(err)
      });
    }
    else {
      alert("Please complete form.")
    }
  }

  dateHandler = (date) => {
    this.setState({
      start_date: getUnixTime(date.data.datePicker._date.start), 
      end_date: getUnixTime(date.data.datePicker._date.end)
    })
  }

  groupOptions = () => {
    var groups = localStorage.getItem('group').split(",")
    var options = []
    groups.forEach((group) =>
      options.push(
        <option className="capitalize-me" value={group}>{group}</option>
      )
    )
    return options
  }

  render(){
    return(
    <div className="tile is-vertical mt-5 ml-4">
        <h4 className="tile title is-4">Generate a Schedule</h4>
        <form className="tile is-vertical is-4">

          <div className="field">
              <label className="label">Group</label>
              <div className="control">
                <div className="select" onChange={this.changeHandler}>
                  <select defaultValue="select_a_group" name="group">
                    <option disabled="disabled" value="select_a_group" hidden="hidden">Select a Group</option>
                    {this.groupOptions()}
                  </select>
                </div>
              </div>
            </div>

          <div className="field">
            <label className="label">Start Date</label>
            <div className="control">
              <input 
                className="input" 
                type="date" 
                name="start_date"
                onChange={this.changeHandler} 
                defaultValue={format(lastDayOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">End Date</label>
            <div className="control">
              <input 
                className="input" 
                type="date" 
                name="end_date"
                onChange={this.changeHandler}
                defaultValue={format(lastDayOfWeek(lastDayOfWeek(new Date(), { weekStartsOn: 1 })), "yyyy-MM-dd")}/>
            </div>
          </div>

          <div className="control">
            <input className="button" onClick={this.submitForm} type='submit' />
          </div>
        </form>

    </div>
    )
  }
}

export default BuildSchedule