/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, Suspense, useEffect } from "react";
import ModalBar from "@/components/ModalBar";
import styles from "@/styles/planner.module.scss";
import Loading from "@/components/Loading";

interface ScheduleItem {
  time: string;
  place_name: string;
  id?: number;
}

const apiKey = process.env.NEXT_PUBLIC_PLACE_API_KEY;

const Planner = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [modalData, setModalData] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [detailResult, setDetailResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const handleModalSubmit = async (data: any) => {
    setModalData(data);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleAskQuestion = async () => {
    setLoading(true);
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
      "다음 날짜, 여행지, 테마를 기반으로 첫 날부터 마지막 날까지 여행 일정을 짜서 코드 블록을 제거하고, 실제 JSON 데이터만 응답, 일정은 동선을 고려해서 일자마다 시간으로 나누어 최상위 객체를 날짜인 yyyy-mm-dd로 나눌 것, 배열 속 객체들은 time, place_name으로 나타낼 것, place_name의 값은 구글에서 검색 가능한 실제로 존재하는 장소의 공식 명칭이며, 인기 있는 장소 중심일 것, 첫날부터 마지막날 일정까지 어떤 장소든 중복되어서는 안됩니다.";

    const combinedQuestion = `${question} 
    여행 시작일: ${startDate}, 여행 종료일: ${endDate}, 
    여행 갈 도시 혹은 국가: ${placesDescription}, 
    여행의 테마: ${selectedThemes}`;

    try {
      setLoading(true);

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
      const arrayResult: [string, ScheduleItem[]][] =
        Object.entries(parsedResult);

      let currentId = 1;
      arrayResult.forEach(([date, items]) => {
        items.forEach((item) => {
          item.id = currentId++;
        });
      });

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
      let detailId = 1;

      const placeDetails = await Promise.all(
        placeNames.map(async (place_name, index) => {
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

            const firstDetail = data[0];

            const resultData = {
              name: firstDetail?.result.name,
              formatted_address: firstDetail?.result.formatted_address,
              photo:
                firstDetail?.result.photos &&
                firstDetail.result.photos[0]?.photo_reference,
              id: detailId + index,
            };
            return resultData;
          } catch (error) {
            console.error("Error fetching place details data:", error);
          }
        })
      );

      setDetailResult(placeDetails);
      console.log(placeDetails);

      setLoading(false);
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

  const handleSave = async () => {
    try {
      if (!token) {
        alert("로그인 후 이용해주세요");
        return;
      }

      if (!response || !detailResult) {
        alert("먼저 여행 코스를 확인해주세요");
        return;
      }

      const travelPlans = response
        .map((dateData: any, index: any) => {
          const day = index + 1;
          const date = dateData[0];

          return dateData[1].map((schedule: any) => {
            const matchingDetail = detailResult.find(
              (detail: any) => detail.id === schedule.id
            );

            return {
              day,
              date,
              time: schedule.time,
              place_name: schedule.place_name,
              formatted_address: matchingDetail.formatted_address,
              photo: matchingDetail.photo,
            };
          });
        })
        .flat();

      const saveResponse = await fetch("/api/save-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(travelPlans),
      });

      if (saveResponse.ok) {
        console.log("여행 일정 저장 성공!");
      } else {
        console.error("여행 일정 저장 실패:", saveResponse.statusText);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <div className={styles.main}>
      {isOpen && (
        <ModalBar
          onSubmit={handleModalSubmit}
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      )}
      <div>
        <button onClick={handleOpenModal}>여행 정보 입력하기</button>
        <button onClick={handleAskQuestion}>여행 코스 확인하기</button>
        <button onClick={handleSave}>여행 코스 저장하기</button>
      </div>
      <Suspense fallback={<Loading />}>
        {loading ? (
          <Loading />
        ) : (
          response &&
          detailResult && (
            <div>
              {response &&
                response.map((dateData: any, index: any) => (
                  <div key={index}>
                    <h2>DAY{index + 1}</h2>
                    <h3>{dateData[0]}</h3>
                    <ul>
                      {dateData[1].map(
                        (schedule: any, scheduleIndex: number) => {
                          const matchingDetail =
                            detailResult &&
                            detailResult.find(
                              (detail: any) => detail.id === schedule.id
                            );

                          return (
                            <li key={scheduleIndex}>
                              <div>{schedule.time}</div>
                              <div>
                                {matchingDetail && (
                                  <>
                                    <p>장소 : {schedule.place_name}</p>
                                    <p>
                                      주소 : {matchingDetail.formatted_address}
                                    </p>
                                    {matchingDetail.photo && (
                                      <img
                                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${matchingDetail.photo}&key=${apiKey}`}
                                        alt="place"
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                ))}
            </div>
          )
        )}
      </Suspense>
    </div>
  );
};

export default Planner;
