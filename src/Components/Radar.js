import React, {useState} from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(RadialLinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

const RadarChart = () => {
  const [selectedLabels, setSelectedLabels] = useState([]);

  const handleLabelToggle = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((selectedLabel) => selectedLabel !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const data = {
    labels: selectedLabels,
    datasets: [
      {
        label: '데이터',
        data: [3, 5, 2, 7, 4, 6, 8, 1, 9],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75,192,192,1)',
        
      },
    ],
  };

  const options = {
    scales: {
      r: {
        circular: true,
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
  };

  return (
    <div>
    <div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('항목1')} onChange={() => handleLabelToggle('항목1')} />
          항목1
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('항목2')} onChange={() => handleLabelToggle('항목2')} />
          항목2
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('항목3')} onChange={() => handleLabelToggle('항목3')} />
          항목3
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('항목4')} onChange={() => handleLabelToggle('항목4')} />
          항목4
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('항목5')} onChange={() => handleLabelToggle('항목5')} />
          항목5
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('항목6')} onChange={() => handleLabelToggle('항목6')} />
          항목6
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('항목7')} onChange={() => handleLabelToggle('항목7')} />
          항목7
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={selectedLabels.includes('항목8')} onChange={() => handleLabelToggle('항목8')} />
          항목8
        </label>
      </div>
    <div>
      <Radar data={data} options={options}/>
    </div>
    </div>
    </div>
  );
};

export default RadarChart;