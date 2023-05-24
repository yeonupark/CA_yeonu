import React, { useState } from "react";
import Sheet from 'react-modal-sheet';

function Review({ address }) {
    const [isOpen, setOpen] = useState(true);

    //바텀시트 핸들러(열기)
    const openSheet = () => {
        setOpen(true)
    }

    //바텀시트 핸들러(닫기)
    const closeSheet = () => {
        setOpen(false);
    };

    return (
        <div>
            <Sheet isOpen={isOpen} onClose={closeSheet}>
                <Sheet.Container >
                    <Sheet.Header />
                    <Sheet.Content>
                        <p2 >{address}</p2>
                        <hr />
                        <p>
                            <form className="leaflet-bar-part leaflet-bar-part-single" >
                                <input
                                    className="leaflet-search-control form-control"
                                    type="text"
                                    placeholder="리뷰를 자유롭게 남겨주세요!"
                                    // style={{
                                    //     border: "1px solid black", // 테두리 스타일 설정
                                    //     borderRadius: "4px", // 테두리의 모서리를 둥글게 설정
                                    //     padding: "8px", // 입력 필드의 안쪽 여백 설정
                                    //   }}
                                /><button>작성</button></form>

                        </p>

                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>

        </div>
    );

}

export default Review;