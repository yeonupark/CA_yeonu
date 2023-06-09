import React, { useState, useEffect, useContext, useRef } from "react";
import Sheet from 'react-modal-sheet';
import './css/ResultSheet.css';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faChartSimple, faHeart } from "@fortawesome/free-solid-svg-icons";
import Review from "./Review";
import InfoSheet from "./InfoSheet";
import LoginContext from './LoginContext';
import { globalurl } from "../App";

const ResultSheet = ({ address, coords, location }) => {
    const [isOpen, setOpen] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [like, setLike] = useState(undefined);
    const [reviews, setReviews] = useState([]);
    const [showInfo, setShowInfo] = useState(true);
    const { loggedInUser } = useContext(LoginContext);
    const [scrollPosition, setScrollPosition] = useState(0);

    // const sheetContentRef = useRef(0);

    //바텀시트 핸들러(열기)
    const openSheet = () => {
        setOpen(true);
    }

    const handleReviewClick = () => {
        setShowReview(!showReview);
        fetchReviews();
        setShowInfo(false);
    };

    // 주소 세 파트로 나누어서 json으로 만들기
    const addressParts = address.split(' ');
    var province = addressParts[0]

    // 용인
    if (addressParts.length == 4){ // 용인

        var city = addressParts[1] + " " +  addressParts[2]
        var dong = addressParts[3]
    } else if (addressParts[1] == '') { // 세종
        console.log('서종')
        var city = null
        var dong = addressParts[2]
    } else {
        var city = addressParts[1]
        var dong = addressParts[2]
    }
    const address_json_tmp = JSON.stringify({ "province": province, "city": city, "dong": dong });
    const address_json = JSON.parse(address_json_tmp);

    //console.log(address_json)

    const fetchReviews = async () => {
        try {
            // 서버로 주소를 post하고, 응답으로 해당 주소의 리뷰 데이터를 가져옴
            const response = await axios.post(globalurl+"/accounts/precomment/", address_json);
            const fetchedReviews = response.data;
            setReviews(fetchedReviews);
            //console.log(response)
        } catch (error) {
            console.error('리뷰를 가져오는 중 오류가 발생했습니다.', error);
        }
    };

    const handleLikeClick = () => {
        setLike(!like);
    };

    const handleInfoClick = () => {
        //setShowInfo(false);
        setShowInfo(!showInfo);
        setShowReview(false);
    };

    const sendLikeRequest = async (isLike) => {
        try {
            const likeValue = isLike ? "True" : "False";
            const like_json_tmp = JSON.stringify({ lon: String(coords.lng), lat: String(coords.lat),  liked: likeValue, username: String(loggedInUser)});
            const like_json = JSON.parse(like_json_tmp);
            console.log(like_json);

            axios.post(globalurl+"/facilities/like/", like_json);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (like !== undefined) {
            sendLikeRequest(like);
        }
    }, [like]);

    const handleScroll = (event) => {
        const newPosition = event.target.scrollTop;
        setScrollPosition(newPosition);
      };
    
      const handleContinue = () => {
        const sheetContent = document.getElementById("sheet-content");
        if (sheetContent) {
          sheetContent.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });

        }
      };

    useEffect(() => {
        const savedPosition = localStorage.getItem("scrollPosition");
        const position = parseInt(savedPosition, 10) || 0;
        setScrollPosition(position);
        }, []);    

        //바텀시트 핸들러(닫기)
        const closeSheet = () => {
            setOpen(false);
            localStorage.setItem("scrollPosition", scrollPosition.toString());
        };


    return (
        <div>
            <Sheet isOpen={isOpen} onClose={closeSheet}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content id="sheet-content" onScroll={handleScroll}>
                        <div id="result-header">
                            <h4 >{address}</h4>
                            <button id="continue-btn" onClick={handleContinue}>이어보기</button>
                            <div>


                        </div>
                        </div>
                        <hr />
                        <p class="btn-section">
                                <button id="review-btn" onClick={handleReviewClick}><FontAwesomeIcon icon={faComments} style={{ color: showReview ? '#3B89FD' : '#c4c4c4' }} /></button>
                                <button id="dashboard-btn" onClick={handleInfoClick}><FontAwesomeIcon icon={faChartSimple} style={{ color: showInfo ? '#3B89FD' : '#c4c4c4' }}/></button>
                                <button id="like-btn" onClick={handleLikeClick} style={{ color: like ? 'red' : '#c4c4c4' }}>♥︎</button>
                        </p>

                        <div>{showInfo &&<InfoSheet address={address} location={location} />}</div>
                        <div id="review-container">{showReview && <Review address={address} reviews ={reviews}/>}</div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>

        </div>
    );
};

export default ResultSheet;