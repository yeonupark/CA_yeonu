import { MapContainer, TileLayer } from "react-leaflet";
import './App.css';
import React, { useState } from 'react';
import LeafletSearch from "./Components/LeafletSearch";
import Login from "./Components/Login";
import Modal from 'react-modal';
import './Components/Modal.css';


function App() {
  let subtitle;
  const initialPosition = [37.5978219540466, 127.065505630651];
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(true);
  //const [markerPosition, setMarkerPosition] = useState(null);

  const handleSearch = (coords) => {
    // 검색 결과를 처리하는 코드
    //setMarkerPosition(coords);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    alert('환영합니다!');
    closeModal();
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    overlay: {
      zIndex: 999999999999999999999 // 모달을 맨 위로 표시하기 위한 zIndex 값 설정
    },
  };

  function closeModal() {
    setIsOpen(false);
  }

  Modal.setAppElement('#root');

  return (
    <div className="App">
        {/* // 로그인 상태에 따른 컴포넌트 렌더링 */}
        <MapContainer center={initialPosition} zoom={17} className="map-container">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LeafletSearch id="search-container" onSearchCallback={handleSearch} setSearch={setSearch} />
        </MapContainer>
        <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false} // 추가된 부분
        portalClassName="modal-portal"
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal">
          <Login onLogin={handleLogin} />
      </Modal>
    </div>
  );
}

export default App;