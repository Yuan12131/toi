import React from "react";

interface ThemeSelectorProps {
  selectedThemes: string;
  setSelectedThemes: (selectedThemes: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemes,
  setSelectedThemes,
}) => {
  return (
    <div>
      <label htmlFor="themes">테마 선택:</label>
      <input
        type="checkbox"
        name="theme"
        value="자연 테마 : 숲, 산, 해변, 강 등 자연 경관을 탐험하는 여행"
        id="healing"
        placeholder="자연"
        onChange={(e) => setSelectedThemes(e.target.value)}
      />
      <label htmlFor="nature">휴양과 힐링</label>
      <input
        type="checkbox"
        name="theme"
        value="도시 탐험 테마:도심 중심의 거리, 지역 시장, 쇼핑몰 등 도시의 다양한 즐길 거리가 중심"
        id="city"
        onChange={(e) => setSelectedThemes(e.target.value)}
      />
      <label htmlFor="city">도시와 도심</label>
      <input
        type="checkbox"
        name="theme"
        value="역사와 문화 테마 : 성, 궁전, 사원, 박물관 등 역사적인 명소를 방문하며 지역 문화 체험."
        id="arc"
        onChange={(e) => setSelectedThemes(e.target.value)}
      />
      <label htmlFor="arc">역사와 문화</label>
    </div>
  );
};

export default ThemeSelector;
