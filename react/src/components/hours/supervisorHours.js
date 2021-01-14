import React, {Component} from 'react';
import EmployeeShow from './employeeShow.js'

class SupervisorHours extends Component {
   constructor(props){
      super()
      this.state= {selectedEmployee: false}
    }

    clearSelectedEmployee = () => {
      this.setState({ selectedEmployee: false})
    }

    selectEmployee = (employee) => {
      window.scrollTo(0,document.body.scrollHeight);
      this.setState({selectedEmployee: employee})
    }

    drawSelectedEmployee = () => {
      if(this.state.selectedEmployee){
         return <div className="container is-max-widescreen">
            <div className="message mt-5">
            <div className="message-header">
               <p>{this.state.selectedEmployee.name}</p>
               <button onClick={() => this.clearSelectedEmployee()} className="delete" aria-label="delete"></button>
            </div>
            <div className="message-body">
               <EmployeeShow data={this.state.selectedEmployee.details} />
            </div>
            </div>
         </div>
      }
    }

     drawShifts = () => {
       if(this.props.data){
         return <div className = "container is-max-widescreen">
             <table className = "table is-bordered is-striped is-narrow is-fullwidth">
                <thead> 
                   <tr>
                      <th>Name</th>
                      <th>NetId</th>
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
       return this.props.data.map((user,index) =>
         <tr className="click-me" onClick={this.selectEmployee.bind(this, user)} key={index}>
            <td> {user.name}</td>
            <td> {user._id}</td>
            <td> {Math.round((user.total_hours)/360)/10} </td>
         </tr>
       )
     }
 
      render() {
       return(
          <div>
             {this.drawShifts()}   
             {this.drawSelectedEmployee()}  
          </div>
        )
      }
     }

    export default SupervisorHours