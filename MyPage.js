import React, { useState } from "react";
import './MyPage.css';


function MyPage({ myAddressList }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOpen, setOpen] = useState(true);

  function Logout() {
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다!');
    closeSheet();
  }

  function closeSheet() {
    setOpen(false);
  }

  return (
    <div className="Mypage">
      <p2>좋아요 리스트</p2>
      <ul>
        {myAddressList.map((address) => (
          <li >{address}</li>
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