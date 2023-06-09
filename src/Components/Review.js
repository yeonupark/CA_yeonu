import React, { useState } from "react";
import ReviewUpdate from "./ReviewUpdate";
import './css/ResultSheet.css';

// 기존에 저장된 리뷰 서버로부터 불러오고, 서버에서 전달받은 리뷰 보여주는 컴포넌트
function Review({ address, reviews }) {
    const showReview = () => {
        if (reviews) {
            return (
                <ul id="review-list">
                    <div>
                    {reviews.map((review) => (
                        <li key={review.created_at} style={{ textAlign: "left" }}>
                            <p id="review-username">{review.username_comment}</p>
                            <p id="review-content">{review.content}</p>
                            <p id="review-created-at">{review.created_at}</p>
                            <hr/>
                        </li>
                    ))}    
                    </div>
                </ul>
            )
        }
    }

    return (
        <div>
            {/* <h5 >review</h5> */}
            {/* <hr /> */}
            <ReviewUpdate address={address} />
            <hr />
            {showReview()}
        </div>
    );
}

export default Review;