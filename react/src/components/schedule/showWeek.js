import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import getUnixTime from "date-fns/getUnixTime"
import getHours from "date-fns/getHours"
import getMinutes from "date-fns/getMinutes"
// var styles = getComputedStyle(document.documentElement);
// var marg = styles.getPropertyValue('--marg');

class ShowWeek extends Component {
  constructor(props){
    super()
    this.state= {shifts: false}
  }

  componentDidMount = () => {
    this.getShifts()
  }


  getShifts = (props) => {

    let self = this
    const start = getUnixTime(startOfDay(this.props.day))
    const end = getUnixTime(endOfDay(this.props.day))
    axios.get("http://localhost:8080/shifts/find_time/" + start + "/" + end ).then( (response) => {
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




  mapShifts = () => {
    let shifts = this.state.shifts
    let dateFormat = "HH mm"
    let root = document.documentElement

// do while greater than zero and append some height to it
    return for (let i = 0; i < 24; i++) {
      let numberr = shifts[i].start_time - shifts[i].end_time
      let timess = 1
      while (numberr > 0){
        numberr = numberr - 60
        timess = timess +1

      }
      // ENDING PT 12/16


    }
    return shifts.map((shift,index) =>
      // if ((shift.start_time - shift.end_time) >0 && (shift.start_time - shift.end_time) <1){
        <div key={index}>
          {/*{document.documentElement.style.setProperty("--color", "yellow")}*/}
          <p className="calendar-week-entry" >{format(shift.start_time*1000, dateFormat)} - {format(shift.end_time*1000, dateFormat)}</p>
          {/* <p className='upcoming-shift-text'> {shift.group} | @{shift.location}</p>*/}
        </div>
        // {document.documentElement.style.setProperty("--color", "yellow")}
      // }
    )
  }


  render(){


    return(
     <div>
        {this.drawShifts()}
        {document.documentElement.style.setProperty("--color", "yellow")}
      </div>

    )
  }
}

export default ShowWeek;
