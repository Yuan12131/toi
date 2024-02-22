import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface CalenderSelectorProps {
  startDate: Date | null;
  setStartDate: (startDate: Date) => void;
  endDate: Date | null;
  setEndDate: (endDate: Date) => void;
}

const CalendarSelector: React.FC<CalenderSelectorProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  
  const handleSelect = (date: any) => {
    if (!startDate) {
      setStartDate(date);
    } else if (date < startDate) {
      setEndDate(startDate);
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  return (
    <div>
      <Calendar
        value={startDate || endDate}
        onChange={handleSelect}
        showNavigation={true}
      />
      {startDate && <p>시작일: {startDate.toLocaleDateString()}</p>}
      {endDate && <p>종료일: {endDate.toLocaleDateString()}</p>}
    </div>
  );
};

export default CalendarSelector;
