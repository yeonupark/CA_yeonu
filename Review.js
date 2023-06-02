import React, { useState } from "react";
//import Sheet from 'react-modal-sheet';
//import axios from "axios";
import ReviewUpdate from "./ReviewUpdate";

// 기존에 저장된 리뷰 서버로부터 불러오고, 서버에서 전달받은 리뷰 보여주는 컴포넌트
function Review({ address, reviews }) {
    //console.log(reviews);

    const showReview = () => {
        if (reviews) {
            return (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.created_at} style={{ textAlign: "left" }}>
                            <span>{review.username_comment}</span><br/>
                            <span>{review.created_at}</span><br />
                            <span>{review.content}</span>
                        </li>
                    ))}
                </ul>
            )
        }
    }

    return (
        <div>
            <h5 >review</h5>
            <hr />
            <ReviewUpdate address={address} />
            <hr />
            {showReview()}
        </div>
    );
}

export default Review;