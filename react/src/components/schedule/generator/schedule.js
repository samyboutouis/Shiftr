import React, {Component} from 'react';
import Shift from './shift';
import UserAvailability from './userAvailability'
import getHours from "date-fns/getHours"
import getDay from "date-fns/getDay"
import getMinutes from "date-fns/getMinutes"
import differenceInMinutes from "date-fns/differenceInMinutes"
import EditShift from './editShift.js'

class GeneratedSchedule extends Component {
    constructor(props){
        super()
        this.state = {modal: false}
    }

    drawShifts = () => {
        var cells=[];
        this.props.data.shifts.map((shift,index) =>
            cells.push( <div 
                onClick={this.toggleModal.bind(this, shift)} 
                className="calendar-week-entry click-me" 
                key={index} 
                style={{
                    position: "absolute", 
                    left: getDay(shift.start_time*1000)*200, 
                    width: 150, 
                    top: (getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000))*6/5, 
                    height: differenceInMinutes(shift.end_time*1000, shift.start_time*1000)*9/10}}>
                <Shift shift={shift} group={this.props.data.group}/>
            </div>
        ))
        return cells
    }

    toggleModal = (shift) => {
        if(shift){
            this.setState({modal: shift})
        } else {
            console.log("here")
            this.setState({modal: false})
        }
    }

    editShift = () => {
        if(this.state.modal){
            return <div>
                <EditShift toggleModal={this.toggleModal} shift={this.state.modal} employees={this.props.data.users}/>
            </div>
        }
    }    

    drawUsers = () => {
        return this.props.data.users.map((user,index) =>
            <div key={index}>
                <UserAvailability user={user} />
            </div>
        )
    }

    render() {
        return <div>
            {this.editShift()}
            {this.drawShifts()}
            <div className="unscheduled-availability">
                {this.drawUsers()}
            </div>
        </div>
    }
}

export default GeneratedSchedule