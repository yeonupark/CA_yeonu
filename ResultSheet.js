import React, { useState } from "react";
import Sheet from 'react-modal-sheet';
import './ResultSheet.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faChartSimple, faHeart } from "@fortawesome/free-solid-svg-icons";
import Review from "./Review";

const ResultSheet = ({ address} ) => {
    const [isOpen, setOpen] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [like,setLike] = useState(false);

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
                            <button><FontAwesomeIcon icon={faChartSimple} /></button>
                            <button onClick={handleLikeClick} style={{ color: like ? 'red' : 'black' }}>♥︎</button>
                        </p>
                        <div>{showReview && <Review address={address}/>}</div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
            
        </div>
    );
};

export default ResultSheet;