"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/topbar.module.scss";
import Link from "next/link";
import jwt, { JwtPayload } from 'jsonwebtoken';

function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState<string | JwtPayload>('');

  useEffect(() => {
    const loadUserFromToken = () => {
      const token = localStorage.getItem('token');

      if (token) {
        const decodedToken = jwt.decode(token) as JwtPayload;

        if (decodedToken) {
          const userName = decodedToken.name;
          setIsLoggedIn(true);
          setName(userName);
        }
      } else {
        setIsLoggedIn(false);
        setName('');
      }
    };

    loadUserFromToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setName('');
    window.location.href = '/';
  };

  return (
    <div className={styles.topbar}>
      <div>
        <Link href="/">
        TOUI
        </Link>
      </div>
      <div>
      {isLoggedIn ? (
          <>
            <p>{`${name} 님`}</p>
            <Link href="/mypage/myinfo">MYPAGE</Link>
            <button onClick={handleLogout}>LOGOUT</button>
          </>
        ) : (
          <>
            <Link href="/signup">SIGN UP</Link>
            <Link href="/login">LOGIN</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Topbar;
