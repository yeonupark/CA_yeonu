import './css/InfoSheet.css';

function ImageComponent({ topFacilities }) {
    const hasNoFacility = topFacilities.some((facility) => facility.count === 0);

    return (
      <div id="facility-list">
        {topFacilities.map((facility, index) => (
          <div key={index} id="facility-img">
            {facility.facility === 'cafe' && facility.count > 0 && <img src={require('./assets/cafe.png')} alt="cafe" />}
            {facility.facility === 'pharmacy' && facility.count > 0 && <img src={require('./assets/drugs.png')} alt="pharmacy" />}
            {facility.facility === 'hospital' && facility.count > 0 && <img src={require('./assets/hospital-building.png')} alt="hospital" />}
            {facility.facility === 'hair' && facility.count > 0 && <img src={require('./assets/hair-salon.png')} alt="hair" />}
            {facility.facility === 'gym' && facility.count > 0 && <img src={require('./assets/dumbbell.png')} alt="gym" />}
            {facility.facility === 'laundry' && facility.count > 0 && <img src={require('./assets/laundry-basket.png')} alt="laundry" />}
            {facility.facility === 'conveninence' && facility.count > 0 && <img src={require('./assets/clock.png')} alt="conveninence" />}
            {facility.facility === 'mart' && facility.count > 0 && <img src={require('./assets/shopping-bag.png')} alt="mart" />}
            {hasNoFacility && <img src={require('./assets/out-of-stock.png')} alt="empty" />}
            {/* 추가된 이미지 종류에 따라 위와 같이 추가적인 분기문을 작성합니다 */}
          </div>
        ))}
      </div>
    );
  }

export default ImageComponent;