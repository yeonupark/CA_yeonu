import React, { useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import axios from 'axios';

/* global kakao*/

export const LeafletSearch = ({ setSearch }) => {
    const map = useMap();
    const [search, setSearchLocal] = useState("");
    const [place, setPlace] = useState([]);
    const [radius, setRadius] = useState('');
    const [facilities, setFacilities] = useState(['pharmacy', 'cafe', 'hospital','mart','gym','busStation']);

    // 체크박스 변경 핸들러
    const handleFacilityChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;
        // 새로운 facilities 배열을 만들어서 state 업데이트
        if (checked) {
            setFacilities([...facilities, value]);
        } else {
            setFacilities(facilities.filter((facility) => facility !== value));
        }
    }

    const onChange = (e) => {
        setSearchLocal(e.target.value);
    };

    const handleSearch = () => {
        // 주소-좌표 변환 객체를 생성
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색
        geocoder.addressSearch(search, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                
                const coords = new L.LatLng(result[0].y, result[0].x);
                
                // 마커를 생성하고 지도에 추가
                L.marker(coords).addTo(map);
                // 검색 결과 위치로 지도의 센터를 이동
                map.setView(coords, 17);

                // json 생성 {위도, 경도, 반경}
                const user1 = { x: coords.lat, y: coords.lng, position_range : radius};
                const user_json = JSON.stringify(user1)
                console.log(user_json);
                console.log(facilities)

                // 폼 제출 핸들러
                const handleSubmit = async (e) => {
                    e.preventDefault();
                  
                    const servers = {
                      pharmacy: 'https://facilities/pharm',
                      cafe: 'https://facilities/cafe',
                      hospital: 'http://facilities/hospi'
                    };
                    const selectedServers = facilities.map((facility) => servers[facility]);
                    
                    try {
                      // selectedServers 배열을 순회하면서 각 서버에 대해 요청을 보냄
                      const promises = selectedServers.map(server => {
                        return axios.post(server, {
                          user_json,
                          servers: [server]
                        });
                      });
                  
                      // 모든 서버에 대한 요청이 끝날 때까지 기다림
                      const responses = await Promise.all(promises);
                  
                      // 각 서버로부터 받은 응답 데이터를 출력
                      responses.forEach(response => console.log(response.data));
                    } catch (error) {
                      console.error(error);
                    }
                  }
                
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
                <label>
                    반경:
                    <select
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                    >
                        <option value="">선택하세요</option>
                        <option value="100">100m</option>
                        <option value="200">200m</option>
                        <option value="500">500m</option>
                        <option value="1000">1km</option>
                    </select>
                </label>
                <div>
                    <input
                        type="checkbox"
                        value="pharmacy"
                        checked={facilities.includes('pharmacy')}
                        onChange={handleFacilityChange}
                    />
                    <label>약국</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        value="cafe"
                        checked={facilities.includes('cafe')}
                        onChange={handleFacilityChange}
                    />
                    <label>카페</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        value="hospital"
                        checked={facilities.includes('hospital')}
                        onChange={handleFacilityChange}
                    />
                    <label>병원</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        value="mart"
                        checked={facilities.includes('mart')}
                        onChange={handleFacilityChange}
                    />
                    <label>마트</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        value="gym"
                        checked={facilities.includes('gym')}
                        onChange={handleFacilityChange}
                    />
                    <label>체육시설</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        value="busStation"
                        checked={facilities.includes('busStation')}
                        onChange={handleFacilityChange}
                    />
                    <label>버스정류장</label>
                </div>
                <button onClick={handleSearch}>
                    Search
                </button>
            </form>
        </div>
    );
};

export default LeafletSearch;
