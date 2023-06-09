import React, { useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from './LoginContext';
import { globalurl } from '../App';
import './css/ResultSheet.css';

// 새로 작성하는 리뷰를 서버에 post하는 컴포넌트
function ReviewUpdate({ address }) {

  const { loggedInUser } = useContext(LoginContext);
  const [reviewText, setReviewText] = useState('');

  const handleChange = (event) => {
    setReviewText(event.target.value);
  };
  // {주소, 텍스트, 풀주소, 아이디} json 생성 
  const addressParts = address.split(' ');

  // const fullAddress = addressParts[0] + " "+addressParts[1] + " "+addressParts[2];
  const review_json_tmp = JSON.stringify({ username: String(loggedInUser), province: String(addressParts[0]), district: String(addressParts[1]), dong: String(addressParts[2]), addr: String(address), content: String(reviewText)});
  const review_json = JSON.parse(review_json_tmp);

  const handleSubmit = async (event) => {
    if (reviewText === "") {
      return (
        alert("내용을 작성해주세요!")
      );
    }
    if (loggedInUser === null) {
      alert("리뷰를 작성하려면 로그인을 해주세요!")
      //새로고침 -> 로그인으로 돌아감
      window.location.reload()
    }
    event.preventDefault();
    // 서버로 {주소3, 텍스트, 풀주소, 아이디}를 post
    axios.post(globalurl+"/accounts/comment/", review_json)
      .then(function (response) {
        alert("리뷰가 등록되었습니다.");
      })
      .catch(function (error) {
        console.error("리뷰 작성 중 오류가 발생했습니다.", error);
        console.log(review_json);
      })
  };

  return (
    <div>
      <form id="review-upload-form" onSubmit={handleSubmit}>
        <textarea id="review-area" value={reviewText} onChange={handleChange} placeholder="리뷰를 자유롭게 남겨주세요!"></textarea>
        <button id="review-upload-btn" type="submit">작성</button>
      </form>
    </div>
  );
}

export default ReviewUpdate;