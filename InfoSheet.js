import React, { useState } from "react";
import Sheet from 'react-modal-sheet';
import ImageComponent from "./ImageComponent";
import { useMap } from "react-leaflet";
import './css/InfoSheet.css';
//import axios from "axios";

// 편의시설 종류 영어 -> 한글로 변환
function eng2kor(eng) {
    const dict = {
        "cafe": "카페", "hospital": "병원", "pharmacy": "약국", "gym": "체육시설",
        "laundry": "세탁소", "bus": "버스정류장", "hair": "미용실", "convenience": "편의점", "mart": "마트"
    }
    return (dict[eng])
}

// 거리(m) -> 도보시간(minute) 환산
function meter2minute(distance) {
    if (distance <= 135) {
        return 1;
    } else if (distance <= 200) {
        return 2;
    } else if (distance <= 270) {
        return 3;
    } else if (distance <= 335) {
        return 4;
    } else if (distance <= 400) {
        return 5;
    } else if (distance <= 465) {
        return 6;
    } else if (distance <= 535) {
        return 7;
    } else if (distance <= 600) {
        return 8;
    } else if (distance <= 670) {
        return 9;
    } else if (distance <= 730) {
        return 10;
    } else if (distance <= 800) {
        return 11;
    } else if (distance <= 870) {
        return 12;
    } else if (distance <= 940) {
        return 13;
    } else if (distance <= 1000) {
        return 14;
    } else {
        return 15;
    }
}

// 전체 편의시설 목록 가져오기
// 편의시설 리스트에서 특정 편의시설 클릭 시 지도 상 해당 마커 위치로 이동시키는 ver.
const FacilitiesList = ({ facility, location }) => {
    const map = useMap();

    const handleMarkerClick = (facilityName) => {
        const { place } = location.facility_type[facility];

        const specificFacility = place.find((facility) => facility.name === facilityName);
        if (specificFacility) {
            const lat = specificFacility.lat;
            const lon = specificFacility.lon;
            map.setView([lat, lon]);

        }
    };

    return (
        <div key={facility}>
            <h5>{eng2kor(facility)} <blue>{location.facility_type[facility].count}</blue></h5>
            <ul>
                {location.facility_type[facility].place.map((place, index) => (
                    <li key={`${place.distance}-${index}`} style={{ textAlign: 'left' }}>
                        <hr id="near-hr" />
                        <button onClick={() => handleMarkerClick(place.name)}>
                            {place.name}
                        </button>
                        <br />
                        <span>{place.address}</span>
                        <br />
                        <span id="distance">{place.distance}m</span>
                    </li>
                ))}
            </ul>
            <hr />
        </div>
    );
};

const InfoSheet = ({ location, address }) => {

    var [firstFacilities, setFirstFacilities] = useState([]);
    const [isOpen, setOpen] = useState(true);

    // 편의시설 선택하지 않았을 때 오류 뜨는 것 방지하기 위함
    if (!location || !location.facility_type || Object.keys(location.facility_type).length === 0) {
        return (
            alert("편의시설을 선택해주세요.")
        )
    }

    // 선택된 편의시설 종류
    const facilities = Object.keys(location.facility_type);

    //바텀시트 핸들러(열기)
    const openSheet = () => {
        setOpen(true)
    }
    //바텀시트 핸들러(닫기)
    const closeSheet = () => {
        setOpen(false);
    };

    // 편의시설 별 가장 가까운 지점 가져오기
    const getFirstFacilities = () => {
        firstFacilities = []
        facilities.forEach(facility => {
            const facilityData = location.facility_type[facility].place;

            const firstFacility = {
                type: facility,
                ...facilityData[0]
            };
            firstFacilities.push(firstFacility);
        });

        return (
            <>
                {firstFacilities.map(facility => {
                    const { type, name, distance, address } = facility;
                    return (
                        <div key={type} style={{ textAlign: 'left' }}>
                            <span id="facility-info"> <span id="facility-type">{eng2kor(type)}</span>
                                <blue>{name}</blue>은(는) <blue>{distance}</blue>m 떨어져 있습니다.</span>
                            {/* <span> {eng2kor(type)} {name}은 도보 {meter2minute(distance)}분 거리입니다. 
                            ({distance}m) </span> */}
                        </div>
                    );
                })}
            </>
        );
    }

    // 가장 많이 있는 편의시설 가져오기
    const getTopFacilities = () => {
        const totalCount = facilities.reduce((sum, facility) => {
            return sum + location.facility_type[facility].count;
        }, 0);

        const facilityRatios = facilities.map((facility) => {
            const count = location.facility_type[facility].count;
            const ratio = (count / totalCount) * 100;
            return { facility, count, ratio };
        });

        const sortedFacilities = facilityRatios.sort((a, b) => b.ratio - a.ratio);

        const topFacilities = sortedFacilities.slice(0, 3);

        return (
            <>
                <ul>
                    {topFacilities.map((facility) => (
                        <li key={facility.ratio}>
                            {eng2kor(facility.facility)} {facility.ratio.toFixed(2)}% ({facility.count}개)
                        </li>
                    ))}
                    <ImageComponent topFacilities={topFacilities} />
                </ul>
            </>
        )
    };

    return (
        <div>
            <Sheet id="info-sheet" isOpen={isOpen} onClose={closeSheet}>
                <Sheet.Container >
                    <Sheet.Header />
                    <Sheet.Content id="info-sheet-content">
                        <h4 >{address}</h4>
                        <hr />
                        {/* <h5>해쉬태그</h5> */}
                        <div id="location-hash">
                            {location.hashtag}
                        </div>
                        {/* <hr id="section-hr"/> */}
                        <p id="near-facilities">가장 가까운 편의시설</p>
                        {getFirstFacilities()}
                        <hr />
                        <div id="top-facilities">
                            <p>주위 편의시설 종류</p>
                            {getTopFacilities()}
                        </div>
                        <hr id="section-hr" />
                        <div id="near-facilities">
                            <p>인근 편의시설</p>
                            {/* {facilities_list()} */}
                            {facilities.map((facility) => (
                                <FacilitiesList key={facility} facility={facility} location={location} />
                            ))}
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </div>
    );
}

export default InfoSheet;