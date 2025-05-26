import React, { useState, useRef, useCallback, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";
import isSameMonth from "date-fns/isSameMonth";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./QuickTaxi.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const redundantScroll = 10000;
const monthHeight = 600 - 40;

function QuickTaxi() {
  const [mainMonthDate, setMainMonthDate] = useState(new Date());
  const containerRef = useRef(null);

  // Use date-fns to get months: previous, current, next
  const months = [subMonths(mainMonthDate, 1), mainMonthDate, addMonths(mainMonthDate, 1)];

  // Scroll detection to find the main (centered) month
  const onScroll = useCallback(async () => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;

    if (scrollTop < 0.5 * monthHeight + redundantScroll) {
        setMainMonthDate(months[0]);
        setTimeout(() => {
            containerRef.current.scrollTop = scrollTop + monthHeight;
        });

    } else if (scrollTop > 1.5 * monthHeight + redundantScroll) {
        setMainMonthDate(months[2]);
        // removes the flicker during main month change
        setTimeout(() => {
            containerRef.current.scrollTop = scrollTop - monthHeight;
        });
    }

  }, [mainMonthDate, months]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = monthHeight + redundantScroll;
    }
  }, []);

  const mergeClassNames = (existing = "", added = "") => {
    const set = new Set([...existing.split(" "), ...added.split(" ")]);
    return Array.from(set).filter(Boolean).join(" ");
  };

  // Custom wrapper to apply grayed-out background using rbc-off-range-bg
  const DateCellWrapper = ({ children, monthIndex }) => {
    const existingClassName = children.props.className || "";

    // For cells not in the main month, add class for grayed-out background
    if (1 !== monthIndex) {
      const newClassName = mergeClassNames(existingClassName, "rbc-off-range-bg");
      return React.cloneElement(children, {
        className: newClassName,
      });
    }

    // For main month, just render normally
    return children;
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>{format(months[1], "MMMM yyyy")}</h2>

      {/* Custom day-of-week header */}
      <div className="weekday-header">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
          <div key={idx} className="weekday-cell">
            {day}
          </div>
        ))}
      </div>

      {/* Scrollable calendar container */}
      <div ref={containerRef} className="calendar-scroll-container" onScroll={onScroll} style={{ height: `${monthHeight}px`, overflowY: "auto" }}>
        <div className="monthContainer" style={{ margin: `${redundantScroll}px 0px` }}>
            {months.map((month, idx) => (
            <div key={idx} className="calendar-container" style={{ height: `${monthHeight}px` }}>
                <Calendar
                localizer={localizer}
                events={[]}
                startAccessor="start"
                endAccessor="end"
                style={{ height: monthHeight }}
                views={["month"]}
                defaultView="month"
                toolbar={false}
                date={month}
                components={{
                    header: () => null,
                    dateCellWrapper: (props) => <DateCellWrapper {...props} monthIndex={idx} />,
                }}
                />
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default QuickTaxi;
