import React, { useState } from "react";
import Sheet from 'react-modal-sheet';
import './ResultSheet.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faChartSimple, faHeart } from "@fortawesome/free-solid-svg-icons";
import Review from "./Review";
import MyPage from './MyPage';

const ResultSheet = ({ address, fullAddress} ) => {
    const [isOpen, setOpen] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [like,setLike] = useState(false);
    // 마이페이지에 전달할 좋아요 리스트
    const [myAddressList, setMyAddressList] = useState([]);


    //바텀시트 핸들러(열기)
    const openSheet = () => {
        setOpen(true);
    }
    //바텀시트 핸들러(닫기)
    const closeSheet = () => {
        setOpen(false);
    };
        
    const handleReviewClick = () => {
        setShowReview(!showReview);
    };

    const handleLikeClick = () => {
        setLike(!like);
        const isLiked = myAddressList.includes(fullAddress);

        if (isLiked) {
            // 좋아요 취소
            const updatedList = myAddressList.filter((item) => item !== fullAddress);
            setMyAddressList(updatedList);
          } else {
            // 좋아요 추가
            const updatedList = [...myAddressList, fullAddress];
            setMyAddressList(updatedList);
          }
    };
    
    return (
        <div>
            <Sheet isOpen={isOpen} onClose={closeSheet}>
                <Sheet.Container >
                    <Sheet.Header />
                    <Sheet.Content>
                        <h4 >{address}</h4>
                        <hr />
                        <div id="result-btn-container">
                            <span> </span>
                            <button id="like-btn" onClick={handleLikeClick} style={{ color: like ? 'red' : '#c4c4c4' }}>♥︎</button>
                            <button id="dashboard-btn"><FontAwesomeIcon icon={faChartSimple} /></button>
                            <button id="review-btn" onClick={handleReviewClick}><FontAwesomeIcon icon={faComments} /></button>
                        </div>
                        <div id="review-upload-container">
                            {showReview && <Review address={address}/>}
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
            
        </div>
    );
};

export default ResultSheet;