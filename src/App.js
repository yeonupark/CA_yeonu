import { useMap, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import './App.css';
import L from "leaflet";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BottomSheet from './Components/BottomSheet';
import { LeafletSearch } from "./Components/LeafletSearch";


function App() {
  const [isOpen, setOpen] = useState(false);
  const openSheet = () => {
    setOpen(true)
  }
  const initialPosition = [37.5978219540466, 127.065505630651];
  const [search, setSearch] = useState("");
  //const [markerPosition, setMarkerPosition] = useState(null);

  const handleSearch = (coords) => {
    // 검색 결과를 처리하는 코드
    //setMarkerPosition(coords);
  };

  return (
    <div>
    {/* <div className="search-container">
      <input type="text" value={search} onChange={onChange} onClick={openSheet} placeholder="도로명 주소를 입력해주세요!"></input>
      <button id="search-btn" onClick={onSearch}><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
      <BottomSheet></BottomSheet>
    </div> */}
    <div className="App">
      <MapContainer center={initialPosition} zoom={17} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LeafletSearch id="search-container" onSearchCallback={handleSearch} setSearch={setSearch} />
        <BottomSheet/>
      </MapContainer>
      
    </div>
    
    </div>
  );
}

export default App;