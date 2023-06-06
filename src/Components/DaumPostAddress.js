import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";

const DaumPostAddress = ({address, setSearchLocal, setPopup}) => {


  const onCompletePost = (data) => {
    address =  data.address
    setSearchLocal(address);
    setPopup();
  };

  // const postCodeStyle = {
   
  //   display: "block",
  //   position: "absolute",
  //   top: "20%",
  //   width: "400px",
  //   height: "400px",
  //   padding: "7px",
  //   zIndex: 100, 
  // };

  return (
    <>
        <DaumPostcode
          // style={postCodeStyle}
          onComplete={onCompletePost}
        />
    </>
  );
};

export default DaumPostAddress;