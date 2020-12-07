import React, {Component} from 'react';

class PrefKey extends Component {
  constructor(props){
    super();
  }

  mapGroups = () => {
    return this.props.groups.map((group,index) => 
      <div key={index}>
        <span style={{backgroundColor: group.color, height: '20px', width: '20px', float: 'left'}}></span>
        <p>{group.group}</p> 
      </div>
    )
  }

  render(){
    return(
        <div style={{paddingRight: '10px'}}>
         {this.mapGroups()}
        </div>
    )
  }
}


export default PrefKey