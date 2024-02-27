"use client";
import React, { useState, useEffect } from "react";
import ModalBar from "@/components/ModalBar";
import dotenv from 'dotenv';

dotenv.config();

interface Place {
  place_id: string;
  place: string;
  time: string;
}
interface Day {
  time: string;
  place_id: string;
  // ... 다른 필요한 속성들
}

interface Event {
  time: string;
  place_id: string;
}

const Planner = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [modalData, setModalData] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  const handleModalSubmit = async (data: any) => {
    // 받아온 데이터를 상태에 저장
    setModalData(data);
  };

  const handleAskQuestion = async () => {
    // modalData 값 확인
    if (!modalData) {
      alert("날짜, 장소, 테마를 선택한 후 확인할 수 있습니다.");
      return;
    }

    const { startDate, endDate, selectedPlaces, selectedThemes } =
      modalData || [];

    // 여러 여행지 정보 추출
    const placesDescription = selectedPlaces
      .map(
        (place: { value: { description: any } }) => place?.value?.description
      )
      .join(", ");

    const question =
      "다음 날짜, 장소, 테마를 기반으로 첫날부터 마지막날까지 일정을 JSON 형식으로 여행코스를 생성해서 객체만 응답해주세요. 일정은 동선을 고려해서 일자마다 시간으로 나누어 최상위 객체를 날짜별 yyyy-mm-dd로 나누고, 배열 속 객체들로 이루어진 time, google place api에 등록된 place_id, place_name으로 나타내주세요. 또한, place_id의 값은 실제로 존재하는 구글 플레이스에서 검색 가능한 장소 이름이며, 구글 리뷰가 많거나 인기 있는 장소 중심이어야 합니다.";

    const combinedQuestion = `${question} 
    시작일: ${startDate}, 종료일: ${endDate}, 
    여행지: ${placesDescription}, 
    테마: ${selectedThemes}`;

    try {
      const formData = new FormData();
      formData.append("question", combinedQuestion);
      const apiResponse = await fetch("/api/ai", {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error("Server responded with:", errorData);
        throw new Error("Server error");
      }
      const { result } = await apiResponse.json();
      setResponse(result);

      // result 문자열을 JSON으로 파싱
      const parsedResult = JSON.parse(result);
      // place_ids를 담을 배열
      const placeNames: string[] = [];

      for (const dateKey in parsedResult) {
        const dateObj = parsedResult[dateKey];
        if (Array.isArray(dateObj)) {
          for (const event of dateObj) {
            if (event && event.place_name) {
              placeNames.push(event.place_name);
            }
          }
        }
      }

      console.log(placeNames);

      const placeDetails = await Promise.allSettled(
        placeNames.map(async (place_name) => {
          try {
            const response = await fetch(`/api/place-detail?placeName=${place_name}`, {
              method: 'GET',
            });
      
            if (!response.ok) {
              throw new Error('Failed to fetch place details');
            }
      
            const data = await response.json();
            return data;
          } catch (error) {
            console.error(error);
            return { error }; // 에러 객체 반환
          }
        })
      );
      
      console.log(placeDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true); // 모달창 열기
  };

  const handleCloseModal = () => {
    setIsOpen(false); // 모달창 닫기
  };

  return (
    <>
      {isOpen && (
        <ModalBar
          onSubmit={handleModalSubmit}
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      )}
      <button onClick={handleOpenModal}>여행 정보 입력하기</button>
      <button onClick={handleAskQuestion}>여행 코스 확인하기</button>
      <div className="ml-10">
        <h2>답변:</h2>
        <p className="h-96 w-80 border">{response}</p>
      </div>
    </>
  );
};

export default Planner;
