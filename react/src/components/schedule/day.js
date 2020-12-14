import React, { useState } from "react";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";



const DayCalendar = () => {
/* set the forward and back 1 month fxn */
const [currentDate, setCurrentDate] = useState(new Date());
/* month header */
const header = () => {
const dateFormat = "dd MMMM yyyy";
return (
   <div className="header row flex-middle">
      <div className="column col-start">
         <div className="icon" onClick={prevDay}>
            chevron_left
         </div>
      </div>
      <div className="column col-center">
         <span>{format(currentDate, dateFormat)}</span>
      </div>
      <div className="column col-end">
         <div className="icon" onClick={nextDay}>
            chevron_right
         </div>
      </div>
   </div>
   );
};

/* calendar cells */
const cells = () => {
const rows = []; /* rows of times */
const dateFormat = 'dd';
const hours = ["0000", "0100", "0200", "0300", "0400", "0500", "0600", "0700", "0800", "0900", "1000", "1100", "1200",
"1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100", "2200", "2300"]
let days = currentDate; /* the day header */
let formattedDate = "";

for (let i = 0; i < 24; i++) {
  rows.push(
        <div className="row" key={i}> {(hours[i])} </div>
      );
  }

   return <div className="body">{rows}</div>;
 }

 const nextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
 };
 const prevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
 };

return (
   <div className="calendar">
      <div>{header()}</div>
      <div>{cells()}</div>
   </div>
  );
};
export default DayCalendar;
