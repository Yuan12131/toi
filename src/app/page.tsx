/* eslint-disable @next/next/no-img-element */
"use client"

import styles from "@/styles/home.module.scss";
import Link from "next/link";
import Slick from "react-slick";
import React, { useState } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [images] = useState([
    { src: "image2.jpg", alt: "Image 1", theme:"자연 테마", detail:"숲, 산, 해변, 강 등 자연 경관을 탐험하는 여행" },
    { src: "image3.jpg", alt: "Image 2", theme:"도시 탐험 테마", detail:"도심 중심의 거리, 지역 시장, 쇼핑몰 등 도시의 다양한 즐길 거리가 중심" },
    { src: "image1.jpg", alt: "Image 3", theme:"역사와 문화 테마", detail:"성, 궁전, 사원, 박물관 등 역사적인 명소를 방문하며 지역 문화 체험" },
  ]);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: false,
  };

  return (
    <div className={styles.main}>
      <div>
        <div>
          <div>
            너 P야? <br></br>AI가 짜주는 여행 코스
          </div>
          <Link href={"/planner"}>
            <button>지금 바로 시작</button>
          </Link>
        </div>
      </div>
      <div>
      <Slick {...settings}>
        {images.map((image: any) => (
          <div className={styles.slider} key={image.src}>
            <img src={image.src} alt={image.alt} style={{ width: '50vw', height: '50vh', marginLeft:'10vw' }} />
            <div>{image.theme}</div>
            <div>{image.detail}</div>

          </div>
        ))}
      </Slick>
      </div>
      <div>
        <div>TOUI</div>
        <div>
          <p>이용약관 l 개인정보처리방침</p>
          <p>CEO : 그린</p>
          <p>H.P : 070-3232-3232</p>
          <p>FAX : +82-02-3232-3233</p>
          <p>ADDRESS : 대전광역시 서구 대덕대로</p>
          <p>ⓒ 2023 MK. All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
