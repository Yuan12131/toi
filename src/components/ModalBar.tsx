import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Button } from '@mui/material';

const ModalBar = () => {
  const [isOpen, setIsOpen] = useState(true); // 모달창 열림 여부
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소
  const [selectedThemes, setSelectedThemes] = useState([]); // 선택된 테마

  const handleClose = () => {
    // 모달창 닫기
    setIsOpen(false);
  };

  const handleSendDataToAPI = () => {
    // API 요청 및 응답 처리
    // 예: fetch를 사용하여 API에 요청하고 응답을 콘솔에 출력
    fetch('/api/gpt3', {
      method: 'POST',
      body: JSON.stringify({
        date: selectedDate,
        place: selectedPlace,
        themes: selectedThemes,
      }),
    }).then((response) => response.json()).then((data) => console.log(data));
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
        <DatePicker
          id="date"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </div>
      <div>
        <label htmlFor="place">장소 검색:</label>
        <GooglePlacesAutocomplete
          id="place"
          apiKey="YOUR_API_KEY"
          selectProps={{
            value: selectedPlace,
            onChange: setSelectedPlace,
          }}
        />
      </div>
      <div>
        <label htmlFor="themes">테마 선택:</label>
        <input type="checkbox" name="theme" value="healing" id="healing" />
        <label htmlFor="healing">힐링</label>
        <input type="checkbox" name="theme" value="nature" id="nature" />
        <label htmlFor="nature">자연</label>
        <input type="checkbox" name="theme" value="city" id="city" />
        <label htmlFor="city">도시</label>
      </div>
      <Button variant="contained" onClick={handleSendDataToAPI}>
        완료
      </Button>
    </Modal>
  );
};

export default ModalBar;
