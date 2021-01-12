import React from 'react';

class ScheduleKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {checkedItems: new Map(), checkedList: this.props.currentList,showShift: true} //showShift is from backend CB call
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange = (e, key) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
//MODIFYING THE LIST OF CHECKED ITEMS
    let prechecked = []
     if(e.target.checked)
        {prechecked = this.state.checkedList.filter(CheckedId=>CheckedId !== key)
        prechecked.push(key)}
     else
     {prechecked = this.state.checkedList.filter(CheckedId=>CheckedId !== key)}
     this.props.parentCallback({prechecked})
     this.setState({checkedList: prechecked})
     console.log("CHILDPRE:")
     console.log(typeof(prechecked))

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
