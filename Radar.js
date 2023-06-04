import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement } from 'chart.js';
import { globalurl } from "../App";

Chart.register(RadialLinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

const RadarChart = ({ postData, setPostData, facilitiesType }) => {
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedFacilitiesType, setSelectedFacilitiesType] = useState(facilitiesType);
  const [radius, setRadius] = useState('');
  const [chartData, setChartData] = useState(null); // chartData 상태 추가

  const generateChartData = (data) => {
    const { location_1, location_2 } = data;
    const location1Data = location_1.score.individual_score;
    const location2Data = location_2.score.individual_score;
    

    //차트 데이터
    const chartData = {
      labels: selectedLabels,
      datasets: [
        {
          label: 'Location 1',
          data: Object.values(location1Data),
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: 'rgba(75,192,192,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75,192,192,1)',
        },
        {
          label: 'Location 2',
          data: Object.values(location2Data),
          backgroundColor: 'rgba(255,99,132,0.4)',
          borderColor: 'rgba(255,99,132,1)',
          pointBackgroundColor: 'rgba(255,99,132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,1)',
        },
      ],
    };
  
    return chartData;
  };
  

  const handleRadiusChange = async (event) => {
    const selectedRadius = event.target.value;
  
    const updatedData = {
      ...postData,
      radius: selectedRadius,
    };
  
    setRadius(selectedRadius);
    setPostData(updatedData);
  
    try {
      const response = await axios.post(globalurl, updatedData);
      console.log("데이터 전송 성공", response.data);
      const data = response.data; // 받아온 데이터
      const chartData = generateChartData(data); // 차트 데이터 생성
      setChartData(chartData); // 차트 데이터 설정
    } catch (error) {
      console.error("데이터 전송 중 오류 발생", error);
    }
  };

  const handleLabelToggle = async (label) => {
    let updatedLabels = [];
  
    if (selectedLabels.includes(label)) {
      updatedLabels = selectedLabels.filter((selectedLabel) => selectedLabel !== label);
    } else {
      updatedLabels = [...selectedLabels, label];
    }
  
    setSelectedLabels(updatedLabels);
    await updatePostData(updatedLabels);
  
    try {
      const updatedData = {
        ...postData,
        facilities_type: updatedLabels.join(', '), // Join the array values with a comma
      };
  
      const response = await axios.post(globalurl, updatedData);
      console.log("데이터 전송 성공", response.data);
      const data = response.data; // 받아온 데이터
      const chartData = generateChartData(data); // 차트 데이터 생성
      setChartData(chartData); // 차트 데이터 설정
    } catch (error) {
      console.error("데이터 전송 중 오류 발생", error);
    }
  };
  
  const updatePostData = async (updatedLabels) => {
    const updatedData = {
      ...postData,
      facilities_type: updatedLabels.join(','), // Join the array values with a comma
    };
    console.log('json:', updatedData);
    setPostData(updatedData);
  };

  useEffect(() => {
    const updatedPostData = { ...postData, facilities_type: facilitiesType };
    setPostData(updatedPostData);
  }, [facilitiesType]);

  const options = {
    scales: {
      r: {
        circular: true,
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };


  // // 선택한 체크박스 수에 따라 차트 컴포넌트 변경
  // const ChartComponent = selectedLabels.length <= 2 ? Bar : Radar;

  return (
    <div>
    <div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('pharmacy')} onChange={() => handleLabelToggle('pharmacy')} />
          약국
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('hospital')} onChange={() => handleLabelToggle('hospital')} />
          병원
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('cafe')} onChange={() => handleLabelToggle('cafe')} />
          항목3
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('gym')} onChange={() => handleLabelToggle('gym')} />
          항목4
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('hair')} onChange={() => handleLabelToggle('hair')} />
          항목5
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('mart')} onChange={() => handleLabelToggle('mart')} />
          항목6
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('convenience')} onChange={() => handleLabelToggle('convenience')} />
          항목7
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('laundry')} onChange={() => handleLabelToggle('laundry')} />
          항목8
        </label>
      </div>
      <div>
        <select value={radius} onChange={handleRadiusChange}>
          <option value="">반경 선택</option>
          <option value="100">100m</option>
          <option value="200">200m</option>
          <option value="500">500m</option>
        </select>
      </div>
    <div>
      {chartData && <Radar data={chartData} options={options} />}
    </div>
    </div>
    </div>
  );
};

export default RadarChart;