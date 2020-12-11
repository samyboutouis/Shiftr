import React, {Component} from 'react';

class HoursIndex extends Component {
    constructor(props){
      super();
      this.state = { //state is by default an object
        dates: [
           {id: '12/12/20', clockIn: '8:00 am', clockOut: '11:00 am' , rHours: '3',otHours: '1', totHours: '1'  },
           {id: '12/13/20', clockIn: '8:00 am', clockOut: '12:00 pm' , rHours: '3', otHours: '1',totHours: '1' },
           {id: '12/14/20', clockIn: '8:00 am' , clockOut: '11:00 am' , rHours: '3', otHours: '0',totHours: '1'  },
           {id: '12/15/20', clockIn: '8:00 am', clockOut: '11:00 am' , rHours: '3', otHours:  '0',totHours: '1'}
        ]
     }

    }
    renderTableData() {
        return this.state.dates.map((date, index) => {
           const {id, clockIn, clockOut , rHours, otHours, totHours } = date 
           return (
              <tr key={date}>
                 <td> {id}</td>
                 <td> {clockIn}</td>
                 <td> {clockOut}</td>
                 <td> {rHours}</td>
                 <td> {otHours}</td>
                 <td> {totHours}</td>
              </tr>
           )
        })
     }
  
     render() {
        return (
           <div className = "margin">
              <table>
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
                    {this.renderTableData()}
                 </tbody>
              </table>
           </div>
        )
     }
    }

    export default HoursIndex