import React, {Component} from 'react';
import format from 'date-fns/format'

class EditShift extends Component {
    constructor(props){
        super()
        this.state = {employee: null, start_time: null, end_time: null}
      }

    submitForm = (event) => {
        this.props.toggleModal()
        event.preventDefault();
        // let url = "http://localhost:8080/schedule/assign_shifts/" + this.state.group + '/' + this.state.start_date + '/' + this.state.end_date
        // axios.put(url).then((response) => {
        //     console.log(response.data)
        //     this.props.toggleBuildSchedule(response.data)
        // }).catch(function (err){  
        //     console.log(err)
        // });
    }

    changeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        }); 
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
                            defaultValue={format(this.props.shift.start_time*1000, "HH:mm")} 
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
                            defaultValue={format(this.props.shift.end_time*1000, "HH:mm")} 
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