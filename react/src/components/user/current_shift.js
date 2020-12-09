import React, {Component} from 'react';
// import axios from 'axios';
import Clock from '../../clock.png';

class CurrentShift extends Component {
    constructor(props){
        super(props);
        this.state = {name: ""};
    }

    getName = () => {
        this.setState({name: "Samy", shiftsToday: "one"});
    }

    componentDidMount() {
        this.getName();
    }

    render() {
        return (
            <div className="background-pretty-gradient">
                <div>
                  <p className="greeting">Hello, {this.state.name}</p>
                  <p className="landing-box">You have {this.state.shiftsToday} shift today.</p>
                </div>
                <div className="transparent-box">
                  <p>a bunch of text about the shift(s) that user has today</p>
                </div>
                <button className="clock-in"> 
                    <img className="clock" src={Clock} alt="Clock"/>
                    <span className="clock-text">Clock In</span>
                </button>
            </div>
        );
    }
}

export default CurrentShift;