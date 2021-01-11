import React, {Component} from 'react';
import ShiftTimes from "./shifttimes.js";
import axios from 'axios';
import format from "date-fns/format";
import getHours from "date-fns/getHours"
import getMinutes from "date-fns/getMinutes"
import differenceInMinutes from "date-fns/differenceInMinutes"

class ShowWeek extends Component {
  constructor(props){
    super()
    this.state= {shifts: false, isModal: false, activeItem: ''}
  }

  /*changes whether modal is active or not, and which shift's info is shown*/
    handleClick = (id) => {
      this.setState({ isModal: !this.state.isModal });
      console.log(id)
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
    for(let i=0;i<24; i++) {
      if(shifts[i]){
    shifts[i].data.map((shift,index) =>
        cells.push(
          <div className="heyo" onClick={this.handleClick.bind(this, shift)}>
          <div className={"calendar-week-entry " + shift.group} key={i+' '+index, shift} style={{position: "absolute", top: ((getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000))/3)+240, paddingBottom: ((differenceInMinutes(shift.end_time*1000, shift.start_time*1000)/3))}}>
            <div >
                {format(shift.start_time*1000, "HH:mm")} - {format(shift.end_time*1000, "HH:mm")}
                <br />
                {shift.group}
                <br />
                {shift.location}
            </div>
          </div>
          </div>

    ))}}
    return cells;
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
