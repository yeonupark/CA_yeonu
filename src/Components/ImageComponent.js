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
            {facility.facility === 'convenience' && facility.count > 0 && <img src={require('./assets/clock.png')} alt="convenience" />}
            {facility.facility === 'mart' && facility.count > 0 && <img src={require('./assets/shopping-bag.png')} alt="mart" />}
            {facility.facility === 'bus' && facility.count > 0 && <img src={require('./assets/bus.png')} alt="bus" />}
            {facility.facility === 'metro' && facility.count > 0 && <img src={require('./assets/subway.png')} alt="metro" />}
            {/* 시설이 없을 때 */}
            {hasNoFacility && <img src={require('./assets/out-of-stock.png')} alt="empty" />}
          </div>
        ))}
      </div>
    );
  }

export default ImageComponent;