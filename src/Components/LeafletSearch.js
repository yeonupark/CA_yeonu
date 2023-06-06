<<<<<<< HEAD
import React, { useState, useRef, useEffect } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 9a50017b624fa79e28769afc2969df37632931e2
import L from "leaflet";
import { useMap } from "react-leaflet";
import axios from 'axios';
import './css/LeafletSearch.css';
import './css/BottomSheet.css';
import Sheet from 'react-modal-sheet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMagnifyingGlass, faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import ResultSheet from "./ResultSheet";
// import DaumPostAddress from './DaumPostAddress';
import { globalurl } from "../App";

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import { type } from "@testing-library/user-event/dist/type";



/* global kakao */
export const LeafletSearch = ({ setSearch }) => {
    const map = useMap();

    const [search, setSearchLocal] = useState("");
    const [radius, setRadius] = useState('');
    const [facilities, setFacilities] = useState([]);
    const [isOpen, setOpen] = useState(false);
    // 좋아요 눌렀을 때 좌표값 서버로 넘겨주기 위해 좌표 저장 공간 생성
    const [position, setPosition] = useState({ lat: 37.5978219540466, lng: 127.065505630651 });
    const [location, setLocation] = useState({});
    // 결과 창 바텀시트
    const [showResult, setShowResult] = useState(false);
    //최근 결과창 바텀시트
    const [recentResult, setRecentResult] = useState(false);
    // 결과 창에서 주소 띄워주기 위해 저장소 생성
    const [address, setAddress] = useState("");
    // 결과 창에서 주소 띄워주기 위해 저장소 생성
    const [recentaddress, setRecentAddress] = useState("");
    const [recentSearchValue, setRecentSearchValue] = useState('');


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

    // 주소 완성 팝업창
    const PopupComponent = () => {
        return (
        <div className="popup">
            {/* 팝업창 내부에서 주소 => 좌표 반환하는 작업까지 한다 */}
            <DaumPostAddress address={search} setSearchLocal={setSearchLocal} setPopup={popupClick}/>
        </div>
        );
      };

    const [isPopupOpen, setIsPopupOpen] = useState(false);


    const popupClick = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    // const onChange = (e) => {
    //     setSearchLocal(e.target.value);
    // };

    // 검색한 주소에 좌표 찍는 마커
    const homeIcon = L.icon({
        iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=%232948ee&icon=home&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6', 
        iconSize: [35, 55], 
    });

    let user_json;
    let coords;
    let storedUser = localStorage.getItem("user");
    console.log(storedUser);

    // 폼 제출 핸들러
    const handleSubmit = async (event) => {
        //event.preventDefault();

        // const one_server = 'http://127.0.0.1:8000/facilities/info/'

        // 검색할때마다 맵 리셋
        map.eachLayer((layer) => {
            if (layer instanceof L.MarkerClusterGroup || layer instanceof L.Circle || layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // 결과 바텀시트 재오픈 위해 초기 세팅
        setShowResult(false);

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
            const response = await axios.post(globalurl+"/facilities/info/", user_json);
            setLocation(response.data.location);

        // 편의시설 별 커스텀 마커로 변경
        const facilities = response.data.location.facility_type;

        const iconPaths = {
            cafe: "https://api.geoapify.com/v1/icon/?type=material&color=%238c5a47&size=large&icon=coffee&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6 ",
            hospital: "https://api.geoapify.com/v1/icon/?type=material&color=%23ec3236&size=large&icon=stethoscope&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6 ",
            pharmacy: "https://api.geoapify.com/v1/icon/?type=material&color=%2357c779&size=large&icon=capsules&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6 ",
            laundry: "https://api.geoapify.com/v1/icon/?type=material&color=%23eec122&size=x-large&icon=tshirt&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6",
            bus: "https://api.geoapify.com/v1/icon/?type=material&color=%23579ac7&size=large&icon=bus&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6 ",
            convenience: "https://api.geoapify.com/v1/icon/?type=material&color=%238a57c7&size=large&icon=clock&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6 ",
            hair: "https://api.geoapify.com/v1/icon/?type=material&color=%23f06ce4&icon=cut&size=large&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6",
            metro: "https://api.geoapify.com/v1/icon/?type=material&color=%234445ef&icon=subway&size=large&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6 ",
            mart: "https://api.geoapify.com/v1/icon/?type=material&color=%23ed7a1e&icon=store&size=large&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6 ",
            gym: "https://api.geoapify.com/v1/icon/?type=material&color=%23848080&size=x-large&icon=dumbbell&iconType=awesome&apiKey=5d8a4be3945344c2b7b425443b6ae5c6"
        };

        for (const facility in facilities) {
            const facilityData = facilities[facility].place;
            facilityData.forEach((place) => {
                const new_coords = new L.LatLng(place.lat, place.lon);

                const iconPath = iconPaths[facility];
                
                const customIcon = L.icon({
                    iconUrl: iconPath,
                    iconSize: [30, 50]
                });
                const marker = L.marker(new_coords, { icon: customIcon });
                marker.bindPopup(`<b>${place.name}</b>`);
                markerClusterGroup.addLayer(marker);
            });
        } 
    } catch (error) {
        console.error(error);
    };
    closeSheet();
    setShowResult(true);

    map.addLayer(markerClusterGroup);
    L.marker(coords, { icon: homeIcon }).addTo(map);
    // 반경 원 그리기
    L.circle(coords, { color: "grey", radius: parseInt(radius) }).addTo(map);
    map.setView(coords, 17);
    localStorage.setItem("user", JSON.stringify(user_json));

}
const handleSearch = () => {

    if (facilities.length === 0){
        return(
            alert("편의시설을 선택해주세요.")
            )
    }

    if (radius === '') {
        return(
            alert("반경을 설정해주세요.")
            )
    }

    // 주소-좌표 변환 객체를 생성
    const geocoder = new kakao.maps.services.Geocoder();

    // 주소로 검색 -> result에 좌표값, 주소정보 들어있음
    geocoder.addressSearch(search, function (result, status) {
        // 정상적으로 검색이 완료됐으면

        if (status === kakao.maps.services.Status.OK) {
            coords = new L.LatLng(result[0].y, result[0].x);
            setPosition(coords);

            // user_json 생성 (x좌표,y좌표,반경,편의시설)
            const user1 = { lon: String(coords.lng), lat: String(coords.lat), radius: radius, facilities_type: facilities.join(',') };
            const user_json_tmp = JSON.stringify(user1);
            user_json = JSON.parse(user_json_tmp);

            // address에는 시, 구, 동 단위까지 저장. 결과 컴포넌트에 띄워주기 위함
            let adrs1, adrs2, adrs3;
            if (result[0].address) {    // 일반 주소
                adrs1 = result[0].address.region_1depth_name;
                adrs2 = result[0].address.region_2depth_name;
                const adrs3_tmp = result[0].address.region_3depth_h_name;

                if (/\d/.test(adrs3_tmp)) { // 숫자가 있는 경우
                    adrs3 = adrs3_tmp.replace(/\d/g, "");
                }
                else if (adrs3_tmp === "") {
                    adrs3 = result[0].address.region_3depth_name;
                }
                else {
                    adrs3 = adrs3_tmp;
                }
            } else {    // 도로명 주소
                adrs1 = result[0].road_address.region_1depth_name;
                adrs2 = result[0].road_address.region_2depth_name;
                const adrs3_tmp = result[0].road_address.region_3depth_name;

                if (/\d/.test(adrs3_tmp)) { // 숫자가 있는 경우
                    adrs3 = adrs3_tmp.replace(/\d/g, "");
                }
                else {
                    adrs3 = adrs3_tmp;
                }
            }
            setAddress(adrs1 + " " + adrs2 + " " + adrs3);

            handleSubmit();
        }
        // 주소값 잘못 들어왔을 시 alert
        else {
            alert('올바른 주소를 입력하세요')
        }
    });
};

const handleRecentSearch = async (event) => {
    let storedUser = JSON.parse(localStorage.getItem("user"));
    try {
        const response =  await axios.post(globalurl+"/facilities/info/", storedUser);
        // 서버 응답 처리
        setLocation(response.data.location);
        console.log(response.data);
        setAddress("");
        setRecentResult(!recentResult);
    } catch (error) {
        console.error(error);
    }
    setRecentResult(!recentResult);
};

const handleCloseSheet = () => {
    setRecentResult(false);
  };

// setRecentResult(false);

    // 카카오 API를 사용해 현재 위치 받고 => 그 위치를 주소로 변환해주는 컴포넌트 
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              reverseGeocoding(latitude, longitude);
            },
            (error) => {
              console.error(error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      };
  
    const reverseGeocoding = (latitude, longitude) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.coord2Address(longitude, latitude, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;

          // address를 받으면, 바로 searchLocal돌려서 input에 입력되게 함
          setSearchLocal(address)
        } else {
          console.error('Failed to reverse geocode coordinates.');
        }
      });
    };

    return (
        <div className="leaflet-bar leaflet-control">
            {/* input을 클릭해서 open하면 => popup창 뜨도록 */}
            {isPopupOpen && (
                <PopupComponent/>
            )}
            <form className="leaflet-bar-part leaflet-bar-part-single" onSubmit={(event) => event.preventDefault()}>
                <input
                    className="leaflet-search-control form-control"
                    type="text"
                    placeholder="궁금한 동네의 위치를 입력해보세요!"
                    value={search}
                    onClick={popupClick}
                />
                {isPopupOpen && (
                    <PopupComponent/>
                )}
                {/* 누르면 바텀 시트 출력되는 필터링 버튼 */}
<<<<<<< HEAD
                <button id="filter-btn" onClick={openSheet}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
=======
                <button id="filter-btn" onClick={openSheet}><FontAwesomeIcon icon={faFilter}/>
                </button>
>>>>>>> 9a50017b624fa79e28769afc2969df37632931e2
                {/* 클릭하면 주소 가져오는 링크 */}    
                <button id="bring-addr-btn" onClick={getCurrentLocation}>
                    <FontAwesomeIcon icon={faLocationCrosshairs} style={{ color: 'black' }}/>
                </button>
                {/* 편의시설 종류 반경 선택: 바텀 시트에서 진행. */}
                <Sheet isOpen={isOpen} onClose={closeSheet}>
                    <Sheet.Container>
                        <Sheet.Header />
                        <Sheet.Content>
                            <div className="filter-contents">
                                <p id="guite-txt"> 원하는 편의시설을 선택해주세요! </p>
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
                                    <div>
                                        <input
                                            type="checkbox"
                                            value="hair"
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
                                            value="bus"
                                            checked={facilities.includes('bus')}
                                            onChange={handleFacilityChange}
                                        />
                                        <span>버스</span>
                                    </div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            value="metro"
                                            checked={facilities.includes('metro')}
                                            onChange={handleFacilityChange}
                                        />
                                        <span>지하철</span>
                                    </div>
                                </div>
                                <label>
                                    <hr />
                                    <p id="guite-txt">입력한 주소에서(최대)</p>
                                    <div id="radius-container">
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
                                    </div>
                                </label>
                            </div>
                            <button id="submit-btn" onClick={handleSearch}>적용</button>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop />
                </Sheet>
                <div>{showResult && <ResultSheet address={address} coords={position} location={location} />}</div>
                <button id="search-btn" onClick={handleRecentSearch}>
                    <FontAwesomeIcon icon={faClock} />
                </button>
                <div>{recentResult && <ResultSheet address={address} coords={position} location={location}/>}</div>
            </form>
        </div>
    );
};

export default LeafletSearch;