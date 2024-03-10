"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/myplan.module.scss";
import { Select } from "@nextui-org/select";


interface DataItem {
  courseIndex: string;
  day: number;
  date: string;
  time: string;
  place_name: string;
  formatted_address: string | null;
  photo: string | null;
  timestamp: string;
  status: string;
}

const apiKey = process.env.NEXT_PUBLIC_PLACE_API_KEY;

export default function MyPagesub() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [planData, setPlanData] = useState<any>(null);
  const [data, setData] = useState<DataItem | null>(null);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      router.push("/login");
    } else {
      fetchPlanData(storedToken);
    }
  }, [router]);

  const fetchPlanData = async (token: string) => {
    try {
      const response = await fetch("/api/myplan", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const plan = await response.json();
        const data = Object.values(plan).flat();

        const transformedData = {};

        data.forEach((event: any) => {
          const courseIndex = event.courseIndex;

          if (!transformedData[courseIndex]) {
            transformedData[courseIndex] = [];
          }

          const transformedEvent = {
            courseIndex: event.courseIndex,
            day: event.day,
            date: event.date,
            time: event.time,
            place_name: event.place_name,
            formatted_address: event.formatted_address || null,
            photo: event.photo || null,
            timestamp: event.timestamp,
          };

          transformedData[courseIndex].push(transformedEvent);
        });

        const result = Object.values(transformedData) as any[];
        setCourseOptions(
          result.map((course: any, index: number) => index.toString())
        );
        setPlanData(result);
        console.log(result);
      } else {
        console.error("Error fetching plan data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching plan data:", error);
    }
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return `${formattedDate.getFullYear()}년 ${formattedDate.getMonth() + 1}월 ${formattedDate.getDate()}일`;
  };
  
  const formatTime = (time: string) => {
    const formattedTime = new Date(`2000-01-01T${time}`);
    return `${formattedTime.getHours()}시`;
  };

  return (
    <div className={styles.main}>
      <div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={{ width: "200px", marginBottom: "20px" }}
        >
          <option value="">저장된 여행코스 리스트</option>
          {courseOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        {selectedCourse !== "" && (
          <>
            <div>
              {planData[parseInt(selectedCourse)]
                .reduce((acc: any, event: DataItem, index: number) => {
                  const lastGroup = acc[acc.length - 1];

                  if (!lastGroup || lastGroup[0].day !== event.day) {
                    acc.push([event]); // Create a new group
                  } else {
                    lastGroup.push(event); // Add to the current group
                  }
                  return acc;
                }, [])
                .map((group: DataItem[], groupIndex: number) => (
                  <div key={groupIndex} className={styles.plan}>
                    <h3>DAY {groupIndex + 1}</h3>
                    {group.map((event: DataItem, eventIndex: number) => (
                      <div key={eventIndex}>
                        {eventIndex === 0 && <p>날짜 : {formatDate(event.date)}</p>}
                        <p>시간 : {formatTime(event.time)}</p>
                        <p>장소 : {event.place_name}</p>
                        {event.formatted_address && (
                          <p>주소: {event.formatted_address}</p>
                        )}
                        {event.photo && (
                          <img
                            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${event.photo}&key=${apiKey}`}
                            alt="Place photo"
                            style={{ borderRadius: "10px"}}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
