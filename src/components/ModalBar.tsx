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
  isOpen: boolean;
  onClose: () => void;
}

const ModalBar: React.FC<ModalBarProps> = ({ onSubmit, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string>("");

  const handleComplete = () => {
    if (step === 3 && selectedThemes === "") {
      alert("테마를 선택해주세요.");
      return; // Don't proceed further if the theme is not selected
    }
    onClose();
    onSubmit({
      startDate,
      endDate,
      selectedPlaces,
      selectedThemes,
    });
  };

  // 각 단계에 따라 필요한 정보가 선택되었는지 확인하는 함수
  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        return startDate !== null && endDate !== null;
      case 2:
        return selectedPlaces.length > 0;
      case 3:
        return selectedThemes !== "";
      default:
        return true; // 다른 단계에서는 항상 true 반환
    }
  };

  const handleNextStep = () => {
    // 현재 단계에 필요한 정보가 선택되었는지 확인
    const isCurrentStepValid = validateCurrentStep();

    if (isCurrentStepValid) {
      setStep((prevStep) => prevStep + 1);
    } else {
      switch (step) {
        case 1:
          alert("날짜를 선택해주세요.");
          break;
        case 2:
          alert("장소를 선택해주세요.");
          break;
      }
    }
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

  const handleClose = () => {
    onClose();
  };

  Modal.setAppElement(document.body);

  return (
    <Modal isOpen={isOpen} contentLabel="여행 계획 설정">
      <h2>여행 계획 설정 - 단계 {step}</h2>
      <p>여행 계획을 세우기 위해 다음 정보를 입력해주세요.</p>
      <Button variant="contained" onClick={handleClose}>
        닫기
      </Button>
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
