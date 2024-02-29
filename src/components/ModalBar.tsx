import React, { useState } from "react";
import Modal from "react-modal";
// import { Button } from "@mui/material";
import CalendarSelector from "./Calender";
import PlaceSelector from "./Place";
import ThemeSelector from "./Theme";
import styles from "@/styles/modalbar.module.scss"

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

  return (
    <Modal isOpen={isOpen} contentLabel="여행 계획 설정" style={{
      overlay: {
        zIndex:'1001',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
      },
      content: {
        display:'flex',
      marginTop:'5vh',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        width:'70vw',
        height:'80vh',
        position:'relative'
      }
    }}>
      <button className={styles.close} onClick={handleClose}>
        X
      </button>
      <p className={styles.step}>STEP. {step}</p>
      <p className={styles.title}>여행 계획을 위해 다음 정보를 입력해주세요</p>
      {renderStep()}
      <div>
        {step > 1 && (
          <button className={styles.prev} onClick={handlePreviousStep}>
            이전
          </button>
        )}
        {step < 3 ? (
          <button className={styles.next} onClick={handleNextStep}>
            다음
          </button>
        ) : (
          <button className={styles.submit} onClick={handleComplete}>
            완료
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ModalBar;
