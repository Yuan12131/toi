import React, { useState } from "react";
import Calendar from "react-calendar";
import "@/styles/calender.css";
import styles from '@/styles/calender.module.scss'

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
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const tileDisabled = ({ date, view }: any) => {
    const today = new Date();

    if (view === 'month' && date < today) {
      return true;
    }

    if (startDate && view === 'month') {
      // 7일 이상 차이나는 날짜는 선택 불가능
      const daysDiff = Math.abs((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 7) {
        return true;
      }

      // 종료날짜는 시작날짜보다 우선일 수 없음
      if (endDate && date <= endDate) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className={styles.calender}>
      <Calendar
        value={currentDate}
        onChange={handleSelect}
        showNavigation={true}
        tileDisabled={tileDisabled}
        />
        <div>
        <h2>여행 기간</h2>
        <p>*기간은 최대 7일까지 선택할 수 있습니다</p>
      {startDate && <p>여행 시작일 : {startDate.toLocaleDateString()}</p>}
      {endDate && <p>여행 종료일 : {endDate.toLocaleDateString()}</p>}
        </div>
    </div>
  );
};

export default CalendarSelector;
