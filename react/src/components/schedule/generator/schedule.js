import React, {Component} from 'react';
import Shift from './shift';
import UserAvailability from './userAvailability'
import getHours from "date-fns/getHours"
import getDay from "date-fns/getDay"
import getMinutes from "date-fns/getMinutes"
import format from "date-fns/format"
import endOfWeek from 'date-fns/endOfWeek'
import differenceInMinutes from "date-fns/differenceInMinutes"
import getUnixTime from 'date-fns/getUnixTime'
import EditShift from './editShift.js'
import axios from 'axios';
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'

class GeneratedSchedule extends Component {
    constructor(props){
        super()
        this.state = {modal: false, schedule: null, published: null}
    }

    componentDidMount() {
        this.findOverlap(this.props.data.shifts)
    }

    drawShifts = () => {
        var cells=[];
        if(this.state && this.state.schedule) {
        var data = this.state.schedule// ? this.state.schedule : this.props.data
        var first_shift = data.shifts[0]
        var week = 0
        if(first_shift) {
            var day = getDay(first_shift.start_time*1000)
            var starting_height = (getHours(first_shift.start_time*1000)*60+getMinutes(first_shift.start_time*1000))*6/5-150
            data.shifts.map((shift,index) => {
                if(shift.start_time > getUnixTime(endOfWeek(first_shift.start_time*1000))) {
                    week= 640
                }
                if (getDay(shift.start_time*1000)>day) {
                    starting_height = (getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000))*6/5-150
                    day = getDay(shift.start_time*1000)
                }
                cells.push(
                    <div style={{position: "absolute", left: getDay(shift.start_time*1000)*200+20, top:week+120}}>
                        <h2 className="subtitle">{format(shift.start_time*1000,"M/d/y")}</h2>
                    </div>
                )
                cells.push( <div 
                    onClick={this.toggleModal.bind(this, shift)} 
                    className="schedule-shift click-me" 
                    key={index} 
                    style={{
                        position: "absolute", 
                        left: getDay(shift.start_time*1000)*200, 
                        width: shift.overlap ? 140/shift.overlap.count+"px" : "150px",
                        marginLeft: shift.overlap ? shift.overlap.position/shift.overlap.count*150+"px" : 0,
                        top: (getHours(shift.start_time*1000)*60+getMinutes(shift.start_time*1000))*6/5-starting_height+week, 
                        height: differenceInMinutes(shift.end_time*1000, shift.start_time*1000)*9/10}}>
                    <Shift shift={shift} group={this.props.data.group} />
                </div>
            )})
        }
    }
        return cells
        
    }

    findOverlap = (data) => {
        var shifts = data
        for(var i=0; i<shifts.length-1; i++) {
            for(var j=i+1; j<shifts.length; j++) {
                var current_interval = {start: shifts[i].start_time, end: shifts[i].end_time}
                var next_interval = {start: shifts[j].start_time, end: shifts[j].end_time}
                if(areIntervalsOverlapping(current_interval, next_interval)) {
                    if(shifts[i].overlap) {
                        shifts[i].overlap.count++
                    } 
                    else {
                        shifts[i].overlap={count: 2, position: 0}
                    }
                    if (shifts[j].overlap) {
                        shifts[j].overlap.count++
                    }
                    else {
                        shifts[j].overlap={count: shifts[j-1].overlap.count, position: shifts[j-1].overlap.position+1}
            //             shifts[j].overlap={count:2}
            //   if(shifts[j-1].overlap.count===shifts[j].overlap.count){
            //     shifts[j].overlap.position=shifts[j-1].overlap.position+1
            //   }
            //   else {
            //     shifts[j].overlap.count=shifts[j-1].overlap.count
            //     shifts[j].overlap.position=shifts[j-1].overlap.position-1
            //   }
                    }
                }
            }
        }
        this.setState({schedule:{shifts:shifts}})
    }

    updateSchedule = () => {
        let self = this
        axios.get("http://localhost:8080/schedule/"+this.props.data._id).then( (response) => {
            self.setState({schedule: response.data})
            this.findOverlap(this.state.schedule.shifts)
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

    saveSchedule = () => {
        if(this.state.published) {
            return <h2 className="build-schedule-button publish-schedule">Successfully Published</h2>
        }
        else {
            return <button className='build-schedule-button publish-schedule-button' onClick={this.publishSchedule.bind(this)}>Publish Schedule</button>
        }
    }    

    publishSchedule = () => {
        let self = this
        axios.put("http://localhost:8080/schedule/publish_schedule/"+this.props.data._id).then( (response) => {
            self.setState({published: true})
         }).catch( (error) => {
            console.log(error)
         });
    }

    drawUsers = () => {
        return this.props.data.users.map((user,index) =>
            <div className="availability-item" key={index}>
                <UserAvailability user={user} />
            </div>
        )
    }

    drawHeader = () => {
        return <div className="container is-max-widescreen">
            <h1 className="title my-5">Generated Schedule</h1>
        </div>
    }

    render() {
        console.log(this.state)
        return <div>
            {this.drawHeader()}
            {this.editShift()}
            {this.drawShifts()}
            {this.saveSchedule()}
            <h1 className="title schedule-builder">Remaining Availability</h1>
            <div className="container is-max-widescreen unscheduled-availability">
                {this.drawUsers()}
            </div>
        </div>
    }
}

export default GeneratedSchedule