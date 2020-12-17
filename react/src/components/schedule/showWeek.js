import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import getUnixTime from "date-fns/getUnixTime"
import getHours from "date-fns/getHours"
import getMinutes from "date-fns/getMinutes"
import parse from "date-fns/parse"
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
    const aformat = ("MM dd yyyy")
    const atimestart = format(this.props.day, aformat)
    const atimeend = format(this.props.day, aformat)
    const start = getUnixTime(parse(atimestart + " "+ this.props.hour, "MM dd yyyy H", new Date()))
    const end = getUnixTime(parse(atimeend + " "+ this.props.hour + " 59", "MM dd yyyy H mm", new Date()))
    axios.get("http://localhost:8080/shifts/find_start/" + start + "/" + end).then( (response) => {
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
    //literally just me being unsuccessful over and over but this is me attempting to adjust six of shift box
//     let root = document.documentElement
//     console.log("SHIFTFIRST:"+shifts[1])
//     let h = shifts.length
//     let allshifts = []
// // do while greater than zero and append some height to it
//
//     shifts.map(shift, index){
//       let numberr = shift.start_time - shift.end_time
//       let timess = 1
//       while (numberr > 0){
//         numberr = numberr - 60
//       }
//       <div key={index}>
//         {/*{document.documentElement.style.setProperty("--color", "yellow")}*/}
//         <p className="calendar-week-entry" >{format(shift.start_time*1000, dateFormat)} - {format(shift.end_time*1000, dateFormat)}</p>
//         {/* <p className='upcoming-shift-text'> {shift.group} | @{shift.location}</p>*/}
//       </div>
//     }
//     return allshifts
    return shifts.map((shift,index) =>
      // if ((shift.start_time - shift.end_time) >0 && (shift.start_time - shift.end_time) <1){
        <div key={index}>
          {/*{document.documentElement.style.setProperty("--color", "yellow")}*/}
          <p className="calendar-week-entry" >{format(shift.start_time*1000, dateFormat)} - {format(shift.end_time*1000, dateFormat)}</p>
        </div>
      // }
    )
  }


  render(){


    return(
     <div>
        {this.drawShifts()}
        {document.documentElement.style.setProperty("--color", "lightseagreen")}
      </div>

    )
  }
}

export default ShowWeek;
