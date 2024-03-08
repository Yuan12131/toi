"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import styles from "@/styles/myinfo.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Search from "@/components/SearchAddress";

interface UserInfo {
  userId: string;
  name: string;
  birthdate: string;
  phoneNumber: string;
  email: string;
  postcode: string;
  address: string;
  detailaddress: string;
  gender: string;
}

interface MyInfo {
  userId: string;
  name: string;
  birthdate: string;
  phoneNumber: string;
  email: string;
  postcode: string;
  address: string;
  detailaddress: string;
  gender: string;
}

export default function MyPageinfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSearch = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getaddress = (data: any) => {
    const address1 = data;
    return address1;
  };

  const handleSelectaddress = (data: any) => {
    const address = getaddress(data);

    setIsModalOpen(false);

    setUserInfo((prevInfo) =>
      prevInfo
        ? { ...prevInfo, address: address }
        : {
            userId: "",
            name: "",
            birthdate: "",
            phoneNumber: "",
            email: "",
            postcode: "",
            address: address,
            detailaddress: "",
            gender: "",
          }
    );
  };

  const handleSelectZonecode = (data: any) => {
    const postcodeData = getaddress(data);
    setUserInfo((prevInfo) =>
      prevInfo
        ? { ...prevInfo, postcode: postcodeData }
        : {
            userId: "",
            name: "",
            birthdate: "",
            phoneNumber: "",
            email: "",
            postcode: postcodeData,
            address: "",
            detailaddress: "",
            gender: "",
          }
    );
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      router.push("/login");
    } else {
      loadUserFromToken(storedToken);
    }
  }, [router]);

  const loadUserFromToken = (token: string) => {
    try {
      const decodedToken = jwt.decode(token) as JwtPayload;

      if (decodedToken) {
        const {
          userId,
          name,
          birthdate,
          phoneNumber,
          email,
          postcode,
          address,
          detailaddress,
          gender,
        } = decodedToken;

        const birthdateDate = new Date(birthdate);

        const birthdateLocalString = birthdateDate.toLocaleDateString();

        const userInformation: UserInfo = {
          userId,
          name,
          birthdate: birthdateLocalString,
          phoneNumber,
          email,
          postcode,
          address,
          detailaddress,
          gender,
        };

        setUserInfo(userInformation);
      } else {
        console.error("토큰이 유효하지 않습니다.");
        setUserInfo(null);
      }
    } catch (error) {
      console.error("토큰 해석 오류:", error);
      setUserInfo(null);
    }
  };

  const handleEditModeToggle = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleSaveChanges = async () => {
    if (!userInfo) {
      console.error("사용자 정보가 없습니다.");
      return;
    }

    const currentToken = token || "";
    try {
      const response = await fetch("/api/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          name: userInfo.name,
          birthdate: userInfo.birthdate,
          phoneNumber: userInfo.phoneNumber,
          email: userInfo.email,
          postcode: userInfo.postcode,
          address: userInfo.address,
          detailaddress: userInfo.detailaddress,
          gender: userInfo.gender,
        }),
      });

      if (response.ok) {
        setIsEditMode(false);
        alert("정보가 수정되었습니다.");
        fetchMyInfo();
      } else {
        console.error("사용자 정보 업데이트 실패:", response.statusText);
      }
    } catch (error) {
      console.error("서버 에러:", error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setToken(null);
        router.push("/login");
      } else {
        console.error("회원 탈퇴 실패:", response.statusText);
      }
    } catch (error) {
      console.error("서버 에러:", error);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setUserInfo((prevInfo) => {
      if (prevInfo === null) {
        // 초기 상태 설정
        return {
          userId: "",
          name: "",
          birthdate: "",
          phoneNumber: "",
          email: "",
          postcode: "",
          address: "",
          detailaddress: "",
          gender: "",
          [name]: value, // 현재 속성 업데이트
        };
      }
      // 이미 userInfo가 존재하는 경우 해당 속성 업데이트
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  };

  const handlePostcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleInputChange("postcode", value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleInputChange("address", value);
  };

  const fetchMyInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch("/api/my-info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { myInfo } = await response.json();

        setMyInfo(myInfo);
      } else {
        console.error("Failed to fetch user info:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchMyInfo();
  }, []);

  return (
    <div className={styles.myinfo}>
      {userInfo && (
        <div>
          {isEditMode ? (
            <div className={styles.myinfomodify}>
              <table className={styles.userinfo}>
                <tbody>
                  <tr>
                    <td className={styles.item}>아이디</td>
                    <td className={styles.info}>{userInfo.userId}</td>
                  </tr>
                  <tr>
                    <td className={styles.item}>이름</td>
                    <td className={styles.info}>
                      <label>
                        <input
                          type="text"
                          value={userInfo.name}
                          style={{
                            padding: "4px",
                            fontSize: "12px",
                            width: "30%",
                            boxSizing: "border-box",
                            border: "1px solid grey",
                            borderRadius: "4px",
                          }}
                          onChange={(e) =>
                            setUserInfo((prevInfo) =>
                              prevInfo
                                ? { ...prevInfo, name: e.target.value }
                                : {
                                    userId: "",
                                    name: e.target.value,
                                    birthdate: "",
                                    phoneNumber: "",
                                    email: "",
                                    postcode: "",
                                    address: "",
                                    detailaddress: "",
                                    gender: "",
                                  }
                            )
                          }
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.item}>생년월일</td>
                    <td className={styles.info}>
                      <DatePicker
                        selected={new Date(userInfo.birthdate)}
                        onChange={(date) => {
                          if (date !== null) {
                            setUserInfo((prevInfo) =>
                              prevInfo
                                ? { ...prevInfo, birthdate: date.toISOString() }
                                : {
                                    userId: "",
                                    name: "",
                                    birthdate: date.toISOString(),
                                    phoneNumber: "",
                                    email: "",
                                    postcode: "",
                                    address: "",
                                    detailaddress: "",
                                    gender: "",
                                  }
                            );
                          }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.item}>전화번호</td>
                    <td className={styles.info}>
                      <label>
                        <input
                          type="text"
                          value={userInfo.phoneNumber}
                          style={{
                            padding: "4px",
                            fontSize: "12px",
                            width: "30%",
                            boxSizing: "border-box",
                            border: "1px solid grey",
                            borderRadius: "4px",
                          }}
                          onChange={(e) =>
                            setUserInfo((prevInfo) =>
                              prevInfo
                                ? { ...prevInfo, phoneNumber: e.target.value }
                                : {
                                    userId: "",
                                    name: "",
                                    birthdate: "",
                                    phoneNumber: e.target.value,
                                    email: "",
                                    postcode: "",
                                    address: "",
                                    detailaddress: "",
                                    gender: "",
                                  }
                            )
                          }
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.item}>이메일</td>
                    <td className={styles.info}>
                      <label>
                        <input
                          type="text"
                          value={userInfo.email}
                          style={{
                            padding: "4px",
                            fontSize: "12px",
                            width: "30%",
                            boxSizing: "border-box",
                            border: "1px solid grey",
                            borderRadius: "4px",
                          }}
                          onChange={(e) =>
                            setUserInfo((prevInfo) =>
                              prevInfo
                                ? { ...prevInfo, email: e.target.value }
                                : {
                                    userId: "",
                                    name: "",
                                    birthdate: "",
                                    phoneNumber: "",
                                    email: e.target.value,
                                    postcode: "",
                                    address: "",
                                    detailaddress: "",
                                    gender: "",
                                  }
                            )
                          }
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.item}>우편번호</td>
                    <td className={styles.info}>
                      <label>
                        <input
                          type="text"
                          value={userInfo.postcode}
                          style={{
                            padding: "4px",
                            fontSize: "12px",
                            width: "15%",
                            boxSizing: "border-box",
                            border: "1px solid grey",
                            borderRadius: "4px",
                            marginRight: "1vw",
                          }}
                          onChange={(e) =>
                            setUserInfo((prevInfo) =>
                              prevInfo
                                ? { ...prevInfo, postcode: e.target.value }
                                : {
                                    userId: "",
                                    name: "",
                                    birthdate: "",
                                    phoneNumber: "",
                                    email: "",
                                    postcode: e.target.value,
                                    address: "",
                                    detailaddress: "",
                                    gender: "",
                                  }
                            )
                          }
                          readOnly
                        />
                      </label>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                          fontSize: "10px",
                          width: "9%",
                          cursor: "pointer",
                        }}
                      >
                        주소 검색
                      </button>
                      <Search
                        open={isModalOpen}
                        onClose={handleCloseModal}
                        onSelectAddress={handleSelectaddress}
                        onSelectZonecode={handleSelectZonecode}
                      >
                        모달 내용
                      </Search>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.item}>주소</td>
                    <td className={styles.info}>
                      <label>
                        <input
                          type="text"
                          value={userInfo.address}
                          style={{
                            padding: "4px",
                            fontSize: "12px",
                            width: "50%",
                            boxSizing: "border-box",
                            border: "1px solid grey",
                            borderRadius: "4px",
                          }}
                          onChange={(e) =>
                            setUserInfo((prevInfo) =>
                              prevInfo
                                ? { ...prevInfo, address: e.target.value }
                                : {
                                    userId: "",
                                    name: "",
                                    birthdate: "",
                                    phoneNumber: "",
                                    email: "",
                                    postcode: "",
                                    address: e.target.value,
                                    detailaddress: "",
                                    gender: "",
                                  }
                            )
                          }
                          readOnly
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.item}>상세주소</td>
                    <td className={styles.info}>
                      <label>
                        <input
                          type="text"
                          value={userInfo.detailaddress}
                          style={{
                            padding: "4px",
                            fontSize: "12px",
                            width: "40%",
                            boxSizing: "border-box",
                            border: "1px solid grey",
                            borderRadius: "4px",
                          }}
                          onChange={(e) =>
                            setUserInfo((prevInfo) =>
                              prevInfo
                                ? { ...prevInfo, detailaddress: e.target.value }
                                : {
                                    userId: "",
                                    name: "",
                                    birthdate: "",
                                    phoneNumber: "",
                                    email: "",
                                    postcode: "",
                                    address: "",
                                    detailaddress: e.target.value,
                                    gender: "",
                                  }
                            )
                          }
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.item}>성별</td>
                    <td className={styles.info}>
                      <select
                        name="gender"
                        value={userInfo.gender}
                        onChange={(e) =>
                          setUserInfo((prevInfo) =>
                            prevInfo
                              ? { ...prevInfo, gender: e.target.value }
                              : {
                                  userId: "",
                                  name: "",
                                  birthdate: "",
                                  phoneNumber: "",
                                  email: "",
                                  postcode: "",
                                  address: "",
                                  detailaddress: "",
                                  gender: e.target.value,
                                }
                          )
                        }
                      >
                        <option value="">선택하세요</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button className={styles.btn} onClick={handleSaveChanges}>
                저장
              </button>
            </div>
          ) : (
            <div>
              <table className={styles.userinfo}>
                <tr>
                  <td className={styles.item}>아이디</td>
                  <td className={styles.info}>
                    {myInfo && myInfo.userId ? myInfo.userId : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.item}>이름</td>
                  <td className={styles.info}>
                    {myInfo && myInfo.name ? myInfo.name : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.item}>생년월일</td>
                  <td className={styles.info}>
                    {" "}
                    {myInfo
                      ? myInfo.birthdate &&
                        new Date(myInfo.birthdate).toLocaleDateString("ko-KR")
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.item}>전화번호</td>
                  <td className={styles.info}>
                    {myInfo && myInfo.phoneNumber ? myInfo.phoneNumber : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.item}>이메일</td>
                  <td className={styles.info}>
                    {myInfo && myInfo.email ? myInfo.email : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.item}>우편번호</td>
                  <td className={styles.info}>
                    {myInfo && myInfo.postcode ? myInfo.postcode : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.item}>주소</td>
                  <td className={styles.info}>
                    {myInfo && myInfo.address ? myInfo.address : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.item}>상세주소</td>
                  <td className={styles.info}>
                    {myInfo && myInfo.detailaddress
                      ? myInfo.detailaddress
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className={styles.item}>성별</td>
                  <td className={styles.info}>
                    {myInfo && myInfo.gender ? myInfo.gender : "N/A"}
                  </td>
                </tr>
              </table>

              <button className={styles.btn} onClick={handleEditModeToggle}>
                수정
              </button>
              <button className={styles.btn} onClick={handleWithdrawal}>
                회원 탈퇴
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
