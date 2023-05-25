import React, { useState } from "react";
import './MyPage.css';


function MyPage() {
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
        <button id="logout-btn" onClick={Logout}>
          로그아웃
        </button>
      </div>
    );
  }
  
  export default MyPage;