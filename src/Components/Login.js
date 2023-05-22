import React, { useState } from "react";
import axios from "axios"
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import './Login.css';


function Login({ onLogin }) {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    
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


    const handleSubmit = async (event) => {
        event.preventDefault();
        // 로그인 처리를 수행하는 코드
        // 유효성 검사, 인증 등을 수행 후 onLogin 콜백을 호출하여 로그인 상태 업데이트

        // json 생성 {아이디, 패스워드}
        const loginData = { 'email': String(email), 'password': String(password) };
        //console.log(loginData)
        const loginData_json_tmp = JSON.stringify(loginData);
        const loginData_json = JSON.parse(loginData_json_tmp);
        console.log(loginData_json)
        
        const login_url = "http://127.0.0.1:8000/accounts/login/"
        try {
            const response = await axios.post(login_url, loginData);
            // 로그인 성공 시 처리
            if (response.status >= 200 && response.status <= 204){
                closeModal(); // 모달을 닫음
                onLogin();
                // closeModal();
                console.log('로그인 성공')
            }
        } catch (error) {
            // 로그인 실패 시 처리
            //alert('로그인에 실패하셨습니다.')
            console.error("Login failed:", error);
        };
        // closeModal();

        // // 임시
        // if (email && password) {
        //     // 유효성 검사 통과
        //     onLogin();
        // }
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
        const signUpData = { 'email': String(newemail), 'password': String(newpassword), 'username': String(nickname)};
        //console.log(signUpData)
        const signUpData_json_tmp = JSON.stringify(signUpData);
        const signUpData_json = JSON.parse(signUpData_json_tmp);
        console.log(signUpData_json)

        const signup_url = "http://127.0.0.1:8000/accounts/signup/"
        
        try {
            const response = await axios.post(signup_url, signUpData_json);
            // 회원가입 성공 시 처리
            if (response.status >= 200 && response.status <= 204) {
                alert('회원가입이 완료되었습니다.')
                //closeSheet();
            }
            closeModal();
        } catch (error) {
            // 회원가입 실패 시 처리
            // if (error.response && error.response.status === 409 && error.response.data.message === '이미 가입된 이메일') {
            if (error.response && error.response.status === 409){
                alert('이미 가입된 이메일입니다.')
                //console.log('이미 가입된 이메일입니다.');
            } else {
                console.error("SignUp failed:", error);
                //alert('회원가입에 실패하셨습니다.')
            }
        };
        // // 임시
        // if (nickname && newemail) {
        //     console.log("회원가입이 완료되었습니다.")
        //     closeSheet();
        // };
    };

    return (
        <div id="login-modal">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} style={{ flexDirection: 'column' }}>
                <div id="input-area">
                    <label>
                      <FontAwesomeIcon icon={faUser} />
                      <input className="login" type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder="아이디/이메일"/>
                    </label>
                </div>
                <div id="input-area">
                    <label>
                    <FontAwesomeIcon icon={faLock} />
                      <input className="login" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="비밀번호"/>
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
                              <input type="text" value={newemail} onChange={event => setNewEmail(event.target.value)} placeholder="이메일 주소"/>
                            </label>
                          </div>
                          <div id="input-area">
                            <label>
                              <FontAwesomeIcon icon={faUser} />
                              <input type="text" value={nickname} onChange={event => setName(event.target.value)} placeholder="사용자 이름"/>
                            </label>
                          </div>
                          <div id="input-area">
                            <label>
                              <FontAwesomeIcon icon={faLock} />
                              <input type="password" value={newpassword} onChange={event => setNewPassword(event.target.value)} placeholder="비밀번호"/>
                            </label>
                          </div>
                          <button id="login-btn" type="submit" onClick={handleSignUpSubmit}>가입</button>
                        </div>
                      </Modal>
                    </form>
                  </div>
    );
};

export default Login;