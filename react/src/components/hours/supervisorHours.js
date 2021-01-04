import React, {Component} from 'react';

class SupervisorHours extends Component {
 
     drawShifts = () => {
       if(this.props.data){
         return <div className = "hours-table">
             <table className = "table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                <thead> 
                   <tr>
                      <th>Name</th>
                      <th>NetId</th>
                      <th>Total Hours</th>
                      <th>Estimated Pay</th>
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
       return this.props.data.map((user,index) =>
         <tr key={index}>
            <td> {user.name}</td>
            <td> {user._id}</td>
            <td> {Math.round((user.total_hours)/360)/10} </td>
            <td> </td>
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

    export default SupervisorHours