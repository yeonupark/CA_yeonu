import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Radar, Line} from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
// import './css/InfoSheet.css';

Chart.register(RadialLinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(Filler);

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
          fill: true, // 도형을 채움
          backgroundColor: 'rgba(75,192,192,0.4)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75,192,192,1)',
          borderWidth: 0, // 선의 두께를 0으로 설정하여 표시하지 않음
          pointRadius: 0, // 점의 반지름을 0으로 설정하여 표시하지 않음
        },
        {
          label: 'Location 2',
          data: Object.values(location2Data),
          fill: true, // 도형을 채움
          backgroundColor: 'rgba(255,99,132,0.4)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,1)',
          borderWidth: 0, // 선의 두께를 0으로 설정하여 표시하지 않음
          pointRadius: 0, // 점의 반지름을 0으로 설정하여 표시하지 않음
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
      const response = await axios.post("http://127.0.0.1:8000/facilities/extra/", updatedData);
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
  
      const response = await axios.post("http://127.0.0.1:8000/facilities/extra/", updatedData);
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
    elements: {
      line: {
        fill: true, // 도형을 채우기 위해 fill 속성을 true로 설정
      }
  }
};

  return (
    <div>
    <div>
      <div>
      <div id="chart">
      {chartData && <Radar data={chartData} options={options} />}
    </div>
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
          카페
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('gym')} onChange={() => handleLabelToggle('gym')} />
          운동시설
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('hair')} onChange={() => handleLabelToggle('hair')} />
          미용실
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('mart')} onChange={() => handleLabelToggle('mart')} />
          마트
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('convenience')} onChange={() => handleLabelToggle('convenience')} />
          편의점
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('laundry')} onChange={() => handleLabelToggle('laundry')} />
          빨래방
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('bus')} onChange={() => handleLabelToggle('bus')} />
          버스
        </label>
      </div>
      <div>
        <select value={radius} onChange={handleRadiusChange}>
          <option value="">반경 선택</option>
          <option value="100">100m</option>
          <option value="200">200m</option>
          <option value="500">500m</option>
          <option value="1000">1km</option>
        </select>
      </div>
    </div>
    </div>
  );
};

export default RadarChart;