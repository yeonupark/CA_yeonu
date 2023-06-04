import React, { useState, useContext } from "react";
import axios from "axios"
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import './css/Login.css';
import { LoginContext } from './LoginContext';
import { globalurl } from "../App";



export const Login = ({ onLogin }) => {

  // 아이디 정보 저장하기 위함 
  const { setLoggedInUser } = useContext(LoginContext);

  // 로그인
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  //회원가입
  const [nickname, setName] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [newemail, setNewEmail] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  Modal.setAppElement('#root');
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    overlay: {
      zIndex: 999999999999999999999 // 모달을 맨 위로 표시하기 위한 zIndex 값 설정
    },
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // 로그인 처리를 수행하는 코드
    // 유효성 검사, 인증 등을 수행 후 onLogin 콜백을 호출하여 로그인 상태 업데이트

    // 아이디 정보 저장하기 위함 
    const loggedInUserId = email;
    setLoggedInUser(loggedInUserId);

    // json 생성 {아이디, 패스워드}
    const loginData = { 'email': String(email), 'password': String(password) };
    //console.log(loginData)
    const loginData_json_tmp = JSON.stringify(loginData);
    const loginData_json = JSON.parse(loginData_json_tmp);
    console.log(loginData_json)

    const login_url = globalurl+"/accounts/login/"

    // 서버로 로그인 정보 post
    axios.post(login_url, loginData_json)
      .then(function (response) {
        closeModal();
        onLogin();
      })
      .catch(function (error) {
        alert('로그인에 실패하셨습니다.')
        console.error("Login failed:", error);
      })
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNewEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    // 회원가입 처리를 수행하는 코드

    // json 생성 {사용자 이름, 이메일}
    const signUpData = { 'email': String(newemail), 'password': String(newpassword), 'username': String(nickname) };
    //console.log(signUpData)
    const signUpData_json_tmp = JSON.stringify(signUpData);
    const signUpData_json = JSON.parse(signUpData_json_tmp);
    console.log(signUpData_json)

    const signup_url = globalurl+"accounts/signup/"

    // 서버로 회원가입 정보 post
    axios.post(signup_url, signUpData_json)
      .then(function (response) {
        alert('회원가입이 완료되었습니다.')
        closeModal();
      })
      .catch(function (error) {
        alert('회원가입에 실패하셨습니다.')
        console.error("SignUp failed:", error);
      })
  };
  return (
    <div id="login-modal">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} style={{ flexDirection: 'column' }}>
        <div id="input-area">
          <label>
            <FontAwesomeIcon icon={faUser} />
            <input className="login" type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder="아이디/이메일" />
          </label>
        </div>
        <div id="input-area">
          <label>
            <FontAwesomeIcon icon={faLock} />
            <input className="login" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="비밀번호" />
          </label>
        </div>
        <button id="login-btn" onSubmit={closeModal}>로그인</button>
        <span>
          다양한 기능을 이용하고 싶다면?
          <button onClick={openModal} id="signup-btn">회원가입</button>
        </span>
        {/* 회원가입 */}
        <Modal
          isOpen={modalIsOpen}
          ariaHideApp={false} // 추가된 부분
          portalClassName="modal-portal"
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal">
          <div id="signup-modal">
            <h2>회원가입</h2>
            <div id="input-area">
              <label id="mail-area">
                <FontAwesomeIcon icon={faEnvelope} />
                <input type="text" value={newemail} onChange={event => setNewEmail(event.target.value)} placeholder="이메일 주소" />
              </label>
            </div>
            <div id="input-area">
              <label>
                <FontAwesomeIcon icon={faUser} />
                <input type="text" value={nickname} onChange={event => setName(event.target.value)} placeholder="사용자 이름" />
              </label>
            </div>
            <div id="input-area">
              <label>
                <FontAwesomeIcon icon={faLock} />
                <input type="password" value={newpassword} onChange={event => setNewPassword(event.target.value)} placeholder="비밀번호" />
              </label>
            </div>
            <button id="login-btn" type="submit" onClick={handleSignUpSubmit}>가입</button>
          </div>
        </Modal>
      </form>
    </div>
  );
}

export default Login;