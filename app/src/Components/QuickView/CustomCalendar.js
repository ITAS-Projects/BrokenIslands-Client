import React, { useState, useCallback, useRef, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";
import format from "date-fns/format";
import parse from "date-fns/parse";
import getDay from "date-fns/getDay";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, differenceInCalendarWeeks } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "../../assets/CustomCalender.css";

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

const CustomCalendar = ({ events, monthHeight, onDateClick, onEventClick, dateDisplay = null, currentDate = new Date(), displayPopup = false, forceDisplay = false }) => {
  const [mainMonthDate, setMainMonthDateHidden] = useState(currentDate);
  const setMainMonthDate = (date, fromScroll = false) => {
    setMainMonthDateHidden(date);
    if (dateDisplay != null) {
      dateDisplay(date, fromScroll);
    }
  };
  const containerRef = useRef(null);

  const months = [subMonths(mainMonthDate, 1), mainMonthDate, addMonths(mainMonthDate, 1)];

  const boundMonthHeight = Math.min(window.innerHeight * 0.5, monthHeight);

  const onScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;

    if (scrollTop < 0.5 * boundMonthHeight + redundantScroll) {
      setMainMonthDate(months[0], true);
      setTimeout(() => {
        containerRef.current.scrollTop = scrollTop + boundMonthHeight;
      });
    } else if (scrollTop > 1.5 * boundMonthHeight + redundantScroll) {
      setMainMonthDate(months[2], true);
      setTimeout(() => {
        containerRef.current.scrollTop = scrollTop - boundMonthHeight;
      });
    }
  }, [mainMonthDate, months]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = boundMonthHeight + redundantScroll + boundMonthHeight * getWeekFractionInMonth(currentDate);
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

  const getWeekFractionInMonth = (date) => {
    const startOfMonthDate = startOfMonth(date);
    const endOfMonthDate = endOfMonth(date);

    const monthStartWeek = startOfWeek(startOfMonthDate, { weekStartsOn: 0 });
    const monthEndWeek = endOfWeek(endOfMonthDate, { weekStartsOn: 0 });

    const currentWeekStart = startOfWeek(date, { weekStartsOn: 0 });

    let currentWeek = differenceInCalendarWeeks(currentWeekStart, monthStartWeek, { weekStartsOn: 0 });
    let totalWeeks = differenceInCalendarWeeks(monthEndWeek, monthStartWeek, { weekStartsOn: 0 }) + 1;

    currentWeek = currentWeek - 0.1;
    if (getDay(endOfMonthDate) !== 6) {
      totalWeeks = Math.max(1, totalWeeks - 1);
    }

    return currentWeek / totalWeeks;
  };

  return (
    <>
      <div className="DateNavigation">
        <button
          onClick={() => {
            setMainMonthDate(months[0]);
            containerRef.current.scrollTop = boundMonthHeight + redundantScroll;
          }}>
          Previous Month
        </button>

        <button
          onClick={() => {
            setMainMonthDate(new Date());
            containerRef.current.scrollTop = boundMonthHeight + redundantScroll + boundMonthHeight * getWeekFractionInMonth(new Date());
          }}>
          Today
        </button>

        <button
          onClick={() => {
            setMainMonthDate(months[2]);
            containerRef.current.scrollTop = boundMonthHeight + redundantScroll;
          }}>
          Next Month
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
        <div className="monthContainer" style={{ height: `${3 * boundMonthHeight}px`, margin: `${redundantScroll}px 0px` }}>
          {months.map((month, idx) => (
            <div key={idx} className="calendar-container" style={{ height: `${boundMonthHeight}px` }}>
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
                selectable={true}
                onSelectSlot={onDateClick}
                onSelectEvent={onEventClick}
                onDrillDown={onDateClick}
                popup={displayPopup}
                showAllEvents={forceDisplay}
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
