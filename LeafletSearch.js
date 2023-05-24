import React, { useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import axios from 'axios';
import './LeafletSearch.css';
import './BottomSheet.css';
import Sheet from 'react-modal-sheet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ResultSheet from "./ResultSheet";

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';


/* global kakao */
export const LeafletSearch = ({ setSearch }) => {
    const map = useMap();

    const [search, setSearchLocal] = useState("");
    const [places, setPlace] = useState([]);
    const [radius, setRadius] = useState('');
    const [facilities, setFacilities] = useState([]);
    const [isOpen, setOpen] = useState(false);

    // 경과 창에서 주소 띄워주기 위해 저장소 생성
    const [address,setAddress] = useState("");
    const [lat,setLat] = useState("");
    const [lng,setLng] = useState("");

    // 결과 창 바텀시트
    const [showResult, setShowResult] = useState(false);

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


    // 빨간색 마커
    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', // Replace with the path to your custom red marker icon image
        iconSize: [25, 41], // Adjust the size of the icon as per your requirements
    });
    
    let user_json;
    let coords;

    // 폼 제출 핸들러
    const handleSubmit = async (event) => {
        //event.preventDefault();
        
        //console.log(facilities.join(','))
        const one_server = 'http://127.0.0.1:8000/facilities/info/'

        // 검색할때마다 맵 리셋
        map.eachLayer((layer) => {
            if (layer instanceof L.MarkerClusterGroup) {
                map.removeLayer(layer);
            }
        });


        // 마커클러스터 생성
        const markerClusterGroup = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                var childCount = cluster.getChildCount();
                var c = ' marker-cluster-';
                if (childCount < 10) {
                    c += 'small';
                } else if (childCount < 30) {
                    c += 'medium';
                } else {
                    c += 'large';
                }
                return new L.DivIcon({
                    html: '<div><span>' + childCount + '</span></div>',
                    className: 'marker-cluster' + c,
                    iconSize: new L.Point(40, 40)
                });
            }
        });

        // 서버로 POST                    
        try {
            axios.post(one_server, user_json)
                .then((response) => {
                    setPlace([...response.data]);

                    places.forEach((place) => {
                        console.log(place.bplcnm)
                        const new_coords = new L.LatLng(place.st_y, place.st_x);
                        const marker = L.marker(new_coords);
                        marker.bindPopup(`<b>${place.bplcnm}</b>`);
                        markerClusterGroup.addLayer(marker);
                    });
                })
            // .catch(function(error){
            //     console.log(error);
            // });
            closeSheet();

            map.addLayer(markerClusterGroup);
            L.marker(coords, { icon: redIcon }).addTo(map);
            map.setView(coords, 17);

            setShowResult({address});

        } catch (error) {
            console.error(error);
        }
    }

    const handleSearch = () => {
        // 주소-좌표 변환 객체를 생성
        const geocoder = new kakao.maps.services.Geocoder();
        
        // 주소로 좌표를 검색
        geocoder.addressSearch(search, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {

                coords = new L.LatLng(result[0].y, result[0].x);
                setLng(coords.lng);
                setLat(coords.lat);
                //console.log(lng,lat);
                
                // json 생성 {위도, 경도, 반경}
                const user1 = { lon: coords.lng, lat: coords.lat, radius: parseInt(radius), facilities_type: facilities.join(',') };
                const user_json_tmp = JSON.stringify(user1);
                user_json = JSON.parse(user_json_tmp);
                console.log(user_json)
                //console.log(user1)

                handleSubmit();

                // App 컴포넌트에서 정의한 handleSearch 함수를 호출
                setSearch(coords);
                
            }
        });

        geocoder.coord2Address(lng,lat, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
              setAddress(result[0].address.address_name);
              console.log(address);
            }
            
          });
    };

    return (
        
        <div className="leaflet-bar leaflet-control">
            <div>{showResult && <ResultSheet address={address} />}</div>
            <form className="leaflet-bar-part leaflet-bar-part-single" onSubmit={(event) => event.preventDefault()}>
                <input
                    className="leaflet-search-control form-control"
                    type="text"
                    placeholder="상권이 궁금한 동네의 위치를 입력해보세요!"
                    onChange={onChange}
                    value={search}
                />
                {/* 누르면 바텀 시트 출력되는 필터링 버튼 */}
                <button id="filter-btn" onClick={openSheet}><FontAwesomeIcon icon={faFilter} /></button>
                {/* 편의시설 종류 반경 선택: 바텀 시트에서 진행. */}
                <Sheet isOpen={isOpen} onClose={closeSheet}>
                    <Sheet.Container>
                        <Sheet.Header />
                        <Sheet.Content>
                            <div className="filter-contents">
                                <p> 상권이 궁금한 동네의 위치를 입력해 보세요! </p>
                                <hr />
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
                                            value="laundry"
                                            checked={facilities.includes('laundry')}
                                            onChange={handleFacilityChange}
                                        />
                                        <span>세탁소</span>
                                    </div>
                                    {/* <div>
                            <input
                            type="checkbox"
                            value="미용실"
                            checked={facilities.includes('hair')}
                            onChange={handleFacilityChange}
                            />
                            <span>미용실</span>
                        </div>
                        <div>
                            <input
                            type="checkbox"
                            value="convenience"
                            checked={facilities.includes('convenience')}
                            onChange={handleFacilityChange}
                            />
                            <span>편의점</span>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                value="busStation"
                                checked={facilities.includes('busStation')}
                                onChange={handleFacilityChange}
                            />
                            <span>버스정류장</span>
                        </div> */}
                                </div>
                                <label>
                                    <hr />
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