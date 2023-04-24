import logo from './logo.svg';
import './App.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from "leaflet";
import proj4 from 'proj4';
import React, { useState, useEffect, useCallback } from 'react';

/*global kakao*/

const position = [36.0761696194201, 129.382655928438] // 위,경도 직접 입력할때의 값

const crs2097 = '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs';
const crs5174 = '+proj=tmerc +lat_0=38 +lon_0=127.00289 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs';
const crsWgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';

// EPSG 2097 또는 EPSG 5174 좌표계 사용할 때 원본 x,y 좌표 값
const x = 414570.563877435;
const y = 288815.472861785;

// x,y 좌표 (EPSG 2097 or EPSG 5174) to 위,경도 (WGS84) 변환
const [lng, lat] = proj4(crs5174, crsWgs84, [x, y]);

function App() {

  const customMarker = L.icon({
    iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  });
  
  return (
    <MapContainer center={position} zoom={30} scrollWheelZoom={false} style={{ width: "100%", height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customMarker}>
        <Popup>
        </Popup>
      </Marker>
    </MapContainer>
  );
  
}


function LocationInput() {
  const [search, setSearch] = useState("");
  const onChange = (e) => {
    setSearch(e.target.value)
  }


  var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3 // 지도의 확대 레벨
    };

  // 지도 생성    
  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 주소-좌표 변환 객체를 생성
  var geocoder = new kakao.maps.services.Geocoder();

  const onSearch = () => {
    // 주소로 좌표를 검색
    geocoder.addressSearch(search, function (result, status) {

      // 정상적으로 검색이 완료됐으면 
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      }
      // 결과값으로 받은 위치를 마커로 표시
      var marker = new kakao.maps.Marker({
        map: map,
        position: coords
      });

      map.setCenter(coords)

      // 결과값으로 받은 위도, 경도 + 반경으로 json생성
      const pos = { x: String(coords.La), y: String(coords.Ma), position_range: "100" }
      const user1 = JSON.stringify(pos)
      console.log(user1)
      
      // 서버로 위도,경도,반경 json값 post
      fetch('/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: user1
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Data received:', data);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    });
    
  }
  return (
    <>
      <input type="text" value={search} onChange={onChange}></input>
      <button onClick={onSearch}>Search</button>
    </>
  )
}


export default LocationInput;