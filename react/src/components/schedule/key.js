import React, {Component} from 'react';

class ScheduleKey extends Component {
  constructor(props){
    super();
  }

  mapGroups = () => {
    return this.props.groups.map((group,index) => 
      <div key={index}>
        <span style={{backgroundColor: group.color}} className="key-box"></span>
        <p>{group.group}</p> 
      </div>
    )
  }

  render(){
    return(
        <div className="key">
         {this.mapGroups()}
        </div>
    )
  }
}


export default ScheduleKey
