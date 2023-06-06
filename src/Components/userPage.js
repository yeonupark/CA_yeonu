import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import './css/userPage.css';
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
  const [visible, setVisible] = useState(true);

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
      const response = await axios.post(globalurl+"/accounts/mycomment/", username_json);
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
        globalurl+"/facilities/mylike/",
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
      alert("두 개의 항목을 선택해야 합니다.");
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
  axios.post(globalurl+"/facilities/extra/", updatedPostData);
  console.log("데이터 전송 성공", updatedPostData);
  
  // 선택한 facilities_type 업데이트
  setSelectedFacilitiesType(updatedPostData.facilities_type);

      // 레이더 차트 화면으로 전환
      setChartVisible(true);
      setVisible(false);
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
    axios.post(globalurl+"/facilities/extra/", updatedPostData)
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
          <div>
      <RadarChart
      postData={postData}
      setPostData={setPostData}
      facilitiesType={selectedFacilitiesType} // facilitiesType을 props로 전달
      handleRadiusChange={handleRadiusChange}
    />
            <ul id="mylike-list">
          {myLikeList.map((like, index) => (
            <li key={index} style={{ textAlign: "left" }}>
              <label>
      {like.selected && (
        <span>
          <span>{like.address}</span>
          <span id="clicked-index"
          style={{ color: myLikeList.filter((item) => item.selected).indexOf(like) === 0 ? "rgba(75,192,192,1)" : "rgba(255,99,132,1)" }}>
            <span>Location </span>
            {myLikeList.filter((item) => item.selected).indexOf(like) + 1}
          </span>
        </span>
      )}
                <br />
              </label>
            </li>
          ))}
        </ul>
    </div>
    )}
    {visible && (
    <div id="mylike-list-title">
      <h4>내가 좋아요한 주소</h4>
      <p>* 비교하고 싶은 주소를 선택하세요</p>
      <ul id="mylike-list">
          {myLikeList.map((like, index) => (
            <li
              key={index}
              style={{
                textAlign: "left",
                backgroundColor: like.selected ? "rgba(0, 128, 255, 0.5)" : "transparent",
                color: like.selected ? "white" : "inherit",
              }}
            >
              <label>
                <input
                  type="checkbox"
                  data-index={index}
                  checked={like.selected}
                  onChange={handleCheckboxChange}
                  id="mylike-list-checkbox"
                />
                <span>{like.address}</span>
                {/* <span id="clicked-index">
                  {like.selected ? myLikeList.filter((item) => item.selected).indexOf(like) + 1 : ""}
                </span> */}
                <br />
              </label>
            </li>
          ))}
        </ul>
        <div id="myreview-list-title">
          <button id="seemore-btn" onClick={handleSendToServer}>
            비교하기
          </button>
        </div>
        <hr id="sections"/>
        <h4>내가 작성한 리뷰</h4>
        <ul id="myreview-list">
          {myReview.map((review, index) => (
            <li
              key={`${review.created_at}-${index}`}
              style={{ textAlign: "left" }}
              id="myreview"
            >
              <p id="review-addr">{review.input_addr}</p>
              <p id="review-content">{review.content}</p>
              <p id="review-created-at">{review.created_at}</p>
              <hr/>
            </li>
          ))}
        </ul>
        </div>)}
        <hr id="sections"/>
        <div id="logout-section">
        <button id="logout-btn" onClick={Logout}>
          로그아웃
        </button>
        </div>
      </div>
    );
  }

export default MyPage;