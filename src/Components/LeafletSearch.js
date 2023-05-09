import React, { useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import axios from 'axios';
import './LeafletSearch.css';
import './BottomSheet.css';
import Sheet from 'react-modal-sheet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

/* global kakao*/

export const LeafletSearch = ({ setSearch }) => {
    const map = useMap();
    const [search, setSearchLocal] = useState("");
    const [place, setPlace] = useState([]);
    const [radius, setRadius] = useState('');
    const [facilities, setFacilities] = useState([]);
    const [isOpen, setOpen] = useState(false);

    //바텀시트 핸들러(열기)
    const openSheet = () => {
      setOpen(true)
    }

    //바텀시트 핸들러(닫기)
    const closeSheet = () => {
        setOpen(false);
      };

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
                console.log('사용자 입력 정보:', user_json);
                console.log(facilities)

                // 폼 제출 핸들러
                const handleSubmit = async (e) => {
                    e.preventDefault();
                  
                    const servers = {
                      pharmacy: 'https://127.0.0.1:8000/facilities/pharmacy',
                      cafe: 'https://127.0.0.1:8000/facilities/cafe',
                      hospital: 'http://127.0.0.1:8000/facilities/hospital',
                      gym: 'http://127.0.0.1:8000/facilities/gym'
                    };
                    const selectedServers = facilities.map((facility) => servers[facility]);
                    
                    // 서버로 POST
                    try {
                      // selectedServers 배열을 순회하면서 각 서버에 대해 요청을 보냄
                      const promises = selectedServers.map(servers => {
                        axios.post(servers, {
                            x: coords.lat, y: coords.lng
                        });
                        console.log('응답하라 종합설계:', promises);
                      });
                  
                      // 모든 서버에 대한 요청이 끝날 때까지 기다림
                      const responses = await Promise.all(promises);
                  
                      // 각 서버로부터 받은 응답 데이터를 출력
                      responses.forEach(response => console.log(response.data));
                    } catch (error) {
                      console.error(error);
                    }

                    // 서버로부터 GET
                    try {
                        // selectedServers 배열을 순회하면서 각 서버에 대해 GET 요청을 보냄
                        const promises = servers.map(servers => {
                          return axios.get('http://127.0.0.1:8000/');
                        });
                    
                        // 모든 서버에 대한 요청이 끝날 때까지 기다림
                        const responses = await promises.all(promises);
                    
                        // 각 서버로부터 받은 응답 데이터를 처리하여 마커를 지도에 표시하는 작업을 수행
                        responses.forEach(response => {
                          const data = response.data;
                          if (data.choice === 1) {
                            const coords = new L.LatLng(data.lat, data.lon);
                            L.marker(coords).addTo(map);
                          }
                        });
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
                {/* 누르면 바텀 시트 출력되는 필터링 버튼 */}
                <button id="filter-btn" onClick={openSheet}><FontAwesomeIcon icon={faFilter}/></button>
                {/* 편의시설 종류 반경 선택: 바텀 시트에서 진행. */}
                <Sheet isOpen={isOpen} onClose={closeSheet}>
                    <Sheet.Container>
                        <Sheet.Header />
                    <Sheet.Content>
                    <div className="filter-contents">
                        <p> 검색하고 싶은 편의시설을 모두 선택해주세요! </p>
                        <hr/>
                        <div id="checkbox-container">
                        <div>
                            <input
                                type="checkbox"
                                value="pharmacy"
                                checked={facilities.includes('pharmacy')}
                                onChange={handleFacilityChange}
                            />
                            <span>약국</span>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                value="cafe"
                                checked={facilities.includes('cafe')}
                                onChange={handleFacilityChange}
                            />
                            <span>카페</span>
                        </div>
                        <div>
                            <input
                            type="checkbox"
                            value="hospital"
                            checked={facilities.includes('hospital')}
                            onChange={handleFacilityChange}
                            />
                            <span>병원</span>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                value="mart"
                                checked={facilities.includes('mart')}
                                onChange={handleFacilityChange}
                            />
                            <span>마트</span>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                value="gym"
                                checked={facilities.includes('gym')}
                                onChange={handleFacilityChange}
                            />
                            <span>체육시설</span>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                value="busStation"
                                checked={facilities.includes('busStation')}
                                onChange={handleFacilityChange}
                            />
                            <span>버스정류장</span>
                        </div>
                    </div>
                    <label>
                        <hr/>
                        <p>입력한 주소에서(최대)</p>
                                <select
                                    id="radius-select"
                                    value={radius}
                                    onChange={(e) => setRadius(e.target.value)}>
                                        <option value="">선택하세요</option>
                                        <option value="100">100m</option>
                                        <option value="200">200m</option>
                                        <option value="500">500m</option>
                                        <option value="1000">1km</option>
                                </select>
                            </label>
                </div>
                <button id="submit-btn" onClick={handleSearch}>적용</button>
                </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
                <button id="search-btn" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </form>
        </div>
    );
};

export default LeafletSearch;