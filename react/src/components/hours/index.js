import React, {Component} from 'react';
import axios from 'axios';
import format from "date-fns/format";
import differenceInMinutes from 'date-fns/differenceInMinutes'

class HoursIndex extends Component {
    constructor(props){
      super();
      this.state= {shifts: false}
    }

    componentDidMount = () => {
      this.getShifts()
    }

    getShifts = () => {
      let self = this;
      axios.get("http://localhost:8080/shifts/user_completed/acm105").then( (response) => {
        self.setState({shifts: response.data})
      }).catch( (error) => {
        console.log(error)
      });
    }

    drawShifts = () => {
      if(this.state.shifts){
        return <div className = "hours-table">
            <table className = "table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
               <thead> 
                  <tr>
                     <th>Date</th>
                     <th>Clocked In</th>
                     <th>Clocked Out</th>
                     <th>Regular Hours</th>
                     <th>OT Hours</th>
                     <th>Total Hours</th>
                  </tr>
               </thead> 
               <tbody>
                  {this.mapShifts()}
               </tbody>
            </table>
        </div>
      }
    }

    mapShifts = () => {
      return this.state.shifts.map((shift,index) =>
        <tr key={index}>
            <td> {format(shift.start_time*1000, "M/d/y")}</td>
            <td> {format(shift.clocked_in*1000, "h:mm a")}</td>
            <td> {format(shift.clocked_out*1000, "h:mm a")}</td>
            <td> {this.calculateRegularHours(shift)} </td>
            <td> {this.calculateOT(shift)} </td>
            <td> {this.calculateTotalHours(shift)} </td>
        </tr>
      )
    }

    calculateRegularHours(shift) {
      var start, end
      shift.clocked_in > shift.start_time ? start = shift.clocked_in : start = shift.start_time
      shift.clocked_out < shift.end_time ? end = shift.clocked_out : end = shift.end_time
      return Math.round(differenceInMinutes(end*1000, start*1000)/60*10)/10
    }

    calculateOT(shift) {
      var before, after
      shift.clocked_in < shift.start_time ? before = differenceInMinutes(shift.start_time*1000, shift.clocked_in*1000)/60 : before = 0
      shift.clocked_out > shift.end_time ? after = differenceInMinutes(shift.clocked_out*1000, shift.end_time*1000)/60 : after = 0
      return Math.round((before+after)*10)/10
    }

   calculateTotalHours(shift) {
      return Math.round(differenceInMinutes(shift.clocked_out * 1000, shift.clocked_in * 1000) / 60 * 10) / 10;
   }

     render() {
      return(
         <div>
           {this.drawShifts()}   
         </div>
       )
     }
    }

    export default HoursIndex