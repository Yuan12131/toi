import React from "react";

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
      value: "자연 테마 : 숲, 산, 해변, 강 등 자연 경관을 탐험하는 여행",
    },
    {
      id: "city",
      label: "도시와 도심",
      value: "도시 탐험 테마:도심 중심의 거리, 지역 시장, 쇼핑몰 등 도시의 다양한 즐길 거리가 중심",
    },
    {
      id: "arc",
      label: "역사와 문화",
      value: "역사와 문화 테마 : 성, 궁전, 사원, 박물관 등 역사적인 명소를 방문하며 지역 문화 체험.",
    },
  ];

  const handleThemeClick = (value: string) => {
    setSelectedThemes(value);
  };

  return (
    <div>
      <h1>테마 선택:</h1>
      {themes.map((theme) => (
        <div key={theme.id} onClick={() => handleThemeClick(theme.value)}>
          <label htmlFor={theme.id}>{theme.label}</label>
        </div>
      ))}
    </div>
  );
};

export default ThemeSelector;
