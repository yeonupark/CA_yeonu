import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import './css/MyPage.css';
import RadarChart from "./Radar";
import { LoginContext } from './LoginContext';
import { globalurl } from "../App";

/* global kakao*/
function MyPage({ myAddressList }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOpen, setOpen] = useState(true);
  const [myReview, setMyReview] = useState([]);
  const { loggedInUser } = useContext(LoginContext);
  const [myLikeList, setMyLikeList] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [isChartVisible, setChartVisible] = useState(false);
  const [selectedFacilitiesType, setSelectedFacilitiesType] = useState("");
  const [radius, setRadius] = useState("");
  const [postData, setPostData] = useState({
    facilities_type: "", // 초기값을 빈 문자열로 설정
    radius: "", // 예시값으로 0으로 설정
    lat_1: 0, // 예시값으로 0으로 설정
    lon_1: 0, // 예시값으로 0으로 설정
    lat_2: 0, // 예시값으로 0으로 설정
    lon_2: 0, // 예시값으로 0으로 설정
  });

  function Logout() {
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다!');
    closeSheet();
  }

  function closeSheet() {
    setOpen(false);
  }

  const username_json_tmp = JSON.stringify({ username: loggedInUser });
  const username_json = JSON.parse(username_json_tmp);

  const getMyReview = async () => {
    try {
      // 서버로 __를 post하고, 응답으로 내가 작성한 주소의 리뷰 데이터를 가져옴
      const response = await axios.post(globalurl+"accounts/mycomment/", username_json);
      //console.log(response);
      setMyReview(response.data);
    } catch (error) {
      console.error('리뷰를 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  useEffect(() => {
    getMyReview();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행되도록 함

  const getMyLike = async () => {
    try {
      setMyLikeList([]); // 이전 데이터 초기화
      const response = await axios.post(
        globalurl+"facilities/mylike/",
        username_json
      );
      const likes = response.data.map(async like => {
        const { lon, lat } = like;
        const address = await new Promise((resolve, reject) => {
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(lon, lat, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              resolve(result[0].address.address_name);
            } else {
              reject(new Error("주소 변환에 실패했습니다."));
            }
          });
        });
        return {
          address,
          lat,
          lon,
          selected: false
        };
      });
      const resolvedLikes = await Promise.all(likes);
      setMyLikeList(resolvedLikes);
    } catch (error) {
      console.error("좋아요 리스트를 가져오는 중 오류가 발생했습니다.", error);
    }
  };

  const handleRadiusChange = (event) => {
    setRadius(event.target.value);
  };

  function coord2addr(lon, lat) {
    // 좌표 -> 주소 변환 객체 생성
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lon, lat, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        const newAddress = result[0].address.address_name;
        setMyLikeList(prevList => {
          if (!prevList.includes(newAddress)) {
            const newLike = {
              address: newAddress,
              lat: lat,
              lon: lon,
              selected: false
            };
            return [...prevList, newAddress];
          }
          return prevList;
        });
      }
    });
  }

  useEffect(() => {
    getMyLike();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행되도록 함

  const handleCheckboxChange = (event) => {
    const index = event.target.dataset.index;
    setMyLikeList((prevList) => {
      const updatedList = prevList.map((item, i) => {
        if (i === parseInt(index)) {
          return {
            ...item,
            selected: !item.selected,
          };
        }
        return item;
      });
      // console.log('업데이트:', updatedList);
      return updatedList;
    });
  };

  function handleSendToServer() {
    const selectedItems = myLikeList.filter((item) => item.selected);
  
    if (!selectedItems || selectedItems.length !== 2) {
      console.error("두 개의 항목을 선택해야 합니다.");
      return;
    }
  
    try {
      const newData = {
        ...postData,
        lat_1: selectedItems[0].lat,
        lon_1: selectedItems[0].lon,
        lat_2: selectedItems[1].lat,
        lon_2: selectedItems[1].lon,
      };

        // postData 업데이트 함수
  const updatedPostData = {
    ...postData,
    ...newData,
  };

  setPostData(updatedPostData);
  axios.post(globalurl+"facilities/extra", updatedPostData);
  console.log("데이터 전송 성공", updatedPostData);
  
  // 선택한 facilities_type 업데이트
  setSelectedFacilitiesType(updatedPostData.facilities_type);

      // 레이더 차트 화면으로 전환
      setChartVisible(true);
    } catch (error) {
      console.error("데이터 전송 중 오류 발생", error);
    }
  }

  const handleLabelToggle = (label) => {
    const updatedPostData = { ...postData };
    if (updatedPostData.labels.includes(label)) {
      updatedPostData.labels = updatedPostData.labels.filter((selectedLabel) => selectedLabel !== label);
    } else {
      updatedPostData.labels = [...updatedPostData.labels, label];
    }
    axios.post(globalurl+"facilities/extra/", updatedPostData)
      .then((response) => {
        console.log('데이터 업데이트 성공:', response.data);
      })
      .catch((error) => {
        console.error('데이터 업데이트 실패:', error);
      });
  
      setSelectedFacilitiesType(updatedPostData.facilities_type);
  };

  return (
      <div className="Mypage">
        {isChartVisible && (
      <RadarChart
      postData={postData}
      setPostData={setPostData}
      facilitiesType={selectedFacilitiesType} // facilitiesType을 props로 전달
      handleRadiusChange={handleRadiusChange}
    />
    )}
        <h4>내가 좋아요한 주소</h4>
        <ul>
          {myLikeList.map((like, index) => (
            <li key={index} style={{ textAlign: "left" }}>
              <label>
                <input
                  type="checkbox"
                  data-index={index} // 인덱스 정보를 data-index 속성으로 추가
                  checked={like.selected}
                  onChange={handleCheckboxChange}
                />
                <span>{like.address}</span>
                <br />
              </label>
            </li>
          ))}
        </ul>
        <div>
          <button onClick={handleSendToServer}>
            선택한 항목 서버로 전송
          </button>
        </div>
        <hr />
        <h4>내가 작성한 리뷰</h4>
        <ul>
          {myReview.map((review, index) => (
            <li
              key={`${review.created_at}-${index}`}
              style={{ textAlign: "left" }}
            >
              <span>{review.created_at}</span>
              <br />
              <span>{review.input_addr}</span>
              <br />
              <span>{review.content}</span>
            </li>
          ))}
        </ul>
        <hr />
        <button id="logout-btn" onClick={Logout}>
          로그아웃
        </button>
      </div>
    );
  }

export default MyPage;