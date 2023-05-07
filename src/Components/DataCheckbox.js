import React, { useState } from "react";
import { Collapse, Checkbox } from "antd";

const { Panel } = Collapse;

function DataCheckbox(props) {
    //list로 값 전달
  
    const [Checked, setChecked] = useState([]);
  
    const handleToggle = (value) => {
      //누른 index 번호 확인
      const currentIndex = Checked.indexOf(value);
      //이미 눌러졌다면
      const newChecked = [...Checked];
  
      //눌러지지 않다면(항목은 총 1, 2, 3, 4를 가지는데 값이 없으면 indexOf가 -1로 표기)
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        //빼주고 state를 넣어준다
        //splice : 눌러진 index의 값이 지워짐
        newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked);
    };
  
    const renderCheckboxList = () =>
      props.list &&
      props.list.map((value, index) => (
        <React.Fragment key={index}>
          <Checkbox
            onChange={() => handleToggle(value._id)}
            type="checkbox"
            checked={Checked.indexOf(value._id) === -1 ? false : true}
          />
          <span>{value.name}</span>
        </React.Fragment>
      ));
  
    return (
      <div>
        <Collapse style={{ height: "100%", width: "500px", marginLeft: "14.8%" }}>
            {renderCheckboxList()}
        </Collapse>
      </div>
    );
  }
  
  export default DataCheckbox;