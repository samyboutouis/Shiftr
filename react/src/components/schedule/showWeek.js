import React, {Component} from 'react';
import ShiftTimes from "./shifttimes.js";
import axios from 'axios';
import format from "date-fns/format";
import getHours from "date-fns/getHours"
import getMinutes from "date-fns/getMinutes"
import differenceInMinutes from "date-fns/differenceInMinutes"
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'

class ShowWeek extends Component {
  constructor(props){
    super()
    this.state= {shifts: false, isModal: false, activeItem: ''}
  }

  /*changes whether modal is active or not, and which shift's info is shown*/
    handleClick = (id) => {
      this.setState({ isModal: !this.state.isModal });
      this.setState({activeItem: id});

    };

  componentDidMount = () => {
    this.getShifts()
  }

/* query shifts by day */
  getShifts = (props) => {
    let self = this
    const end = this.props.start+86400
    axios.get("http://localhost:8080/shifts/find_time/" + this.props.start + "/" + end).then( (response) => {
      self.setState({shifts: response.data})
      this.findOverlap()
    }).catch( (error) => {
      console.log(error)
    });
  }

  drawShifts = () => {
    if(this.state.shifts){
      return <div>
        {this.mapShifts()}
      </div>
    }
  }

  findOverlap = () => {
    if(this.state.shifts){
      let shifts = this.state.shifts
      for(var i=0; i<shifts.length-1; i++) {
        for(var j=i+1; j<shifts.length; j++) {
          var current_interval = {start: shifts[i].start_time, end: shifts[i].end_time}
          var next_interval = {start: shifts[j].start_time, end: shifts[j].end_time}
          if(areIntervalsOverlapping(current_interval, next_interval)) {
            if(shifts[i].overlap) {
              shifts[i].overlap.count++
              // shifts[i].position
            } 
            else {
              shifts[i].overlap={count: 2, position: 0}
            }
            if (shifts[j].overlap) {
              shifts[j].overlap.count++
            }
            else {
              shifts[j].overlap={count: shifts[j-1].overlap.count, position: shifts[j-1].overlap.position+1}
              // shifts[j].overlap={count:2}
              // if(shifts[j-1].overlap.count===shifts[j].overlap.count){
              //   shifts[j].overlap.position=shifts[j-1].overlap.position+1
              // }
              // else {
              //   shifts[j].overlap.count=shifts[j-1].overlap.count
              //   shifts[j].overlap.position=shifts[j-1].overlap.position-1
              // }
            }
          }
        }
      }
    }
  }

  drawTimes = (shift) => {
    if (this.state.isModal) {
      return(<ShiftTimes shift={shift}/>)}
  }

  getEmployee = (shift) => {
    if (this.state.isModal) {
      // let shift = this.state.activeItem
      if (shift.employee === undefined) {
        return(
          <div>
            <p>Current Shift Status: {this.state.activeItem.status}</p>
            <p>Employee Assigned: None</p>
            <br/>
            <p>Notes for this shift : {this.state.activeItem.note} ~Have a great shift!</p>
          </div>
        )}
      else {
        return(
          <div>
            <p>Current Shift Status: {this.state.activeItem.status}</p>
            <p>Employee Assigned: {shift.employee.name}</p>
            <br/>
            <p>Notes for this shift : {this.state.activeItem.note} ~Have a great shift!</p>
          </div>)}
      }
    }
/* format and size the display of queries */
  mapShifts = () => {
    let shifts = this.state.shifts
    var cells=[];
    if (shifts[0]) {
      var top = getHours(shifts[0].start_time*1000)*60+getMinutes(shifts[0].start_time*1000)-250
    }
    shifts.map((shift,index) =>
        cells.push(
          <div onClick={this.handleClick.bind(this, shift)}>
            <div 
              className={"calendar-week-entry " + shift.group} 
              key={index, shift} 
              style={{
                position: "absolute", 
                top: getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000)-top, 
                height: differenceInMinutes(shift.end_time*1000, shift.start_time*1000)*9/10,
                width: shift.overlap ? 11/shift.overlap.count+"em" : "10em",
                marginLeft: shift.overlap ? shift.overlap.position/shift.overlap.count*12+"em" : 0
                }}
              >
              {this.shiftDetails(shift)}
            </div>
          </div>

    ))
    return cells;
  }


  shiftDetails(shift) {
   if(shift.overlap && shift.overlap.count>2) {
      return null
    }
    else {
      return <div>
        <span className="bold">
          {format(shift.start_time * 1000, "h:mm")}&#8203;{format(shift.start_time * 1000, "aaaaa")}m&#8203; &#8211; &#8203;
          {format(shift.end_time * 1000, "h:mm")}&#8203;{format(shift.end_time * 1000, "aaaaa")}m
        </span>
        <br />
        {shift.group}
        <br />
        {shift.location}
      </div>
    }
  }

  render(){
    const active = this.state.isModal ? "is-active" : "";
    return(
      <div >
        {this.drawShifts()}
        <div className="spacing-cell"> &nbsp;
        </div>
        {/*create one modal, and use state to change out displayed info*/}
        <div className={`modal ${active}`}>
          <div className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title"> {this.drawTimes(this.state.activeItem)}</div> {/*<Notes shift={this.state.activeItem}/>*/}
                  <button
                    onClick={this.handleClick.bind(this, '')}
                    className="delete"
                  />
                </header>
                <section className="modal-card-body">
                    <p>{this.state.activeItem.group}  ||  {this.state.activeItem.location}</p>
                    <div>{this.getEmployee(this.state.activeItem)}</div>
                </section>
                <footer className="modal-card-foot"></footer>
              </div>
          </div>
      </div>
    )
  }
}

export default ShowWeek;
