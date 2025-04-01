import { Suspense } from "react";
import { fBService } from "../util/fbService";
import { useQuery } from "@tanstack/react-query";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import noImage from "../images/no_image.png";

const MainRecommand = () => {
  const { data, status, error, isLoading } = useQuery({
    queryKey: ["campsites"],
    queryFn: async () => fBService.getAllCampsites(),
    select: (data) => {
      const temp = data[Math.floor(Math.random() * data.length)].data;
      const returnObj = { ...temp };
      return returnObj;
    },
    staleTime: 300000,
  });

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <section className="main__rcmd">
      <h2 className="section-header__subtitle">이런 곳은 어때요?</h2>
      <div className="main__rcmd-wrapper">
        <div className="main__rcmd-left">
          <div className="rcmd-left__img-area">
            <img
              src={
                isLoading
                  ? ""
                  : data.firstImageUrl
                  ? data.firstImageUrl
                  : { noImage }
              }
              alt=""
            />
          </div>
        </div>
        <div className="main__rcmd-right">
          <h3 className="section-header__title">{data.facltNm}</h3>
          <p className="main__rcmd-paragraph">{data.featureNm || data.intro}</p>
          <div className="rcmd__camp-info">
            <span className="camp-info-text">{data.addr1}</span>
            <div>
              <span className="camp-info-text">
                샤워실 갯수 : {data.toiletCo || "0"}
              </span>
              <span className="camp-info-text">
                화장실 갯수 : {data.swrmCo || "0"}
              </span>
              <span className="camp-info-text">
                개수대 갯수 : {data.wtrplCo || "0"}
              </span>
            </div>
            <span className="camp-info-text">
              {data.lineIntro || "한줄평이 없습니다."}
            </span>
          </div>
          <Link to={`/searchResult/${data.contentId}`}>
            <Button width="14rem">옵션 더보기 →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MainRecommand;
