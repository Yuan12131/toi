import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface PlaceSelectorProps {
  selectedPlaces: any[];
  setSelectedPlaces: React.Dispatch<React.SetStateAction<any[]>>;
}

const PlaceSelector: React.FC<PlaceSelectorProps> = ({selectedPlaces, setSelectedPlaces}) => {
  const [value, setValue] = useState(null);

  const handleSelect = (place: any) => {
    // 선택된 장소 정보 처리
    setSelectedPlaces((prevPlaces: any) => [...prevPlaces, place]);
    setValue(null);
  };

  return (
    <div>
      <GooglePlacesAutocomplete
        apiKey="AIzaSyCZy50I036EZDc-Lsu5EdEoUzdblq8WdHc"
        minLengthAutocomplete={2}
        autocompletionRequest={{ types: ["country", "locality"] }}
        selectProps={{
          onChange: handleSelect,
          placeholder: "방문할 국가나 도시를 검색하세요",
          value
        }}
      />

      {selectedPlaces.length > 0 && (
        <div>
          <h2>선택된 도시 이름</h2>
          <ul>
            {selectedPlaces.map((place, index) => (
              <li key={index}>{place.label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaceSelector;
