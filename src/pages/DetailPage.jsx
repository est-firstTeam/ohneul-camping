import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import calico from "../images/ico-calendar.svg";
import siteico from "../images/ico-vector.svg";
import addCart from "../images/ico-addCart.svg";
import electricity from "../images/ico-electricity.svg";
import wifi from "../images/ico-wifi.svg";
import firewood from "../images/ico-firewood.svg";
import hotwater from "../images/ico-hotwater.svg";
import market from "../images/ico-market.svg";
import Topbtn from "../components/Topbtn";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDB } from "../firebaseConfig";
import DateModal from "../components/DateModal";
import Modal from "../components/Modal";

const DetailPage = () => {
  const [campData, setCampData] = useState(null);

  const amenitiesList = {
    전기: electricity,
    무선인터넷: wifi,
    장작판매: firewood,
    온수: hotwater,
    "마트.편의점": market,
  };
  // Su6apREz2GLEjgcTkDIO
  // HWzTgJgnZuHASpY4ieSN
  // CI9V5SMf5syvcG5C1FcX
  // 0ulQOFs1GxdfP03W3Jjh
  // 316ILoySnKCJLmjHrpuH
  // 6sZNSRaIkC2O6OZULMQO
  useEffect(() => {
    const fetchCampData = async () => {
      try {
        const docRef = doc(firebaseDB, "Campsite", "HWzTgJgnZuHASpY4ieSN");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCampData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchCampData();
  }, []);

  const amenities = campData?.sbrsCl ? campData.sbrsCl.split(",") : [];

  const availableAmenities = amenities.filter((item) => amenitiesList[item]); // 아이콘 표시할 항목
  const otherAmenities = amenities.filter((item) => !amenitiesList[item]);

  const transformedFacilities = otherAmenities?.length
    ? otherAmenities.map((item) => otherAmenities[item] || item).join(" | ")
    : "정보 없음";

  const dateModal = useRef(null); // 날짜 및 일정 모달 관리
  // 날짜 및 일정 모달 열기
  const openDateModal = () => {
    if (dateModal.current) {
      dateModal.current.showModal();
    }
  };

  return (
    <section className="detail">
      <div>
        {campData ? (
          <div>
            <div className="detail__overview">
              <img
                className="detail__overview-image"
                src={campData.firstImageUrl}
                alt="캠핑장 사진"
              />
              <div className="detail__overview-reserv">
                <h4 className="detail__overview-reserv--location">
                  {campData.doNm} {campData.sigunguNm}
                </h4>
                <h3 className="detail__overview-reserv--subtitle">
                  {campData.themaEnvrnCl}
                </h3>
                <h2 className="detail__overview-reserv--title">
                  {campData.facltNm}
                </h2>
                <h4 className="detail__overview-reserv--campstyle">
                  {campData.induty}
                </h4>
                <div className="detail__overview-reserv--option">
                  <h4 className="detail__overview-reserv--option-text">옵션</h4>
                  <Button
                    className="btn-searchbar"
                    color="secondary"
                    iconPosition="left"
                    padding={"1rem 10rem 1rem 1rem"}
                    icon={<img src={calico} width={"20px"} height={"20px"} />}
                    onClick={openDateModal}
                  >
                    날짜 선택
                  </Button>
                  <DateModal modalRef={dateModal} />
                  <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    iconPosition="left"
                    margin={"1rem 0"}
                    padding={"1rem 10rem 1rem 1rem"}
                    icon={<img src={siteico} width={"20px"} height={"20px"} />}
                    onClick={Modal}
                  >
                    자리 선택
                  </Button>
                </div>
                <div className="detail__overview--optionbox">
                  <div className="detail__overview--optionbox-option">옵션</div>
                  {/* 추후 data가 들어오면 변경 예정 */}
                  <h5 className="detail__overview--optionbox-date">
                    예약 일자 : 3월 16일 ~ 3월 17일(1박)
                  </h5>
                  <div className="detail__overview--optionbox-size">
                    <h6 className="detail__overview--optionbox-small">
                      소 (최대 3인) : 1 자리 {campData.siteMg1CoPrice} 원
                    </h6>
                    <h6 className="detail__overview--optionbox-medium">
                      중 (최대 6인) : 1 자리 {campData.siteMg2CoPrice} 원
                    </h6>
                    <h6 className="detail__overview--optionbox-large">
                      대 (최대 10인) :1 자리 {campData.siteMg3CoPrice} 원
                    </h6>
                    <h6 className="detail__overview--optionbox-carav">
                      카라반 : 1 자리 {campData.caravSiteCoPrice} 원
                    </h6>
                  </div>
                </div>
                <div className="row-line"></div>
                <div className="detail__overview-reserv--payment">
                  {/* 추후 data가 들어오면 변경 예정 */}
                  <p className="detail__overview-reserv--payment-text">
                    총 상품 금액
                  </p>
                  <p className="detail__overview-reserv--payment-value">
                    1,439,800 원
                  </p>
                  <Button
                    className="detail__overview-reserv--addCartBtn"
                    icon={<img src={addCart} />}
                    padding={"0.6rem 5rem"}
                    iconPosition="right"
                  >
                    장바구니 담기
                  </Button>
                </div>
              </div>
            </div>
            <div className="detail__add-on">
              <div className="detail__add-on-left">
                <div>
                  <h3 className="detail__add-on-left--title-amenity">
                    시설 / 환경
                  </h3>
                  <div className="detail__orange-box">
                    <h4 className="detail__orange-box--title">편의시설</h4>
                    <div>
                      {availableAmenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="detail__orange-box--amenity"
                        >
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
                      <h5 className="detail__orange-box--contents">
                        추가 편의 시설: {transformedFacilities}
                      </h5>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="detail__add-on-left--title-intro">소개</h3>
                  <p className="detail__add-on-left--content">
                    {campData.featureNm}
                  </p>
                </div>
              </div>
              <div className="col-line"></div>
              <div className="detail__add-on-right">
                <h5 className="detail__add-on-right--title">기본 정보</h5>
                {/* 홈페이지 data가 존재하면 a 태그 표시, 존재하지 않는다면 홈페이지 정보 없음 표시 */}
                {campData?.homepage ? (
                  <p className="detail__add-on-right--homepage">
                    <a
                      href={campData.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {campData.homepage}
                    </a>
                  </p>
                ) : (
                  <p className="detail__add-on-right--homepage">
                    홈페이지 정보 없음
                  </p>
                )}
                <p className="detail__add-on-right--addr">{campData.addr1}</p>
                {/* 카카오맵 표시 */}
                <Map
                  center={{ lat: campData.mapY, lng: campData.mapX }}
                  style={{
                    width: "40rem",
                    height: "20rem",
                    borderRadius: "3rem",
                    marginBottom: "2rem",
                  }}
                  level={3}
                >
                  <MapMarker
                    position={{ lat: campData.mapY, lng: campData.mapX }}
                  ></MapMarker>
                </Map>
              </div>
            </div>
          </div>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>

      <Topbtn />
    </section>
  );
};

export default DetailPage;
