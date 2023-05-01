import logo from './logo.svg';
import './App.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from "leaflet";
import proj4 from 'proj4';
import React, { useState, useEffect, useCallback } from 'react';

/*global kakao*/

function App() {
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
  
  // 서버에서 전달받은 편의시설 데이터 넣어줄 공간
  const [place, setPlace] = useState([]);

  const onSearch = () => {
    // 주소로 좌표를 검색
    geocoder.addressSearch(search, function (result, status) {

      // 정상적으로 검색이 완료됐으면 
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      }
      /*
      // 결과값으로 받은 위치를 마커로 표시
      var marker = new kakao.maps.Marker({
        map: map,
        position: coords
      });
      */
      map.setCenter(coords)

      // 결과값으로 받은 위도, 경도 + 반경으로 json생성
      const pos = { x: String(coords.La), y: String(coords.Ma), position_range: "100" }
      const user1 = JSON.stringify(pos)
      console.log(user1)
      
      // 서버에 데이터 전송
      axios.post("users", {
        title: "제목",
        content: "내용",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

      // 서버에서 데이터 받아오기
      axios.get("users")
        .then((response) => {
          setPlace([...response.data]);

          /*
          // A) 서버에서 받아온 데이터를 이용하여 마커를 생성하고 지도에 표시
          response.data.forEach(place => {
            const latLng = new kakao.maps.LatLng(place.y, place.x);
            const marker = new kakao.maps.Marker({
              position: latLng,
              map: map,
              title: place.name
            });
          });

          // B) 1, 2, 3번째 장소 정보 추출
          const place1 = response.data[0];
          const place2 = response.data[1];
          const place3 = response.data[2];
          
          const marker1 = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place1.y좌표, place1.x좌표)
          });
          const marker2 = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place2.y좌표, place2.x좌표)
          });
          const marker3 = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place3.y좌표, place3.x좌표)
          });
          */
        })
        .catch(function (error) {
          console.log(error);
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


export default App;