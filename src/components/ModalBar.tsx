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
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string>("");

  const handleComplete = () => {
    setIsOpen(false);
    onSubmit({
      startDate,
      endDate,
      selectedPlaces,
      selectedThemes,
    });
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CalendarSelector
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        );
      case 2:
        return (
          <PlaceSelector
            selectedPlaces={selectedPlaces}
            setSelectedPlaces={setSelectedPlaces}
          />
        );
      case 3:
        return (
          <ThemeSelector
            selectedThemes={selectedThemes}
            setSelectedThemes={setSelectedThemes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={true} contentLabel="여행 계획 설정">
      <h2>여행 계획 설정 - 단계 {step}</h2>
      <p>여행 계획을 세우기 위해 다음 정보를 입력해주세요.</p>
      {renderStep()}
      <div>
        {step > 1 && (
          <Button variant="contained" onClick={handlePreviousStep}>
            이전
          </Button>
        )}
        {step < 3 ? (
          <Button variant="contained" onClick={handleNextStep}>
            다음
          </Button>
        ) : (
          <Button variant="contained" onClick={handleComplete}>
            완료
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ModalBar;
