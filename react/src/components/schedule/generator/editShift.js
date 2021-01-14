import React, {Component} from 'react';
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import getYear from 'date-fns/getYear'
import getMonth from 'date-fns/getMonth'
import getDate from 'date-fns/getDate'
import getUnixTime from 'date-fns/getUnixTime'
import axios from 'axios';

class EditShift extends Component {
    constructor(props){
        super()
        this.state = {employee: null, netid: null, start_time: null, end_time: null}
    }

    componentDidMount = () => {
        this.setState({
            employee: this.props.shift.employee ? this.props.shift.employee.name : null, 
            netid: this.props.shift.employee ? this.props.shift.employee.netid : null, 
            start_time: this.props.shift.start_time, 
            end_time: this.props.shift.end_time
        })
    }

    submitForm = (event) => {
        this.props.toggleModal()
        event.preventDefault();

        let form_data = new FormData();
        for (let [key, value] of Object.entries(this.state)) {
            if(value) {
                form_data.append(key, value)
            };
        }
        form_data.append("shift_id", this.props.shift._id)

        let url = "http://localhost:8080/schedule/edit_shift/" + this.props.schedule
        axios.put(url, form_data, { headers: {'content-type': 'multipart/form-data'}}).then((response) => {
            this.props.updateSchedule()
        }).catch(function (err){  
            console.log(err)
        });
    }

    changeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if(name==="user") {
            this.setState({
                netid: this.props.employees.find( ({ name }) => name === value ).netid
            });
        }
        if(name==="start_time" || name==="end_time") {
            var time = value.split(":")
            var date = this.props.shift[name]*1000
            this.setState({
                [name]: getUnixTime(toDate(new Date(getYear(date), getMonth(date), getDate(date), time[0], time[1], 0)))
            })
        }
        else {
            this.setState({
                [name]: value
            }); 
        }
    }

    employeeOptions = () => {
        var options = []
        this.props.employees.forEach((employee) =>
          options.push(
            <option className="capitalize-me" value={employee.name}>{employee.name}</option>
          )
        )
        return options
    }

    closeModal = () => {
        this.props.toggleModal()
    }

    editShiftModal = () => {
        return <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
            
            <header className="modal-card-head">
                <p className="modal-card-title">Edit Shift</p>
                <button onClick={this.closeModal.bind(this)} className="delete" aria-label="close"></button>
            </header>

            <section className="modal-card-body">
                <form>

                <div className="field">
                    <label className="label">Employee</label>
                    <div className="control">
                        <div className="select" onChange={this.changeHandler}>
                            <select defaultValue={this.props.shift.employee ? this.props.shift.employee.name : this.props.shift.status} name="user">
                                <option value={null}>Unassigned</option>
                                {this.employeeOptions()}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Start Time</label>
                    <div className="control">
                        <input 
                            className="input" 
                            name="start_time" 
                            defaultValue={format(this.props.shift.start_time*1000, "h:mm")} 
                            type="time"
                            onChange={this.changeHandler}
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">End Time</label>
                    <div className="control">
                        <input 
                            className="input" 
                            name="end_time" 
                            defaultValue={format(this.props.shift.end_time*1000, "h:mm")} 
                            type="time" 
                            onChange={this.changeHandler}
                        />
                    </div>
                </div>

                </form>
            </section>

            <footer className="modal-card-foot">
                <div className="control">
                <input className="button is-success" onClick={this.submitForm} type='submit' />
                </div>
            </footer>

            </div>
        </div>
    }

    render() {
        return <div>
            {this.editShiftModal()}
        </div>
    }
}

export default EditShift