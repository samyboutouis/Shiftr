import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class ScheduleKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {checkedItems: new Map(), showShift: true}
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e, key) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
    //THE SHOWING STUFF i have a DB field of checked with a boolean value. the query of shifts in the calendar will only take true shifts

    // let form_data = new FormData();

    // var showShift = (isChecked) ? "true" : "false"
    // // form_data.append("checked", showShift); // CHANGE FORM DATA TO APPEND USER'S NETID once login/logout is finalized
    // axios.put("http://localhost:8080/shifts/check/" + key + "/" + showShift).then( (response) => {
    //   console.log('success, woo! (hopefully)')
    // }).catch( (error) => {
    //   console.log(error)
    // });
  }

  render() {
    // define what a checkbox has
    const Checkbox = ({ type = 'checkbox', name, checked = true, onChange, styletag}) => (
      <input type={type} name={name} checked={checked} onChange={onChange} styletag={styletag}/>
    );
    // hardcoded checkbox data below
    const checkboxcontent = [
      {
        styletag: 'mps-box',
        key: 'mps',
        name: 'MPS',
      },
      {
        styletag: 'services-box',
        key: 'services',
        name: 'Student Services',
      },
      {
        styletag: 'tutors-box',
        key: 'tutors',
        name: 'TechTutors',
      },
      {
        styletag: 'labTrain-box',
        key: 'labTrain',
        name: 'Lab & Training',
      },
      {
        styletag: 'officeHours-box',
        key: 'officeHours',
        name: 'Office Hours',
      },
      {
        styletag: 'designhub-box',
        key: 'designhub',
        name: 'DesignHub',
      },
      {
        styletag: 'codePlus-box',
        key: 'codePlus',
        name: 'Code Plus',
      },
    ];

    return (
      <div>
        {
          checkboxcontent.map(item => (
            <div>
              <label key={item.key} className="container">
                {item.name}
                <Checkbox name={item.name} checked={this.state.checkedItems.get(item.name)} onChange={(e) => this.handleChange(e, item.key)} />
                <span className={"checkmark "+ item.styletag}></span>
              </label>
            </div>
          ))
        }
      </div>
    );
  }
}

export default ScheduleKey;
