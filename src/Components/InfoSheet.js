import React, { useState } from "react";
import Sheet from 'react-modal-sheet';
import { useMap } from "react-leaflet";
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
            <h5>{eng2kor(facility)} - {location.facility_type[facility].count}</h5>
            <ul>
                {location.facility_type[facility].place.map((place, index) => (
                    <li key={`${place.distance}-${index}`} style={{ textAlign: 'left' }}>
                        <button onClick={() => handleMarkerClick(place.name)}>
                            {place.name}
                        </button>
                        <br />
                        <span>{place.address}</span>
                        <br />
                        <span>{place.distance}m</span>
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
                            <span> {eng2kor(type)} {name}은 {distance}m 떨어져 있습니다.</span>
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
            <Sheet isOpen={isOpen} onClose={closeSheet}>
                <Sheet.Container >
                    <Sheet.Header />
                    <Sheet.Content>
                        <h4 >{address}</h4>
                        <hr />
                        {/* <h5>해쉬태그</h5> */}
                        {location.hashtag}
                        <hr />
                        <h5>가장 가까운 편의시설</h5>
                        {getFirstFacilities()}
                        <hr />
                        <h5>주위에 어떤 편의시설들이 많을까?</h5>
                        {getTopFacilities()}
                        <hr />
                        <h5>검색한 동네 주위 이런 편의시설이 있어요!</h5>
                        {/* {facilities_list()} */}
                        {facilities.map((facility) => (
                            <FacilitiesList key={facility} facility={facility} location={location} />
                        ))}
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </div>
    );
}

export default InfoSheet;