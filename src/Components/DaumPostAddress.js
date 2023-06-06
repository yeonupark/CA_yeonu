import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import '../Components/css/LeafletSearch.css';

const DaumPostAddress = ({address, setSearchLocal, setPopup}) => {


  const onCompletePost = (data) => {
    address =  data.address
    setSearchLocal(address);
    setPopup();
  };

  return (
    <div id="popup-open">
        <DaumPostcode
          onComplete={onCompletePost}
        />
    </div>
  );
};

export default DaumPostAddress;