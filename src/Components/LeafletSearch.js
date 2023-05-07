import React, { useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import axios from 'axios';
import BottomSheet from './BottomSheet';
import './LeafletSearch.css';
/*검색 아이콘:fontawesome 사용*/
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* global kakao*/

export const LeafletSearch = ({ setSearch }) => {
    const map = useMap();
    const [search, setSearchLocal] = useState("");
    const [place, setPlace] = useState([]);

    const onChange = (e) => {
        setSearchLocal(e.target.value);
    };

    const handleSearch = () => {
        // 주소-좌표 변환 객체를 생성합니다
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(search, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                const coords = new L.LatLng(result[0].y, result[0].x);
                
                // 마커를 생성하고 지도에 추가
                L.marker(coords).addTo(map);
                // 검색 결과 위치로 지도의 센터를 이동
                map.setView(coords, 17);

                // json 생성 (위도, 경도, 반경)
                const pos = { x: String(coords.lat), y: String(coords.lng), position_range: "100" };
                const user1 = JSON.stringify(pos);
                console.log(user1);

                // 서버에 데이터 전송
                axios.post("users", {
                    user1
                })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                /*
                // 서버에서 데이터 받아오기
                axios.get("users")
                    .then((response) => {
                        setPlace([...response.data]);

                        // 서버에서 받아온 데이터를 이용하여 마커를 생성하고 지도에 표시
                        response.data.forEach(place => {
                            const latLng = new kakao.maps.LatLng(place.y, place.x);
                            const marker = new kakao.maps.Marker({
                                position: latLng,
                                map: map,
                                title: place.name
                            });
                        });

                        
                        // 1, 2, 3번째 장소 정보 추출
                        const place1 = response.data[0];
                        const place2 = response.data[1];
                        const place3 = response.data[2];
                
                        // 추출된 장소 정보로 마커 생성 및 지도에 표시
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
                        
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                    */
                // App 컴포넌트에서 정의한 handleSearch 함수를 호출
                setSearch(coords);
            }
        });
    };

    return (
        <div className="leaflet-bar leaflet-control">
            <form className="leaflet-bar-part leaflet-bar-part-single" onSubmit={(e) => e.preventDefault()}>
                <input
                    className="leaflet-search-control form-control"
                    type="text"
                    placeholder="주소를 입력하세요!"
                    onChange={onChange}
                    value={search}
                />
                <BottomSheet/>
                <button id="search-btn" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                </button>
            </form>
        </div>
    );
};

export default LeafletSearch;
