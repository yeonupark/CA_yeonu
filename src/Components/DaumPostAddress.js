import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import '../Components/css/LeafletSearch.css';

const DaumPostAddress = ({address, setSearchLocal, setPopup}) => {


  const onCompletePost = (data) => {
    address =  data.address
    setSearchLocal(address);
    setPopup();
  };

  const postCodeStyle = {
    display: "block",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "350px",
    height: "350px",
    padding: "7px",
    zIndex: 100,
  };


  return (
    <div id="popup-open">
        <DaumPostcode
          style={postCodeStyle}
          onComplete={onCompletePost}
        />
    </div>
  );
};

export default DaumPostAddress;