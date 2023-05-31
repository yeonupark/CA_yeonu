import React, { useState } from "react";
import axios from "axios";
import './MyPage.css';


function MyPage({ myAddressList }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOpen, setOpen] = useState(true);
  const [myReview, setMyReview] = useState([]);
  //const [myLike, setMyLike] = useState([]);

  function Logout() {
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다!');
    closeSheet();
  }

  function closeSheet() {
    setOpen(false);
  }

  const getMyReview = async () => {
    try {
      // 서버로 __를 post하고, 응답으로 내가 작성한 주소의 리뷰 데이터를 가져옴
      const response = await axios.get(`http://127.0.0.1:8000/accounts/mycomment/`)
      //console.log(response);
      //const MyReviews = response.data;
      setMyReview(response.data);
    } catch (error) {
      console.error('리뷰를 가져오는 중 오류가 발생했습니다.', error);
    }
  };
  // const getMyLike = async () => {
  //   try {
  //     // 서버로 __를 post하고, 응답으로 내가 좋아요한 좌표 데이터를 가져옴
  //     const response = await axios.post(`http://`, _json);
  //     setMyLike(response.data);
  //   } catch (error) {
  //     console.error('리뷰를 가져오는 중 오류가 발생했습니다.', error);
  //   }
  // };


  return (
    <div className="Mypage">
      {/* <p2>좋아요 리스트</p2>
      <ul>
        {myAddressList.map((address) => (
          <li >{address}</li>
        ))}
      </ul> */}
      <button onClick={getMyReview}>내가 작성한 리뷰</button>
      <ul>
        {myReview.map((review, index) => (
          <li key={`${review.created_at}-${index}`} style={{ textAlign: 'left' }}>
            <span>{review.created_at}</span>
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