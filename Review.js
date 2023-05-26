import React, { useState } from "react";
import Sheet from 'react-modal-sheet';
import axios from "axios";
import ReviewUpdate from "./ReviewUpdate";

// 기존에 저장된 리뷰 서버로부터 불러오고, 서버에서 전달받은 리뷰 보여주는 컴포넌트
function Review({ address }) {

    const [reviews, setReviews] = useState([]);
    const [isOpen, setOpen] = useState(true);
    //바텀시트 핸들러(열기)
    const openSheet = () => {
        setOpen(true)
    }
    //바텀시트 핸들러(닫기)
    const closeSheet = () => {
        setOpen(false);
    };

    const address_json = JSON.stringify({ address })
    console.log(address)

    const fetchReviews = async () => {
        try {
            // 서버로 주소를 post하고, 응답으로 해당 주소의 리뷰 데이터를 가져옴
            const response = await axios.post(`http://`, address_json);
            const fetchedReviews = response.data;
            setReviews(fetchedReviews);
        } catch (error) {
            console.error('리뷰를 가져오는 중 오류가 발생했습니다.', error);
        }
    };

    return (
        <div>
            {/* 리뷰 바텀시트를 추가로 열지 않고 기존의 result 바텀시트를 활용하여 띄워주면 어떨지? */}
            <Sheet isOpen={isOpen} onClose={closeSheet}>
                <Sheet.Container >
                    <Sheet.Header />
                    <Sheet.Content>
                        <p2 >review</p2>
                        <hr />
                        <ReviewUpdate/>
                        <hr />
                        <ul>
                            {reviews.map((review) => (
                                <li key={review.date}>{review.date}
                                {review.id}
                                {review.content}</li>
                            ))}
                        </ul>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </div>
    );
}

export default Review;