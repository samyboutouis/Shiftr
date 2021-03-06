import React, {Component} from 'react';
import ShiftTimes from "./shifttimes.js";
import axios from 'axios';
import format from "date-fns/format";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import getUnixTime from "date-fns/getUnixTime";
class ShowMonth extends Component {
  constructor(props){
    super(props)
    this.state= {shifts: false, isModal: false, activeItem: '', checkedList: this.props.checkedList};
  }


/*changed whether modal is active or not, and which shift's info is shown*/
  handleClick = (id) => {
    this.setState({ isModal: !this.state.isModal });
    console.log(id)
    this.setState({activeItem: id});

  };

  componentDidMount = () => {
    this.getShifts()
  }

  componentDidUpdate = (prevProps, props) => {
      if(prevProps.checkedList !== this.props.checkedList) {
        this.setState({checkedList: this.props.checkedList});
        this.getShifts()
    }
}
/* query shifts by day */
  getShifts = (props) => {
    let self = this
    const start = getUnixTime(startOfDay(this.props.day))
    const end = getUnixTime(endOfDay(this.props.day))
    //MODIFY CONTROLLER AND MODEL
    // cannot pass an array, so we stringify in react and parse in express
    if (this.props.checkedList){
    var querylist = Object.values(this.props.checkedList)
    var querystring = querylist.toString()

    axios.get("http://localhost:8080/shifts/find_daytwo/" + start + "/" + end + "/" + querystring).then( (response) => {
      self.setState({shifts: response.data})
    }).catch( (error) => {
      console.log(error)
    }); }
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
          <p><span className="bold">Employee Assigned:</span> None</p>)}
      else {
        return(
        <p><span className="bold">Employee Assigned:</span> {shift.employee.name}</p>)}
      }
    }

// MODAL CREATES DIFFERENTLY DEPENDING ON IF YOURE LOGGIN IN RN (WHICH IS WRONG), BUT CHANGE IT TO ROLES LATER
  createModal = () => {
    const active = this.state.isModal ? "is-active" : "";
    let modal = []
    if (localStorage.getItem('loggedIn')){
      modal.push(
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
              <p><span className="bold">Group: </span>{this.state.activeItem.group}</p>
                    <p> <span className="bold">Location:</span> {this.state.activeItem.location}</p>
                  <br/>
                  <p><span className="bold">Current Shift Status:</span> {this.state.activeItem.status}</p>
                  <div>{this.getEmployee(this.state.activeItem)}</div>
              </section>
              <footer className="modal-card-foot"></footer>
            </div>

        </div>
      )
    }
    else {modal.push(
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
                <p>{this.state.activeItem.group}</p>
                <p><span className="bold">Location :</span> {this.state.activeItem.location}</p>
                <p><span className="bold">Current Shift Status:</span> {this.state.activeItem.status}</p>
                <br/>
                <p>If shift status is open, there is no one currently scheduled to work this shift!</p>
            </section>
            <footer className="modal-card-foot"></footer>
          </div>

      </div>

    )}
    return modal
  }
/* format queries */
  mapShifts = () => {
    let shifts = this.state.shifts
    let dateFormat = "h:mm"

    return(
    /* extra div added so modal can be on same hierarchical level as mapping, (not creating modals within the map)*/
    <div>
    {/*map each shift into the calendar cell*/}
    {shifts.map((shift,index) => (
      <div key={shift} >
        <div onClick={this.handleClick.bind(this, shift)} >
          <div className={"calendar-month-entry " + shift.group }>{format(shift.start_time*1000 , dateFormat)} - {format(shift.end_time*1000, dateFormat)}</div>
        </div>
      </div>

    ))}
    {/*create one modal, and use state to change out displayed info*/}

    <div>
      {this.createModal()}
    </div>
    </div>)
  }

  render(){
    return(
     <div>
        {this.drawShifts()}
      </div>

    )
  }
}

export default ShowMonth;
