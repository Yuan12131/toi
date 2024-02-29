/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import ModalBar from "@/components/ModalBar";
import styles from "@/styles/planner.module.scss"

interface PlaceDetails {
  formatted_address: string;
  name: string;
  photos: { photo_reference: string }[];
}

interface PlanResultItem {
  date: string;
  time: string;
  place_name: string;
  formatted_address: string;
  name: string;
  photo: string;
}

const Planner = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [modalData, setModalData] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [detailResult, setDetailResult] = useState<any>(null);


  const handleModalSubmit = async (data: any) => {
    setModalData(data);
  };

  const handleAskQuestion = async () => {
    if (!modalData) {
      alert("날짜, 장소, 테마를 선택한 후 확인할 수 있습니다.");
      return;
    }

    const { startDate, endDate, selectedPlaces, selectedThemes } =
      modalData || [];

    const placesDescription = selectedPlaces
      .map(
        (place: { value: { description: any } }) => place?.value?.description
      )
      .join(", ");

    const question =
      "다음 날짜, 여행지, 테마를 기반으로 첫날 일정부터 마지막날 일정까지 여행 일정을 짜서 JSON 형식으로 응답해주세요. 일정은 동선을 고려해서 일자마다 시간으로 나누어 최상위 객체를 날짜별 yyyy-mm-dd로 나누고, 배열 속 객체들로 이루어진 time, place_name으로 나타내주세요. 또한, place_name의 값은 실제로 존재하는 구글 플레이스에서 검색 가능한 장소의 공식 영문명이며, 구글 리뷰가 많거나 인기 있는 장소 중심이어야 합니다.";

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

      const parsedResult = JSON.parse(result);
      const arrayResult = Object.entries(parsedResult);
      setResponse(arrayResult);

      console.log(arrayResult);

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

      const placeDetails = await Promise.all(
        placeNames.map(async (place_name) => {
          try {
            const response = await fetch(
              `/api/place-detail?placeName=${place_name}`,
              {
                method: "GET",
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch place details");
            }

            const data = await response.json();

            const resultData = data.map((item: any) => ({
              name: item.result.name,
              formatted_address: item.result.formatted_address,
              photo:
                item.result.photos && item.result.photos[0]?.photo_reference,
            }));

            return resultData;
          } catch (error) {
            console.error("Error fetching place details data:", error);
          }
        })
      );
      setDetailResult(placeDetails);
      console.log("Detail Result:", placeDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const apiKey = process.env.PLACE_API_KEY;

  return (
    <div className={styles.main}>
      {isOpen && (
        <ModalBar
          onSubmit={handleModalSubmit}
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      )}
      <button onClick={handleOpenModal}>여행 정보 입력하기</button>
      <button onClick={handleAskQuestion}>여행 코스 확인하기</button>
      {response &&
  response.map((dateData: any, index: any) => (
    <div key={index}>
      <h2>{dateData[0]}</h2>
      <ul>
        {dateData[1].map((schedule: any, scheduleIndex: number) => (
          <li key={scheduleIndex}>
            {schedule.time} - {schedule.place_name}
            {detailResult &&
              detailResult[scheduleIndex] &&
              detailResult[scheduleIndex].map((item: any, itemIndex: number) => (
                <div key={itemIndex}>
                  <p>{item.name}</p>
                  <p>{item.formatted_address}</p>
                  {item.photo && item.photo[0] && (
                    <img
                      src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${item.photo}&key=AIzaSyDpnJtXd385DDjiz4Ow0KFzAA05cUtd3nA`}
                      alt="place"
                    />
                  )}
                </div>
              ))}
          </li>
        ))}
      </ul>
    </div>
  ))}

    </div>
  );
};

export default Planner;
