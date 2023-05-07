import Sheet from 'react-modal-sheet';
import { useState } from 'react';
import './BottomSheet.css';
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BottomSheet() {
  const [isOpen, setOpen] = useState(false);
  const openSheet = () => {
    setOpen(true)
  }



  return (
    <>
      <button id="filter-btn" onClick={openSheet}><FontAwesomeIcon icon={faFilter}/></button>
      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="filter-contents">
              <p> 검색하고 싶은 편의시설을 모두 선택해주세요! </p>
              <div className="checkbox-container">
                <input type="checkbox" value="편의점"/>
                <input type="checkbox" value="버스정류장"/>
                <input type="checkbox" value="지하철역"/>
                <input type="checkbox" value="커피숍"/>
                <input type="checkbox" value="공원"/>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
}

export default BottomSheet;