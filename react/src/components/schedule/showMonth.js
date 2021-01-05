import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import getUnixTime from "date-fns/getUnixTime";

class ShowMonth extends Component {
  constructor(props){
    super()
    this.state= {shifts: false};
    this.state = {isModal: false};
  }


  handleClick = () => {
    this.setState({ isModal: !this.state.isModal });
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
    let dateFormat = "HH mm"
    const active = this.state.isModal ? "is-active" : "";
    return shifts.map((shift,index) =>
      <div key={index} >


        <div onClick={this.handleClick}>
          <p className={"calendar-month-entry " + shift.group }>{format(shift.start_time*1000 , dateFormat)} - {format(shift.end_time*1000, dateFormat)}</p>
        </div>


        {/* modal for each shift */}
        <div className={`modal ${active}`}>
          <div className="modal-background" />
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{format(shift.start_time*1000 , dateFormat)} - {format(shift.end_time*1000, dateFormat)}, @ {shift.location}</p>
              <button
                onClick={this.handleClick}
                className="delete"
              />
            </header>
            <section className="modal-card-body">
                <p>{shift.group}</p>
            </section>
            <footer className="modal-card-foot"></footer>
          </div>
        </div>
      </div>


    )
  }

  // $(".modal-button").click(function() {
  //           var target = $(this).data("target");
  //           $("html").addClass("is-clipped");
  //           $(target).addClass("is-active");
  //        });
  //
  //  $(".modal-close").click(function() {
  //     $("html").removeClass("is-clipped");
  //     $(this).parent().removeClass("is-active");
  //  });


  render(){


    return(
     <div>
        {this.drawShifts()}
      </div>

    )
  }
}

export default ShowMonth;
