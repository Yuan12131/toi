"use client";
import styles from "@/styles/login.module.scss";
import React, { useState } from "react";
import UsernameModal from "@/components/FindId";
import UserPasswordModal from "@/components/FindPw";
import Link from "next/link";

const Login: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, name } = data;
        localStorage.setItem("token", token);
        console.log("로그인 성공");
        window.location.href = "/";
      } else if (response.status === 401) {
        alert("탈퇴한 사용자입니다.");
      } else {
        alert("아이디나 비밀번호를 확인하고 다시 시도해주세요.");
        console.error("로그인 실패:", data.error);
      }
    } catch (error) {
      console.error("서버 에러:", error);
    }
  };

  const handleOpenUsernameModal = () => {
    setShowUsernameModal(true);
  };

  const handleCloseUsernameModal = () => {
    setShowUsernameModal(false);
  };

  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  return (
    <div className={styles.main}>
      <div>
        <h2>LOGIN</h2>
        <form>
          <label>
            <input
              type="text"
              value={userId}
              placeholder="아이디를 입력하세요"
              onChange={(e) => setUserId(e.target.value)}
            />
          </label>
          <label>
            <input
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div>
            <button type="button" onClick={handleLogin}>
              로그인
            </button>

            <button type="button">
              <Link href={`/signup`}>회원가입</Link>
            </button>
          </div>
        </form>
        <div>
          <button type="button" onClick={handleOpenUsernameModal}>
            아이디 찾기
          </button>
          <button type="button" onClick={handleOpenPasswordModal}>
            비밀번호 찾기
          </button>
        </div>
        {showUsernameModal && (
          <div className="modal">
            <div className="modal-content">
              <UsernameModal onClose={handleCloseUsernameModal} />
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="modal">
            <div className="modal-content">
              <UserPasswordModal onClose={handleClosePasswordModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
