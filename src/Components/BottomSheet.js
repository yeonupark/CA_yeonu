import Sheet from 'react-modal-sheet';
import { useState } from 'react';
import DataCheckbox from './DataCheckbox';
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
                <DataCheckbox/>
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