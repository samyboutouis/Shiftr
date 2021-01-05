import React, {Component} from 'react';
import Pool from '../../pool.png';
import axios from 'axios';
import format from "date-fns/format";

class ShiftPool extends Component {
  constructor(props){
    super();
    this.state= {shifts: [], claim: false}
  }

  componentDidMount = () => {
    this.getShifts()
  }

  getShifts = () => {
    let self = this;
    axios.get("http://localhost:8080/shifts/find_open/open").then((response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    });
  }

  drawShifts = () => {
    if(this.state.shifts){
      return( 
        <div className='tile is-ancestor'>
          <div className='tile is-parent is-vertical'>
            {this.mapShifts()}
          </div>
        </div>
      );
    }
  }

  mapShifts = () => {
    if (this.state.shifts) {
      let dateFormat = "eee dd MMM";
      let timeFormat = "hh:mmaaaa";
      let shifts = this.state.shifts;
      return shifts.map((shift,index) =>
        <div key={index} className='tile is-child columns is-mobile'>
          <div className='column is-3 upcoming-shift-date'>
            <p>{format(shift.start_time * 1000, dateFormat)}</p>
          </div>
          <div className='column is-6'>
            <p className='upcoming-shift-time'>{format(shift.start_time * 1000, timeFormat)} - {format(shift.end_time * 1000, timeFormat)}</p>
            <p className='upcoming-shift-text'> {shift.group} </p>
            <p className='upcoming-shift-text'> @{shift.location}</p>
          </div>
          <div className='column is-3'>
            <button className='open-shift-button' onClick={this.handleClick.bind(this, shift)}>Claim</button>
          </div>
        </div>
      )
    }
  }

  handleClick = (shift) => {
    if(window.confirm('Are you sure you want to claim this shift?')){
      axios.get("http://localhost:8080/shifts/find_conflict/" + shift.start_time + "/" + shift.end_time).then((response) => {
        if(response.data.length > 0){
          alert("This shift conflicts with another shift in your schedule! You cannot claim this shift.");
        } else {
          axios.put("http://localhost:8080/shifts/update/" + shift._id, {status: "closed", employee: {netid: localStorage.getItem('netid')}}).then((response) => {
            this.getShifts();
          }).catch( (error) => {
            console.log(error);
          });
        }
      })
    }
  }

  render() {
    return (
      <div className='shift-pool'>
        <p className="shift-pool-title">
          <img src={Pool} className='shift-pool-image' alt="Pool"/> 
          Shift Pool 
        </p>
        <div>
          {this.drawShifts()}
        </div>
      </div>
    );
  }
}

export default ShiftPool;