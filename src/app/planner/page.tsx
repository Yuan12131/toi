"use client"
import React, { useState, useEffect } from 'react';
import ModalBar from '@/components/ModalBar';

const Planner = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [isOpen, setIsOpen] = useState(true); // 모달창 열림 여부

  useEffect(() => {
    // 모달창 열기 (예: 페이지 로딩 시)
    setIsOpen(true);
  }, []);

  const handleSendDataToAPI = (data: any) => {
    // API 요청 및 응답 처리
    // 예: fetch를 사용하여 API에 요청하고 응답을 setApiResponse 상태에 저장
    fetch('/api/gpt3', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((response) => response.json()).then((data) => setApiResponse(data));
  };

  return (
    <>
      <ModalBar onSendData={handleSendDataToAPI} />
      {apiResponse && <div>API 응답: {apiResponse}</div>}
    </>
  );
};

export default Planner;
