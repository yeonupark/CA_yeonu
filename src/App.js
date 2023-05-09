import logo from './logo.svg';
import { useMap, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "./App.css";
import { LeafletSearch } from "./LeafletSearch";
import React, { useEffect, useState } from "react";

/* global kakao*/
function App() {
  const initialPosition = [37.5978219540466, 127.065505630651];
  const [search, setSearch] = useState("");
  //const [markerPosition, setMarkerPosition] = useState(null);

  const handleSearch = (coords) => {
    // 검색 결과를 처리하는 코드
    //setMarkerPosition(coords);
  };

  return (
    <div className="App">
      <MapContainer center={initialPosition} zoom={17} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LeafletSearch onSearchCallback={handleSearch} setSearch={setSearch} />
      </MapContainer>
    </div>
  );
}

export default App;