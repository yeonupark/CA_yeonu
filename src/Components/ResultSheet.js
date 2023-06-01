import React, { useState, useEffect } from "react";
import Sheet from 'react-modal-sheet';
import './css/ResultSheet.css';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faChartSimple, faHeart } from "@fortawesome/free-solid-svg-icons";
import Review from "./Review";
// import MyPage from './MyPage';
import InfoSheet from "./InfoSheet";

const ResultSheet = ({ address, coords, location }) => {
    const [isOpen, setOpen] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [like, setLike] = useState(undefined);
    const [reviews, setReviews] = useState([]);
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
        fetchReviews();
    };

    // 주소 세 파트로 나누어서 json으로 만들기
    const addressParts = address.split(' ');
    const seoul = (addressParts[0]+"특별시");
    const address_json_tmp = JSON.stringify({ "province": seoul, "city": addressParts[1], "dong": addressParts[2] });
    const address_json = JSON.parse(address_json_tmp);
    //console.log(address_json)

    const fetchReviews = async () => {
        try {
            // 서버로 주소를 post하고, 응답으로 해당 주소의 리뷰 데이터를 가져옴
            const response = await axios.post('http://127.0.0.1:8000/accounts/precomment/', address_json);
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
    };

    const sendLikeRequest = async (isLike) => {
        try {
            //const likeValue = isLike ? true : false;
            const like_json = { lon: coords.lng, lat: coords.lat};
            console.log(like_json);

            axios.post('http://127.0.0.1:8000/facilities/like/', like_json );
            // if (isLike) {
            //     //alert("찜 목록에 등록되었습니다.");
            // } else {
            //     //alert("찜 목록에서 삭제되었습니다.");
            // }
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
                        <div>{showReview && <Review address={address} reviews ={reviews}/>}</div>
                        <div>{showInfo && <InfoSheet address={address} location={location} />}</div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>

        </div>
    );
};

export default ResultSheet;