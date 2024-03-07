import React, { useState } from "react";
import styles from "@/styles/theme.module.scss";

interface ThemeSelectorProps {
  selectedThemes: string;
  setSelectedThemes: (selectedThemes: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemes,
  setSelectedThemes,
}) => {
  const themes = [
    {
      id: "healing",
      label: "휴양과 힐링",
      value:
        "자연 테마 : 숲, 산, 해변, 강 등 자연 경관을 탐험하는 여행",
    },
    {
      id: "city",
      label: "도시와 도심",
      value:
        "도시 탐험 테마:도심 중심의 거리, 지역 시장, 쇼핑몰 등 도시의 다양한 즐길 거리가 중심",
    },
    {
      id: "arc",
      label: "역사와 문화",
      value:
        "역사와 문화 테마 : 성, 궁전, 사원, 박물관 등 역사적인 명소를 방문하며 지역 문화 체험.",
    },
  ];

  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const handleThemeClick = (value: string) => {
    setActiveTheme((prevTheme) => (prevTheme === value ? null : value));
    setSelectedThemes(value);
  };

  return (
    <div className={styles.theme}>
      <h2>여행 테마</h2>
      {themes.map((theme) => (
        <div
          className={activeTheme === theme.value ? styles.active : ""}
          key={theme.id}
          onClick={() => handleThemeClick(theme.value)}
        >
          <label
            className={activeTheme === theme.value ? styles.active : ""}
            htmlFor={theme.id}
          >
            {theme.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ThemeSelector;
