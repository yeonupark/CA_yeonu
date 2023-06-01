import React, { useState } from "react";
import Sheet from 'react-modal-sheet';
import ImageComponent from './ImageComponent';
import { useMap } from "react-leaflet";
import './css/InfoSheet.css';
//import axios from "axios";

// 편의시설 종류 영어 -> 한글로 변환
function eng2kor(eng) {
    const dic = {"cafe":"카페", "hospital":"병원","pharmacy":"약국","gym":"운동시설",
    "laundry":"세탁소","bus":"버스","hair":"미용실","convenience":"편의점","mart":"마트"}
    return(dic[eng])
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
                        <hr id="near-hr"/>
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
                            <span id="facility-info"> <span id="facility-type">{eng2kor(type)}</span> <blue>{name}</blue>은(는) <blue>{distance}</blue>m 떨어져 있습니다.</span>
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

    //const topFacilities = getTopFacilities();
    

    // 전체 편의시설 목록 가져오기
    // 편의시설 목록에서 특정 편의시설 클릭 시 해당 위치 마커로 이동하는 기능 없는 ver.
    // const facilities_list = () => {

    //     return (
    //         // 각 편의시설별 데이터 출력
    //         <>
    //             {facilities.map((facility) => (
    //                 <div key={facility}>
    //                     <h5>{facility} - {location.facility_type[facility].count}</h5>
    //                     <ul>

    //                         {location.facility_type[facility].place.map((place, index) => (
    //                             <li key={`${place.distance}-${index}`} style={{ textAlign: 'left' }}>
    //                                 <span style={{fontWeight: 'bold'}}>{place.name}</span><br />
    //                                 <span>{place.address}</span><br />
    //                                 <span>{place.distance}m</span>
    //                             </li>
    //                         ))}
    //                     </ul>
    //                     <hr />
    //                 </div>
    //             ))}
    //         </>
    //     );
    //};

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
                        <hr id="section-hr"/>
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