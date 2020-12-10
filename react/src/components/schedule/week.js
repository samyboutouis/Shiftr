import React, { useState } from "react";
import startOfWeek from "date-fns/startOfWeek";
import format from "date-fns/format";
import endOfWeek from "date-fns/endOfWeek";
import isSameDay from "date-fns/isSameDay";
import isSameWeek from "date-fns/isSameWeek";
import parse from "date-fns/parse";
import addDays from "date-fns/addDays";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";



const WeekCalendar = () => {
/* set the forward and back 1 month fxn */
const [currentDate, setCurrentDate] = useState(new Date());
/* month header */
const header = () => {
const dateFormat = "MMMM yyyy";
return (
   <div className="header row flex-middle">
      <div className="column col-start">
         <div className="icon" onClick={prevWeek}>
            chevron_left
         </div>
      </div>
      <div className="column col-center">
         <span>{format(currentDate, dateFormat)}</span>
      </div>
      <div className="column col-end">
         <div className="icon" onClick={nextWeek}>
            chevron_right
         </div>
      </div>
   </div>
   );
};
/* days of the week */
const days = () => {
const dateFormat = 'ddd';
const days = [];
const fill = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
let startDate = startOfWeek(currentDate);
for (let i = 0; i < 7; i++) {
      days.push(
         <div className="column col-center" key={i}>
         {(fill[i])}
         </div>
      );
   }
   return <div className="days row">{days}</div>;
};
/* calendar cells */
const cells = () => {
const weekStart = startOfWeek(currentDate);
const weekEnd = endOfWeek(currentDate);
const rows = [];
const startDate = weekStart;
const endDate = weekEnd;
const dateFormat = 'ddd';
let days = [];
let day = startDate;
let formattedDate = "";

while (day <= endDate) {
   for (let i = 0; i < 7; i++) {
   formattedDate = format(day, dateFormat);
   const cloneDay = day;
days.push(
      <div /* double ternary operator checks if the date belongs to the month, and adds disabled if not current date */
       className={`column cell ${!isSameWeek(day, weekStart)}`}
       key={day}
       >
       <span className="number">{formattedDate}</span>
     </div>
     );
   day = addDays(day, 1);
  }
  rows.push(
        <div className="row" key={day}> {days} </div>
      );
     days = [];
   }
   return <div className="body">{rows}</div>;
 }

 const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
 };
 const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
 };

return (
   <div className="calendar">
      <div>{header()}</div>
      <div>{days()}</div>
      <div>{cells()}</div>
   </div>
  );
};
export default WeekCalendar;
