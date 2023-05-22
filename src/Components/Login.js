import React, { useState } from "react";
import axios from "axios"
import Sheet from 'react-modal-sheet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import './Login.css';


function Login({ onLogin }) {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    
    const [nickname, setName] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [newemail, setNewEmail] = useState("");

    const [isOpen, setOpen] = useState(false);


    //바텀시트 핸들러(열기)
    const openSheet = () => {
        setOpen(true)
    }
    //바텀시트 핸들러(닫기)
    const closeSheet = () => {
        setOpen(false);
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

        // json 생성 {아이디, 패스워드}
        const loginData = { 'email': String(email), 'password': String(password) };
        //console.log(loginData)
        const loginData_json_tmp = JSON.stringify(loginData);
        const loginData_json = JSON.parse(loginData_json_tmp);
        console.log(loginData_json)
        
        const login_url = "http://www.127.0.0.1:8000/accounts/login/"
        try {
            const response = await axios.post(login_url, loginData);
            // 로그인 성공 시 처리
            if (response.status >= 200 && response.status <= 204){
                onLogin();
            }
        } catch (error) {
            // 로그인 실패 시 처리
            //alert('로그인에 실패하셨습니다.')
            console.error("Login failed:", error);
        };

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
            closeSheet();
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
                      <input className="login" type="text" value={email} onChange={handleEmailChange} placeholder="아이디/이메일"/>
                    </label>
                </div>
                <div id="input-area">
                    <label>
                    <FontAwesomeIcon icon={faLock} />
                      <input className="login" type="password" value={password} onChange={handlePasswordChange} placeholder="비밀번호"/>
                    </label>
                </div>
                <button id="login-btn" type="submit">로그인</button>
                <span>다양한 기능을 이용하고 싶다면?
                    <button onClick={openSheet} id="signup-btn">회원가입</button>
                    {/* 회원가입 */}
                    <Sheet isOpen={isOpen} onClose={closeSheet}>
                        <Sheet.Container>
                            <Sheet.Header />
                            <Sheet.Content>
                                <div>
                                    <label>Email:</label>
                                    <input type="text" value={newemail} onChange={handleNewEmailChange} />
                                </div>
                                <div>
                                    <label>Nickname:</label>
                                    <input type="text" value={nickname} onChange={handleNameChange} />
                                </div>
                                <div>
                                    <label>Password:</label>
                                    <input type="password" value={newpassword} onChange={handleNewPasswordChange}/>
                                </div>
                                <button type="submit" onClick={handleSignUpSubmit}>SIGN UP</button>
                            </Sheet.Content>
                        </Sheet.Container>
                        <Sheet.Backdrop />
                    </Sheet>
                </span>
            </form>
        </div>
    );
};

export default Login;