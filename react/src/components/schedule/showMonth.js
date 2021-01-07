import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import getUnixTime from "date-fns/getUnixTime";

class ShowMonth extends Component {
  constructor(props){
    super()
    this.state= {shifts: false, isModal: false, activeItem: ''};
  }


/*changed whether modal is active or not, and which shift's info is shown*/
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
    const start = getUnixTime(startOfDay(this.props.day))
    const end = getUnixTime(endOfDay(this.props.day))
    axios.get("http://localhost:8080/shifts/find_day/" + start + "/" + end ).then( (response) => {
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



/* format queries */
  mapShifts = () => {
    let shifts = this.state.shifts
    let dateFormat = "HH:mm"
    const active = this.state.isModal ? "is-active" : "";
    return(
    /* extra div added so modal can be on same hierarchical level as mapping, (not creating modals within the map)*/
    <div>
    {/*map each shift into the calendar cell*/}
    {shifts.map((shift,index) => (
      <div key={shift} >
        <div onClick={() => this.handleClick(shift)} >
          <p className={"calendar-month-entry " + shift.group }>{format(shift.start_time*1000 , dateFormat)} - {format(shift.end_time*1000, dateFormat)}</p>
        </div>
      </div>

    ))}
    {/*create one modal, and use state to change out displayed info*/}
    <div className={`modal ${active}`}>
    <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.state.activeItem.location}</p>
            <button
              onClick={this.handleClick}
              className="delete"
            />
          </header>
          <section className="modal-card-body">
              <p>{this.state.activeItem.group}</p>
              <br/>
              {/*for some reason, formatting time here is causing a time range error, can't console log it either*/}
              {/*for admin, ability to assign shift from here? for students, claim open? and send to pool?*/}
              {/* ^^ do we want users to be able to manage shifts from calendar?*/}
          </section>
          <footer className="modal-card-foot"></footer>
        </div>

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
