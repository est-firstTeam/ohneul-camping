import electricity from "../images/ico-electricity.svg";
import wifi from "../images/ico-wifi.svg";
import firewood from "../images/ico-firewood.svg";
import hotwater from "../images/ico-hotwater.svg";
import market from "../images/ico-market.svg";

const DetailFacility = ({ campData }) => {
  const amenitiesList = {
    전기: electricity,
    무선인터넷: wifi,
    장작판매: firewood,
    온수: hotwater,
    "마트.편의점": market,
  };

  // 편의시설 로직
  const amenities = campData?.sbrsCl ? campData.sbrsCl.split(",") : [];

  const availableAmenities = amenities.filter((item) => amenitiesList[item]); // 아이콘 표시할 항목
  const otherAmenities = amenities.filter((item) => !amenitiesList[item]);

  const transformedFacilities = otherAmenities?.length
    ? otherAmenities.map((item) => otherAmenities[item] || item).join(" | ")
    : "정보 없음";

  console.log(campData);

  return (
    <div className="detail__add-on-left">
      <div className="detail__add-on-left--container">
        <h3 className="detail__add-on-left--title-amenity">시설 / 환경</h3>
        <div className="detail__orange-box">
          <strong className="detail__orange-box--title">편의시설</strong>
          <div className="detail__orange-box--container">
            {availableAmenities.map((amenity, index) => (
              <div key={index} className="detail__orange-box--amenity">
                <img
                  src={amenitiesList[amenity]}
                  alt={amenity}
                  className="detail__amenity-icon"
                />
                {amenity}
              </div>
            ))}
          </div>
          {otherAmenities.length > 0 && (
            <p className="detail__orange-box--contents">
              추가 편의시설: {transformedFacilities}
            </p>
          )}
        </div>
      </div>
      {(campData.featureNm || campData.intro) && (
        <div className="detail__add-on-left--container-intro">
          <h3 className="detail__add-on-left--title-intro">소개</h3>
          <p className="detail__add-on-left--content">
            {campData.featureNm || campData.intro}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailFacility;
