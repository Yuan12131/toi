import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import styles from "@/styles/place.module.scss"

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
    <div className={styles.place}>
      <h2>여행 장소</h2>
      <GooglePlacesAutocomplete
        apiKey="AIzaSyDpnJtXd385DDjiz4Ow0KFzAA05cUtd3nA"
        minLengthAutocomplete={2}
        autocompletionRequest={{ types: ["country", "locality"] }}
        selectProps={{
          onChange: handleSelect,
          className: styles.autocompleteInput,
          placeholder: "여행 예정인 국가나 도시를 검색하세요",
          value
        }}
      />

      {selectedPlaces.length > 0 && (
          <ul>
            {selectedPlaces.map((place, index) => (
              <li key={index}>{place.label}</li>
            ))}
          </ul>
      )}
    </div>
  );
};

export default PlaceSelector;
