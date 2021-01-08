import React from 'react';
import PropTypes from 'prop-types';

class ScheduleKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {checkedItems: new Map(),}
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
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
        key: 'box1',
        name: 'MPS',
      },
      {
        styletag: 'services-box',
        key: 'box2',
        name: 'Student Services',
      },
      {
        styletag: 'tutors-box',
        key: 'box3',
        name: 'TechTutors',
      },
      {
        styletag: 'labTrain-box',
        key: 'box4',
        name: 'Lab & Training',
      },
      {
        styletag: 'officeHours-box',
        key: 'box5',
        name: 'Office Hours',
      },
      {
        styletag: 'designhub-box',
        key: 'box6',
        name: 'DesignHub',
      },
      {
        styletag: 'codePlus-box',
        key: 'box7',
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
                <Checkbox name={item.name} checked={this.state.checkedItems.get(item.name)} onChange={this.handleChange} />
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
