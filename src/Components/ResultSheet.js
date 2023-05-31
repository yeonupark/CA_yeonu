import React, { useState } from "react";
import Sheet from 'react-modal-sheet';
import './ResultSheet.css';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faChartSimple, faHeart } from "@fortawesome/free-solid-svg-icons";
import Review from "./Review";
// import MyPage from './MyPage';
import InfoSheet from "./InfoSheet";

const ResultSheet = ({ address, coords, location} ) => {
    const [isOpen, setOpen] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [like, setLike] = useState(undefined);
    const [showInfo, setShowInfo] = useState(false);


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
    };

    const handleInfoClick = () => {
        //setShowInfo(false);
        setShowInfo(!showInfo);
    };

    const sendLikeRequest = async (isLike) => {
        try {
            //const likeValue = isLike ? true : false;
            const like_json = { lon: coords.lng, lat: coords.lat, like: like };
            console.log(like_json);

            const url = 'http://';
            const response = await axios.post(url, { like_json });

            if (isLike) {
                //alert("찜 목록에 등록되었습니다.");
            } else {
                //alert("찜 목록에서 삭제되었습니다.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (like !== undefined) {
            sendLikeRequest(like);
        }
    }, [like]);
    
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
                            <button id="dashboard-btn" onClick={handleInfoClick}><FontAwesomeIcon icon={faChartSimple} /></button>
                            <button id="review-btn" onClick={handleReviewClick}><FontAwesomeIcon icon={faComments} /></button>
                        </div>
                        <div id="review-upload-container">
                            {showReview && <Review address={address}/>}
                        </div>
                        <div>
                            {showInfo && <InfoSheet address={address} location={location} />}
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
            
        </div>
    );
};

export default ResultSheet;