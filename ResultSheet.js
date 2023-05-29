import React, { useState, useEffect } from "react";
import Sheet from 'react-modal-sheet';
import './ResultSheet.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faChartSimple, faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Review from "./Review";
import MyPage from './MyPage';
import InfoSheet from "./InfoSheet";

const ResultSheet = ({ address, coords, places }) => {
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
                        <p>
                            <span> </span>
                            <button onClick={handleReviewClick}><FontAwesomeIcon icon={faComments} /></button>
                            <button onClick={handleInfoClick}><FontAwesomeIcon icon={faChartSimple} /></button>
                            <button onClick={handleLikeClick} style={{ color: like ? 'red' : 'black' }}>♥︎</button>
                        </p>
                        <div>{showReview && <Review address={address} />}</div>
                        <div>{showInfo && <InfoSheet address={address} places={places} />}</div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>

        </div>
    );
};

export default ResultSheet;