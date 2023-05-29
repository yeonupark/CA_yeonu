import React, { useState } from "react";
import Sheet from 'react-modal-sheet';
import axios from "axios";

function InfoSheet({ places, address }) {

    const [isOpen, setOpen] = useState(true);
    //바텀시트 핸들러(열기)
    const openSheet = () => {
        setOpen(true)
    }
    //바텀시트 핸들러(닫기)
    const closeSheet = () => {
        setOpen(false);
    };

    console.log(places)
    return (
        <div>
            <Sheet isOpen={isOpen} onClose={closeSheet}>
                <Sheet.Container >
                    <Sheet.Header />
                    <Sheet.Content>
                        <h4 >{address}</h4>
                        <hr />
                        <h5>해쉬태그</h5>
                        <hr />
                        <h5>가장 가까운 편의시설</h5>
                        <hr />
                        <h5>어떤 편의시설이 가장 많을까?</h5>
                        <hr />
                        <h5>검색한 동네 주위 이런 편의시설이 있어요!</h5>
                        <ul>
                            {places.map((place) => (
                                <li key={place.name}>
                                {place.name}
                                
                                </li>
                            ))}
                        </ul>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </div>
    );
}

export default InfoSheet;