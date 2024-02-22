import React, { useState } from "react";
import Modal from "react-modal";
import { Button } from "@mui/material";
import CalendarSelector from "./Calender";
import PlaceSelector from "./Place";
import ThemeSelector from "./Theme";

interface ModalBarProps {
  onSubmit: (data: {
    startDate: Date | null;
    endDate: Date | null;
    selectedPlaces: string[];
    selectedThemes: string;
  }) => void;
}

const ModalBar: React.FC<ModalBarProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string>("");

  const handleClose = () => {
    setIsOpen(false);
    onSubmit({
      startDate,
      endDate,
      selectedPlaces,
      selectedThemes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="여행 계획 설정"
    >
      <h2>여행 계획 설정</h2>
      <p>여행 계획을 세우기 위해 다음 정보를 입력해주세요.</p>
      <div>
        <label htmlFor="date">날짜 선택:</label>
        <div>
          <CalendarSelector
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>
      <div>
        <label htmlFor="place">장소 검색:</label>
        <PlaceSelector
          selectedPlaces={selectedPlaces}
          setSelectedPlaces={setSelectedPlaces}
        />
      </div>
      <div>
        <ThemeSelector
          selectedThemes={selectedThemes}
          setSelectedThemes={setSelectedThemes}
        />
      </div>
      <Button variant="contained" onClick={handleClose}>
        완료
      </Button>
    </Modal>
  );
};

export default ModalBar;
