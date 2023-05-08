import React, { useState } from 'react';
import './DataCheckbox.css';
import axios from 'axios';


function DataCheckbox() {
    const [checkedItems, setCheckedItems] = useState({});
    
    const handleSubmit = (e) => {
    e.preventDefault();
    //체크된 값을 배열에 저장해 콘솔에 출력
    const checkedItemsArray = Object.keys(checkedItems).filter(key => checkedItems[key]).map(key => key);
    console.log(checkedItemsArray);
    axios.post("users", checkedItems)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleCheckboxChange = (event) => {
    const { name } = event.target;
    setCheckedItems({ ...checkedItems, [name]: !checkedItems[name] });
    console.log(name);
  };

  return (
  <form id="checkbox-container" onSubmit={handleSubmit}>
    <label for="filter1">편의점</label>
    <input type="checkbox" id="filter1" name="편의점" checked={checkedItems.filter1} onChange={handleCheckboxChange}/>
    <label for="filter2">버스</label>
    <input type="checkbox" id="filter2" name="버스" checked={checkedItems.filter2} onChange={handleCheckboxChange}/>
    <label for="filter3">지하철</label>
    <input type="checkbox" id="filter3" name="지하철" checked={checkedItems.filter3} onChange={handleCheckboxChange}/>
    <label for="filter4">커피숍</label>
    <input type="checkbox" id="filter4" name="커피숍" checked={checkedItems.filter4} onChange={handleCheckboxChange}/>
    <label for="filter5">공원</label>
    <input type="checkbox" id="filter5" name="공원" checked={checkedItems.filter5} onChange={handleCheckboxChange}/>
    <button id="submit-btn" type="submit">적용</button>
  </form>
  );
}

export default DataCheckbox;