import React, {Component} from 'react';
import axios from 'axios';
import CurrentShift from "./current_shift";
import AddOpen from "../shift/add_open";
import Pool from '../../pool.png';
import startOfToday from 'date-fns/startOfToday';
import startOfTomorrow from 'date-fns/startOfTomorrow';
import endOfToday from 'date-fns/endOfToday';
import endOfWeek from 'date-fns/endOfWeek';
import getUnixTime from 'date-fns/getUnixTime';
import format from "date-fns/format";

class HomeIndex extends Component {
  constructor(props){
    super(props);
    this.state = {name: "", shiftsToday: 0, shifts: [], additionalShifts: [], upcomingShifts: [], openShifts: [], modal: false};
  }

  getShiftsToday = () => {
    let self = this;
    let startTime = getUnixTime(startOfToday());
    let endTime = getUnixTime(endOfToday());
    if(localStorage.getItem('role')==='employee'){
      axios.get("http://localhost:8080/shifts/find_by_time_and_user/" + startTime + "/" + endTime).then( (response) => {
        let sortedShifts = response.data;
        sortedShifts.sort((a, b) => a.start_time - b.start_time);
        self.setState({name: localStorage.getItem("firstName"), shiftsToday: response.data.length, shifts: sortedShifts});
        if(self.state.shiftsToday > 1){
          let additionalShifts = self.state.shifts.splice(1);
          let shifts = [];
          shifts[0] = self.state.shifts[0];
          self.setState({additionalShifts: additionalShifts, shifts: shifts});
        }
      }).catch( (error) => {
        console.log(error)
      });
    } else if(localStorage.getItem('role')==='supervisor' || localStorage.getItem('role')==='admin'){
      axios.get("http://localhost:8080/shifts/find_day/" + startTime + "/" + endTime).then( (response) => {
        let sortedShifts = response.data;
        sortedShifts.sort((a, b) => {
          if (a.start_time < b.start_time || (a.start_time === b.start_time && a.end_time < b.end_time))
            return -1;
          if (a.start_time > b.start_time || (a.start_time === b.start_time && a.end_time > b.end_time))
            return 1;
          return 0;
        });
        self.setState({name: localStorage.getItem("firstName"), shiftsToday: response.data.length, shifts: sortedShifts});
      }).catch( (error) => {
        console.log(error)
      });
    }
  }

  getUpcomingShifts = () => {
    let self = this;
    let startTime = getUnixTime(startOfTomorrow());
    let endTime = getUnixTime(endOfWeek(Date.now()));
    axios.get("http://localhost:8080/shifts/find_by_time_and_user/" + startTime + "/" + endTime).then( (response) => {
      let sortedShifts = response.data;
      sortedShifts.sort((a, b) => a.start_time - b.start_time);
      self.setState({upcomingShifts: sortedShifts})
    }).catch( (error) => {
      console.log(error)
    });
  }

  getOpenShifts = () => {
    let self = this;
    axios.get("http://localhost:8080/shifts/find_open/open").then((response) => {
      let sortedShifts = response.data;
      sortedShifts.sort((a, b) => {
        if (a.start_time < b.start_time || (a.start_time === b.start_time && a.end_time < b.end_time))
          return -1;
        if (a.start_time > b.start_time || (a.start_time === b.start_time && a.end_time > b.end_time))
          return 1;
        return 0;
      });
      self.setState({openShifts: sortedShifts})
    }).catch( (error) => {
      console.log(error)
    });
  }

  drawOpenShifts = () => {
    if(this.state.openShifts){
      return( 
        <div className='tile is-ancestor'>
          <div className='tile is-parent is-vertical'>
            {this.mapOpenShifts()}
          </div>
        </div>
      );
    }
  }

  drawUpcomingShifts = () => {
    if(this.state.upcomingShifts || this.state.additionalShifts){
      return (
        <div className='tile is-ancestor'>
          <div className='tile is-parent is-vertical'>
            {this.mapUpcomingShifts()}
          </div>
        </div>
      );
    }
  }

  mapOpenShifts = () => {
    if (this.state.openShifts) {
      let dateFormat = "eee dd MMM";
      let timeFormat = "hh:mmaaaa";
      let shifts = this.state.openShifts;
      return shifts.map((shift,index) => {
        let person = "Open Shift";
        if(shift.hasOwnProperty("employee")){
          var last
          shift.employee.last_name ? last = shift.employee.last_name.charAt(0) + "." : last = ''
          person = shift.employee.first_name + " " + last;
        } else {
          person = "Open Shift";
        }
        return (
          <div key={index} className='tile is-child columns is-mobile'>
            <div className='column is-3 upcoming-shift-date'>
              <p>{format(shift.start_time * 1000, dateFormat)}</p>
            </div>
            <div className='column is-6'>
              <p className='upcoming-shift-time'>{format(shift.start_time * 1000, timeFormat)} - {format(shift.end_time * 1000, timeFormat)}</p>
              <p className='upcoming-shift-text'>{person} @ {shift.location}</p>
              <p className='upcoming-shift-text'> {shift.group} </p>
            </div>
            <div className='column is-3'>
              <button className='open-shift-button' onClick={this.handleOpenClick.bind(this, shift)}>Claim</button>
            </div>
          </div>
        );
      });
    }
  }

  mapUpcomingShifts = () => {
    let shifts = this.state.upcomingShifts;
    shifts = this.state.additionalShifts.concat(shifts);
    let dateFormat = "eee dd MMM";
    let timeFormat = "hh:mmaaaa";
    return shifts.map((shift,index) => {
      if(shift.status === 'open'){
        return (
          <div key={index} className='tile is-child columns is-mobile'>
            <div className='column is-3 upcoming-shift-date'>
              <p>{format(shift.start_time * 1000, dateFormat)}</p>
            </div>
            <div className='column is-9'>
              <p className='upcoming-shift-time'>{format(shift.start_time * 1000, timeFormat)} - {format(shift.end_time * 1000, timeFormat)}</p>
              <p className='upcoming-shift-text'> @ {shift.location}</p>
              <p className='upcoming-shift-text'> {shift.group} </p>
            </div>
          </div>
        );
      } else {
        return (
          <div key={index} className='tile is-child columns is-mobile'>
            <div className='column is-3 upcoming-shift-date'>
              <p>{format(shift.start_time * 1000, dateFormat)}</p>
            </div>
            <div className='column is-6'>
              <p className='upcoming-shift-time'>{format(shift.start_time * 1000, timeFormat)} - {format(shift.end_time * 1000, timeFormat)}</p>
              <p className='upcoming-shift-text'> @ {shift.location}</p>
              <p className='upcoming-shift-text'> {shift.group} </p>
            </div>
            <div className='column is-3'>
              <button className='open-shift-button' onClick={this.handleUpcomingClick.bind(this, shift)}>Offer Up</button>
            </div>
          </div>
        );
      }
    });
  }

  handleUpcomingClick = (shift) => {
    if(window.confirm('Are you sure you want to offer up this shift? If no one picks up your shift, you are still required to cover it.')){
      axios.put("http://localhost:8080/shifts/update/" + shift._id, {
        status: "open", 
        employee: {
          netid: localStorage.getItem('netid'), 
          name: localStorage.getItem('firstName') + " " + localStorage.getItem('lastName')
        }
      }).then((response) => {
        this.getShiftsToday();
        this.getUpcomingShifts();
        this.getOpenShifts();
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  handleOpenClick = (shift) => {
    if(window.confirm('Are you sure you want to claim this shift?')){
      axios.get("http://localhost:8080/shifts/find_conflict/" + shift.start_time + "/" + shift.end_time).then((response) => {
        if(response.data.length > 0 && !shift.hasOwnProperty('employee')) {
          alert("This shift conflicts with another shift in your schedule! You cannot claim this shift.");
        } else if (response.data.length > 0 && shift.hasOwnProperty('employee') && shift.employee.netid !== localStorage.getItem('netid')){
          alert("This shift conflicts with another shift in your schedule! You cannot claim this shift.");
        } else {
          axios.put("http://localhost:8080/shifts/update/" + shift._id, {
            status: "closed", 
            employee: {
              netid: localStorage.getItem('netid'), 
              name: localStorage.getItem('firstName') + " " + localStorage.getItem('lastName')
            }
          }).then((response) => {
            this.getShiftsToday();
            this.getOpenShifts();
            this.getUpcomingShifts();
          }).catch((error) => {
            console.log(error);
          });
        }
      });
    }
  }

  toggleModal = () => {
    this.setState({modal: !this.state.modal});
  }

  componentDidMount() {
    this.getShiftsToday();
    this.getUpcomingShifts();
    this.getOpenShifts();
  }

  render() {
    let home = [];
    if(localStorage.getItem('role')==='employee'){
      home.push(
        <div className="tile is-7 is-vertical is-parent" key="vertical">
          <div className="tile is-child">
            <CurrentShift name={this.state.name} shiftsToday={this.state.shiftsToday} shifts={this.state.shifts}/>
          </div>
          <div className="tile is-child">
            <div className="upcoming-shift">
              <p className="upcoming-shift-title">Your upcoming shifts</p>
              {this.drawUpcomingShifts()}
            </div>
          </div>
        </div>
      );
    }
    else if(localStorage.getItem('role')==='supervisor' || localStorage.getItem('role')==='admin'){
      home.push(
        <div className="tile is-7 is-parent" key="supervisor">
          <div className="tile is-child">
            <CurrentShift name={this.state.name} shiftsToday={this.state.shiftsToday} shifts={this.state.shifts}/>
          </div>
        </div>
      );
    }
    let shiftPool = [<img src={Pool} key="Pool" className='shift-pool-image' alt="Pool"/>, "Shift Pool"];
    if(localStorage.getItem('role')==='supervisor' || localStorage.getItem('role')==='admin'){
      shiftPool.push(<button key="add" className='add-shift-button' onClick={this.toggleModal.bind(this)}>Add</button>);
    }
    home.push(
      <div className="tile is-parent" key="pool">
        <div className="tile is-child">
          <div className='shift-pool'>
            <p className="shift-pool-title">
              {shiftPool}
            </p>
            <div>
              {this.drawOpenShifts()}
            </div>
          </div>
        </div>
      </div>
    );
    return (
      <div className="tile is-gapless is-ancestor">
        {/*<AddOpen modal={this.state.modal} onClose={this.toggleModal}/>*/}
        {home}
      </div>
    );
  }
}

export default HomeIndex;