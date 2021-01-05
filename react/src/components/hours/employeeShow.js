import React, {Component} from 'react';
import format from 'date-fns/format'

class EmployeeShow extends Component {
    drawShifts = () => {
        if(this.props.data){
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
        return this.props.data.shifts.map((shift,index) =>
          <tr key={index}>
              <td> {format(shift.start_time*1000, "M/d/y")}</td>
              <td> {format(shift.clocked_in*1000, "h:mm a")}</td>
              <td> {format(shift.clocked_out*1000, "h:mm a")}</td>
              <td> {Math.round((shift.total_hours-shift.ot_hours)/360)/10} </td>
              <td> {Math.round(shift.ot_hours/360)/10 > 0 ? Math.round(shift.ot_hours/360)/10 : null } </td>
              <td> {Math.round(shift.total_hours/360)/10} </td>
          </tr>
        )
      }
  
       render() {
        return(
           <div>
              {this.drawShifts()}   
           </div>
         )
       }
    }

    export default EmployeeShow