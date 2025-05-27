import React, { useState, useCallback, useRef, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

import '../../assets/CustomCalender.css'

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

const CustomCalendar = ({ events, monthHeight, onEventClick, dateDisplay = null, currentDate = new Date() }) => {
    const [mainMonthDate, setMainMonthDateHidden] = useState(currentDate);
  const setMainMonthDate = (date) => {
    setMainMonthDateHidden(date);
    if (dateDisplay != null) {
        dateDisplay(date);
    }
  }
  const containerRef = useRef(null);

  const months = [subMonths(mainMonthDate, 1), mainMonthDate, addMonths(mainMonthDate, 1)];

  const boundMonthHeight = Math.min(window.innerHeight * 0.5, monthHeight);
  console.log(window.innerHeight);

  const onScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;

    if (scrollTop < 0.5 * boundMonthHeight + redundantScroll) {
      setMainMonthDate(months[0]);
      setTimeout(() => {
        containerRef.current.scrollTop = scrollTop + boundMonthHeight;
      });
    } else if (scrollTop > 1.5 * boundMonthHeight + redundantScroll) {
      setMainMonthDate(months[2]);
      setTimeout(() => {
        containerRef.current.scrollTop = scrollTop - boundMonthHeight;
      });
    }
  }, [mainMonthDate, months]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = boundMonthHeight + redundantScroll;
    }
  }, []);

  const mergeClassNames = (existing = "", added = "") => {
    const set = new Set([...existing.split(" "), ...added.split(" ")]);
    return Array.from(set).filter(Boolean).join(" ");
  };

  const DateCellWrapper = ({ children, monthIndex }) => {
    const existingClassName = children.props.className || "";
    let newClassName = existingClassName;

    if (existingClassName.includes("rbc-off-range-bg")) {
      if (monthIndex !== 1) {
        newClassName = existingClassName.replace("rbc-off-range-bg", "");
      }
      newClassName = mergeClassNames(newClassName, "remove-row");
      return React.cloneElement(children, { className: newClassName });
    }

    if (monthIndex !== 1) {
      newClassName = mergeClassNames(newClassName, "rbc-off-range-bg");
      return React.cloneElement(children, { className: newClassName });
    }

    return children;
  };

  return (
    <>
      <div className="DateNavigation">
        <button
          onClick={() => {
            setMainMonthDate(new Date());
            containerRef.current.scrollTop = boundMonthHeight + redundantScroll;
          }}>
          Today
        </button>

        <button
          onClick={() => {
            setMainMonthDate(new Date());
            containerRef.current.scrollTop = boundMonthHeight + redundantScroll;
          }}>
          Today
        </button>

        <button
          onClick={() => {
            setMainMonthDate(new Date());
            containerRef.current.scrollTop = boundMonthHeight + redundantScroll;
          }}>
          Today
        </button>
      </div>

      <div className="weekday-header">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
          <div key={idx} className="weekday-cell">
            {day}
          </div>
        ))}
      </div>

      <div ref={containerRef} className="calendar-scroll-container" onScroll={onScroll} style={{ height: `${boundMonthHeight}px`, overflowY: "auto" }}>
        <div className="monthContainer" style={{height: `${3*boundMonthHeight}px`, margin: `${redundantScroll}px 0px` }}>
          {months.map((month, idx) => (
            <div className='calendar-container' style={{ height: `${boundMonthHeight}px` }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: boundMonthHeight }}
                views={["month"]}
                view="month"
                toolbar={false}
                date={month}
                onSelectEvent={onEventClick}
                components={{
                  header: () => null,
                  dateCellWrapper: (props) => <DateCellWrapper {...props} monthIndex={idx} />,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomCalendar;
