import React, {Component} from 'react';

class ScheduleKey extends Component {
  constructor(props){
    super();
  }

  mapGroups = () => {
    return(
      <div>
        <label className="container">MPS
        <input type="checkbox"  checked/>
        <span className="checkmark mps-box"></span>
        </label>

        <label className="container">Two
        <input type="checkbox" checked/>
        <span className="checkmark services-box"></span>
        </label>

        <label className="container">Three
        <input type="checkbox"/>
        <span className="checkmark tutors-box"></span>
        </label>

        <label className="container">Four
        <input type="checkbox"/>
        <span className="checkmark labTrain-box"></span>
        </label>

        <label className="container">Four
        <input type="checkbox"/>
        <span className="checkmark officeHours-box"></span>
        </label>

        <label className="container">Four
        <input type="checkbox"/>
        <span className="checkmark designhub-box"></span>
        </label>
      </div>)
  }

  render(){
    return(
        <div>
         {this.mapGroups()}
        </div>)}

}



export default ScheduleKey
