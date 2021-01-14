import React, {Component} from 'react';
import axios from 'axios';
import EmployeeHours from "./employeeHours";
import SupervisorHours from "./supervisorHours";
import startOfWeek from 'date-fns/startOfWeek'
import endOfWeek from 'date-fns/endOfWeek'
import subWeeks from 'date-fns/subWeeks'
import format from 'date-fns/format'

class HoursIndex extends Component {
    constructor(props){
      super();
      this.state= {data: null}
    }

    componentDidMount = () => {
      this.getShifts()
    }

    getShifts = () => {
      let self = this;
      let date = subWeeks(startOfWeek(new Date()),2)/1000
      if(localStorage.getItem('role')==='employee'){
         axios.get("http://localhost:8080/shifts/employee_hours/"+date).then( (response) => {
            self.setState({data: response.data})
         }).catch( (error) => {
            console.log(error)
         });
      } else if(localStorage.getItem('role')==='supervisor' || localStorage.getItem('role')==='admin'){
         axios.get("http://localhost:8080/shifts/supervisor_hours/"+date).then( (response) => {
            self.setState({data: response.data})
         }).catch( (error) => {
            console.log(error)
         });
      }
    }

    drawHeader = () => {
      if(this.state.data) {
         let start_date = subWeeks(startOfWeek(new Date()),2)
         let end_date = new Date()
        return <div className="container is-max-widescreen">
        <h2 className="subtitle mt-5">Pay Period Displayed:</h2>
        <h1 className="title mb-5">{format(start_date, "MMM d")} &#8211; {format(end_date, "MMM d")}</h1>
     </div>
      }
   }

    drawHours = () => {
       if(localStorage.getItem('role')==='employee'){
          return <EmployeeHours data = {this.state.data} />
       } else if(localStorage.getItem('role')==='supervisor' || localStorage.getItem('role')==='admin'){
          return <SupervisorHours data = {this.state.data} />
       }
    }

     render() {
      return(
         <div>
            {this.drawHeader()}
            {this.drawHours()}
         </div>
       )
     }
    }

    export default HoursIndex