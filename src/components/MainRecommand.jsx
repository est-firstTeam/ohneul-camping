import { Suspense } from "react";
import { fBService } from "../util/fbService";
import { useQuery } from "@tanstack/react-query";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const MainRecommand = () => {
  const { data, status, error, isLoading } = useQuery({
    queryKey: ["pickOneCampsite"],
    queryFn: async () => fBService.getAllCampsites(),
    select: (data) => {
      const temp = data[Math.floor(Math.random() * data.length)].data;
      const returnObj = { ...temp };
      return returnObj;
    },
  });

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <section className="main__rcmd">
      <h2>이런곳은 어때요?</h2>
      <div className="main__rcmd-wrapper">
        <div className="main__rcmd-left">
          <div className="rcmd-left__img-area">
            <img
              src={
                isLoading
                  ? ""
                  : data.firstImageUrl
                  ? data.firstImageUrl
                  : "/src/images/no_image.png"
              }
              alt=""
            />
          </div>
        </div>
        <div className="main__rcmd-right">
          <h3>{data.facltNm}</h3>
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
            <Link to={`/searchResult/${data.contentId}`}>
              <Button width="14rem" margin="5rem 0rem 0rem 0rem">
                옵션 더보기 →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainRecommand;
