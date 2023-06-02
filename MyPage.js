import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import './css/MyPage.css';
import RadarChart from "./Radar";
import { LoginContext } from './LoginContext';

/* global kakao*/
function MyPage({ myAddressList }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOpen, setOpen] = useState(true);
  const [myReview, setMyReview] = useState([]);
  const { loggedInUser } = useContext(LoginContext);
  const [myLikeList, setMyLikeList] = useState([]);

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
      const response = await axios.post(`http://127.0.0.1:8000/accounts/mycomment/`, username_json);
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
      // 서버로 __를 post하고, 응답으로 내가 좋아요한 좌표 데이터를 가져옴
      const response = await axios.post(`http://127.0.0.1:8000/facilities/mylike/`, username_json);
      //setMyLikeCoords(response.data);
      response.data.forEach(coords => {
        coord2addr(coords.lon, coords.lat);
      });
    } catch (error) {
      console.error('좋아요 리스트를 가져오는 중 오류가 발생했습니다.', error);
    }

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

  return (
    <div className="Mypage">
      <h4>내가 좋아요한 주소</h4>
      <ul>
        {myLikeList.map((like) => (
          <li style={{ textAlign: 'left' }}>
            <span>{like}</span><br />
          </li>
        ))}
      </ul>
      <hr />
      <h4>내가 작성한 리뷰</h4>
      <ul>
        {myReview.map((review, index) => (
          <li key={`${review.created_at}-${index}`} style={{ textAlign: 'left' }}>
            <span>{review.created_at}</span><br />
            <span>{review.input_addr}</span><br />
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