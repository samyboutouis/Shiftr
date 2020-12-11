import React, { useState } from "react";
import startOfWeek from "date-fns/startOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import format from "date-fns/format";
import endOfMonth from "date-fns/endOfMonth";
import endOfWeek from "date-fns/endOfWeek";
import isSameMonth from "date-fns/isSameMonth";
import isSameDay from "date-fns/isSameDay";
import addDays from "date-fns/addDays";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";



const MonthCalendar = () => {
/* set the forward and back 1 month fxn */
const [currentDate, setCurrentDate] = useState(new Date());
const [selectedDate, setSelectedDate] = useState(new Date());
/* month header */
const header = () => {
const dateFormat = "MMMM yyyy";
return (
   <div className="header row flex-middle">
      <div className="column col-start">
         <div className="icon" onClick={prevMonth}>
            chevron_left
         </div>
      </div>
      <div className="column col-center">
         <span>{format(currentDate, dateFormat)}</span>
      </div>
      <div className="column col-end">
         <div className="icon" onClick={nextMonth}>
            chevron_right
         </div>
      </div>
   </div>
   );
};
/* days of the week */
const days = () => {
const days = [];
const fill = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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
const monthStart = startOfMonth(currentDate);
const monthEnd = endOfMonth(monthStart);
const startDate = startOfWeek(monthStart);
const endDate = endOfWeek(monthEnd);
const dateFormat = "d";
const rows = [];
let days = [];
let day = startDate;
let formattedDate = "";
while (day <= endDate) {
   for (let i = 0; i < 7; i++) {
   formattedDate = format(day, dateFormat);
days.push(
      <div /* double ternary operator checks if the date belongs to the month, and adds disabled if not current date */
       className={`column cell ${!isSameMonth(day, monthStart)
       ? "disabled" : isSameDay(day, selectedDate)
       ? "selected" : "" }`}
       key={day}
       value={selectedDate}
       onClick={onDateClick}
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

const nextMonth = () => {
   setCurrentDate(addMonths(currentDate, 1));
};
const prevMonth = () => {
   setCurrentDate(subMonths(currentDate, 1));
};

const onDateClick = day => {
setSelectedDate(day);
}

return (
   <div className="calendar">
      <div>{header()}</div>
      <div>{days()}</div>
      <div>{cells()}</div>
   </div>
  );
};
export default MonthCalendar;
