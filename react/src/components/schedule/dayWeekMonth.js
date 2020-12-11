import React, { useState } from "react";


const DayWeekMonth = () => {
const[isActive, setActive] = useState("false");

const handleToggle1 = () =>{
  setActive(!isActive);
};
const handleToggle2 = () =>{
  setActive(!isActive);
};
const handleToggle3 = () =>{
  setActive(!isActive);
};
return (
  <div>
    <button  className={isActive ? "day-week-month active" : "day-week-month"} onClick={handleToggle1}> Day </button>
    <button  className={isActive ? "day-week-month active" : "day-week-month"} onClick={handleToggle2}> Week</button>
    <button  className={isActive ? "day-week-month active" : "day-week-month"} onClick={handleToggle3}> Month </button>
  </div>
);
};

export default DayWeekMonth;
