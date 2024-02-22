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
        value="healing"
        id="healing"
        onChange={(e) => setSelectedThemes(e.target.value)}
      />
      <label htmlFor="healing">힐링</label>
      <input
        type="checkbox"
        name="theme"
        value="nature"
        id="nature"
        onChange={(e) => setSelectedThemes(e.target.value)}
      />
      <label htmlFor="nature">자연</label>
      <input
        type="checkbox"
        name="theme"
        value="city"
        id="city"
        onChange={(e) => setSelectedThemes(e.target.value)}
      />
      <label htmlFor="city">도시</label>
      <input
        type="checkbox"
        name="theme"
        value="arc"
        id="arc"
        onChange={(e) => setSelectedThemes(e.target.value)}
      />
      <label htmlFor="arc">유적지</label>
    </div>
  );
};

export default ThemeSelector;
