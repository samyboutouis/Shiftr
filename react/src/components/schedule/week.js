import React, { useState } from "react";
import startOfWeek from "date-fns/startOfWeek";
import format from "date-fns/format";
import endOfWeek from "date-fns/endOfWeek";
import isSameWeek from "date-fns/isSameWeek";
import addDays from "date-fns/addDays";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";
import ShowWeek from "./showWeek.js";


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
const days = [];
const fill = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
/*let startDate = startOfWeek(currentDate);*/
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
// const rows = [];
const startDate = weekStart;
const endDate = weekEnd;
const dateFormat = 'dd';
// const hours = ["0000", "0100", "0200", "0300", "0400", "0500", "0600", "0700", "0800", "0900", "1000", "1100", "1200",
// "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100", "2200", "2300"]
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

       <div className="number">{formattedDate}</div>
       {/*<div><ShowWeek day={day}/> </div>*/}

       <div>
          <div className="twelve"> <ShowWeek day={day} hour={0}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={1}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={2}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={3}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={4}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={5}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={6}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={7}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={8}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={9}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={10}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={11}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={12}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={13}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={14}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={15}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={16}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={17}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={18}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={19}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={20}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={21}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={22}/></div>
          <div className="twelve"> <ShowWeek day={day} hour={23}/></div>

       </div>



     </div>
     );
   day = addDays(day, 1);
  }

  /*for (let i = 0; i < 24; i++){
  rows.push(
      <div>
        <div className="hour-row" key={i}> .</div>

      </div>
    )};*/
   }

   return(  <div>
      <div className="row" key={day}> {days} </div>
    </div>)
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
