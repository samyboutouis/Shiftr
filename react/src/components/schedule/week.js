import React, { useState } from "react";
import startOfWeek from "date-fns/startOfWeek";
import format from "date-fns/format";
import endOfWeek from "date-fns/endOfWeek";
import isSameWeek from "date-fns/isSameWeek";
import addDays from "date-fns/addDays";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";
import ShowWeek from "./showWeek.js";
import getUnixTime from "date-fns/getUnixTime"

const WeekCalendar = () => {
const [currentDate, setCurrentDate] = useState(new Date());

/* month header */
/* set the forward and back 1 month fxn */
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

/* days of the week under the header */
const daynames = () => {
const daynames = [];
const fill = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
for (let i = 0; i < 7; i++) {
      daynames.push(
         <div className="column col-center" key={i}>
         {(fill[i])}
         </div>
      );
   }
   return <div className="days row">{daynames}</div>;
};

/* calendar cells */
const cells = () => {
const weekStart = startOfWeek(currentDate);
const weekEnd = endOfWeek(currentDate);
const startDate = weekStart;
const endDate = weekEnd;
const dateFormat = 'dd';
let days = [];
let day = startDate;
let formattedDate = "";

while (day <= endDate) {
   for (let i = 0; i < 7; i++) {
   formattedDate = format(day, dateFormat);
days.push(
      <div
       className={`column week-cell ${!isSameWeek(day, weekStart)}`}
       key={day}>
       <div className="number">
       {formattedDate}
       </div>
       <ShowWeek start={getUnixTime(day)}/>
     </div>
     );
   day = addDays(day, 1);
  }
   }

   return(  <div>
      <div className="row" key={day}> {days} </div>
    </div>)
 }

/* functions used in header for changing weeks */
 const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
 };
 const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
 };

return (
   <div className="calendar">
      <div>{header()}</div>
      <div>{daynames()}</div>
      <div>{cells()}</div>
   </div>
  );
};
export default WeekCalendar;
