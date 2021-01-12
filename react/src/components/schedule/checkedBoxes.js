// import React, {Component} from 'react';
// import ShowMonth from './showMonth.js';
// import ShowWeek from './showWeek.js';
// import ShowDay from './showDay.js';
//
// // the actual calendar constructors are hooks, not classes, and i didn't want to pass
// //a state from a class, convert to hook, pass to another class, and convert back from hook
// //however this also feels extremely inefficient, as this class is an intermediary
// //as i pass a state from child to parent to grandchild (so between nephews/nieces if my english is right)
// //using context or redux was suggested online to handle passing this state
//
// class CheckedBoxes extends Component {
//   constructor(props){
//     super()
//     this.state= {}
//   }
//
//
//   drawCalendar = () => {
//       return(<div key={this.props.checkedList}>
//         <ShowMonth checkedList={this.props.checkedList}/>
//         <ShowWeek currentList={this.props.checkedList}/>
//         <ShowDay checkedList={this.props.checkedList}/>
//         </div>)
//   }
//
//
//
//   render(){
//     console.log("LIST@CHECKEDBOXES:")
//     console.log(this.props.checkedList)
//
//     return(<div key={this.props.checkedList}>
//       <drawCalendar/>
//       </div>
//     )
//   }
// }
//
// export default CheckedBoxes;
