import React, { useState } from 'react';
import './DataCheckbox.css';
import axios from 'axios';

function DataCheckbox() {
    const [checkedItems, setCheckedItems] = useState({});
    const [radius, setRadius] = useState('');
    const [facilities, setFacilities] = useState(['pharmacy', 'cafe', 'hospital','mart','gym','busStation']);

    //체크박스 변경 핸들러
    const handleFacilityChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;
        // 새로운 facilities 배열을 만들어서 state 업데이트
        if (checked) {
            setFacilities([...facilities, value]);
        } else {
            setFacilities(facilities.filter((facility) => facility !== value));
        }
    }
    
//     const handleSubmit = (e) => {
//     e.preventDefault();
//     //체크된 값을 배열에 저장해 콘솔에 출력
//     const checkedItemsArray = Object.keys(checkedItems).filter(key => checkedItems[key]).map(key => key);
//     console.log(checkedItemsArray);
//     axios.post("users", checkedItems)
//       .then(response => {
//         console.log(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error!', error);
//       });
//   };

//   const handleCheckboxChange = (event) => {
//     const { name } = event.target;
//     setCheckedItems({ ...checkedItems, [name]: !checkedItems[name] });
//     console.log(name);
//   };

  return (
  <form id="checkbox-container" onSubmit={(e) => e.preventDefault()}>
    <div id="options-container">
        <label htmlFor="filter1">
            <input type="checkbox" id="filter1" checked={facilities.includes('pharmacy')} onChange={handleFacilityChange}/>
            <span>약국</span>
        </label>
        <label htmlFor="filter2">
            <input type="checkbox" id="filter2" name="버스" checked={checkedItems.filter2} onChange={handleFacilityChange}/>
            <span>버스</span>
        </label>
        <label htmlFor="filter3">
            <input type="checkbox" id="filter3" name="버스" checked={checkedItems.filter3} onChange={handleFacilityChange}/>
            <span>지하철</span>
        </label>
        <label htmlFor="filter4">
            <input type="checkbox" id="filter4" name="버스" checked={checkedItems.filter4} onChange={handleFacilityChange}/>
            <span>커피숍</span>
        </label>
        <label htmlFor="filter5">
            <input type="checkbox" id="filter5" name="공원" checked={checkedItems.filter5} onChange={handleFacilityChange}/>
            <span>공원</span>
        </label>
        </div>
        <button id="submit-btn" type="submit">적용</button>
  </form>
  );
}

export default DataCheckbox;