import React, {Component} from 'react';
import EmployeeShow from './employeeShow.js'

class EmployeeHours extends Component {

    drawHeader = () => {
       if(this.props.data) {
         return <div className="container is-max-widescreen">
         <table className = "is-pulled-right table hours-header-table is-fullwidth">
               <thead> 
                  <tr>
                     <th><h2 className="subtitle">Total Hours</h2></th>
                     {/* <th><h2 className="subtitle">Total OT Hours</h2></th> */}
                  </tr>
               </thead> 
               <tbody>
                  <tr>
                     <td><h1 className="title">{Math.round(this.props.data.total_hours/360)/10}</h1></td>
                     {/* <td><h1 className="title">{Math.round(this.props.data.total_ot/360)/10}</h1></td> */}
                  </tr>
               </tbody>
            </table>
            <h1 className="title py-4">Work Log</h1>
      </div>
       }
    }

    drawShifts = () => {
      if(this.props.data){
        return <EmployeeShow data = {this.props.data} />
      }
    }

     render() {
      return(
         <div>
            {this.drawHeader()}
            {this.drawShifts()}   
         </div>
       )
     }
    }

    export default EmployeeHours