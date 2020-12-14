import React, {Component} from 'react';

class Key extends Component {
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
        <div className = "key-margin" style={{paddingRight: '10px'}}>
         {this.mapGroups()}
        </div>
    )
  }
}


export default Key