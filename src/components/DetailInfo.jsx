import { Map, MapMarker } from "react-kakao-maps-sdk";

const DetailInfo = ({ campData }) => {
  return (
    <div className="detail__add-on-right">
      <h3 className="detail__add-on-right--title">기본 정보</h3>
      {/* 홈페이지 data가 존재하면 a 태그 표시, 존재하지 않는다면 홈페이지 정보 없음 표시 */}
      {campData?.homepage ? (
        <p className="detail__add-on-right--homepage">
          <a href={campData.homepage} target="_blank" rel="noopener noreferrer">
            {campData.homepage}
          </a>
        </p>
      ) : (
        <p className="detail__add-on-right--homepage">홈페이지 정보 없음</p>
      )}
      <p className="detail__add-on-right--addr">{campData.addr1}</p>
      {/* 카카오맵 표시 */}
      <Map
        center={{ lat: campData.mapY, lng: campData.mapX }}
        style={{
          width: "40rem",
          height: "30rem",
          borderRadius: "1rem",
          marginBottom: "2rem",
        }}
        level={3}
      >
        <MapMarker
          position={{ lat: campData.mapY, lng: campData.mapX }}
        ></MapMarker>
      </Map>
    </div>
  );
};

export default DetailInfo;
