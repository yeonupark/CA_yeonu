import React, { createContext, useState } from 'react';

// 아이디 정보 저장하기 위한 코드
// 리뷰 작성 시 아이디 저장해서 넘겨줘야 하기 때문에 필요

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <LoginContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;