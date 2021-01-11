import React, {Component} from 'react';
import Shift from './shift';
import UserAvailability from './userAvailability'
import getHours from "date-fns/getHours"
import getDay from "date-fns/getDay"
import getMinutes from "date-fns/getMinutes"
import differenceInMinutes from "date-fns/differenceInMinutes"
import EditShift from './editShift.js'
import axios from 'axios';

class GeneratedSchedule extends Component {
    constructor(props){
        super()
        this.state = {modal: false, schedule: null}
    }

    drawShifts = () => {
        var cells=[];
        var data = this.state.schedule ? this.state.schedule : this.props.data
        var first_shift = data.shifts[0]
        var day = getDay(first_shift.start_time*1000)
        var starting_height = (getHours(first_shift.start_time*1000)*60+getMinutes(first_shift.start_time*1000))*6/5-100
        data.shifts.map((shift,index) => {
            if (getDay(shift.start_time*1000)>day) {
                starting_height = (getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000))*6/5-100
                day = getDay(shift.start_time*1000)
            }
            cells.push( <div 
                onClick={this.toggleModal.bind(this, shift)} 
                className="calendar-week-entry click-me" 
                key={index} 
                style={{
                    position: "absolute", 
                    left: getDay(shift.start_time*1000)*200, 
                    width: 150, 
                    top: (getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000))*6/5-starting_height, 
                    height: differenceInMinutes(shift.end_time*1000, shift.start_time*1000)*9/10}}>
                <Shift shift={shift} group={this.props.data.group} />
            </div>
        )})
        return cells
    }

    updateSchedule = () => {
        let self = this
        axios.get("http://localhost:8080/schedule/"+this.props.data._id).then( (response) => {
            self.setState({schedule: response.data})
         }).catch( (error) => {
            console.log(error)
         });
    }

    toggleModal = (shift) => {
        if(shift){
            this.setState({modal: shift})
        } else {
            this.setState({modal: false})
        }
    }

    editShift = () => {
        if(this.state.modal){
            return <div>
                <EditShift 
                    toggleModal={this.toggleModal} 
                    shift={this.state.modal} 
                    employees={this.props.data.users} 
                    schedule={this.props.data._id}
                    updateSchedule={this.updateSchedule}
                />
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