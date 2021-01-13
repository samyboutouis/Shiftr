import React, { useState } from "react";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import ShowDay from "./showDay.js"
import getUnixTime from "date-fns/getUnixTime"
import startOfDay from "date-fns/startOfDay"
import endOfDay from "date-fns/endOfDay"
import addHours from "date-fns/addHours"

const DayCalendar = (props) => {
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
const dayStart = startOfDay(currentDate);
const dayEnd = endOfDay(currentDate);
const startDate = dayStart;
const endDate = dayEnd;
const hours = ["0000", "0100", "0200", "0300", "0400", "0500", "0600", "0700", "0800", "0900", "1000", "1100", "1200",
"1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100", "2200", "2300"];
const rows = []; /* rows containing each day's hours */
let day = startDate;

/*filling rows with 24 hours and querying for shifts*/
while (day <= endDate) {
  for (let i = 0; i < 24; i++) {
    rows.push(<div>
          <div className="row-day" key={i}> {(hours[i])} </div>
          <ShowDay start={getUnixTime(day)} checkedList={props.checkedList}/>
          </div>
        );
        day = addHours(day, 1);
    }
   }
   return(<div>
   <div className="body" key={day}>{rows} </div>
    </div>)

 }

/* functions in header for changing the day */
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
