import Modal from "./Modal";
import PlusBtn from "../images/ico-plusBtn.svg";
import MinusBtn from "../images/ico-minusBtn.svg";
import useSiteStore from "../store/useSiteStore";

const DTsiteModal = ({ modalRef, minAvailable, startDate, endDate }) => {
  const { siteCounts, setSiteCounts } = useSiteStore();

  const sites = [
    "소 (최대 3인)",
    "중 (최대 6인)",
    "대 (최대 10인)",
    "카라반 (최대 4인)",
  ];

  const availableSites = [
    minAvailable?.siteS,
    minAvailable?.siteM,
    minAvailable?.siteL,
    minAvailable?.siteC,
  ];

  const increaseCount = (index) => {
    setSiteCounts(
      siteCounts.map((count, i) =>
        i === index && count < availableSites[index] ? count + 1 : count
      )
    );
  };

  const decreaseCount = (index) => {
    setSiteCounts(
      siteCounts.map((count, i) =>
        i === index && count > 0 ? count - 1 : count
      )
    );
  };

  // 모달 취소 버튼 클릭 : 창 닫기
  const handleCancel = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  // site의 모든 값이 null인 경우
  const allNull = availableSites.every((site) => site === null);

  const isInvalidDate = startDate === endDate;

  return (
    <Modal
      modalRef={modalRef}
      handleCancel={handleCancel}
      text="확인"
      cancelBtn={true}
      confirmBtn={true}
    >
      <div className="detail__modal-site">
        <h2 className="detail__modal-site--title">자리 선택</h2>
        <div className="detail__modal-site--container">
          {!startDate || !endDate ? (
            <p className="detail__modal-site--error">날짜를 선택하세요.</p>
          ) : isInvalidDate ? (
            <p className="detail__modal-site--error">
              날짜를 다시 선택해주세요.
            </p>
          ) : allNull ? (
            <p className="detail__modal-site--soldout">
              캠핑장 자리 정보가 없습니다.
            </p>
          ) : (
            sites.map((site, index) => {
              const available = availableSites[index];

              if (available === null) return null;

              const isSoldOut = availableSites[index] === 0;

              return (
                <div key={index} className="detail__modal-site--row">
                  <div>
                    <span className="detail__modal-site--text">{site}</span>
                    <span
                      className={`detail__modal-site--remaining ${
                        isSoldOut ? "sold-out" : ""
                      }`}
                    >
                      남은 자리: {available}
                    </span>
                  </div>
                  <div
                    className={`detail__modal-site--counterDiv ${
                      isSoldOut ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="detail__modal-site--leftBtn"
                      onClick={() => decreaseCount(index)}
                      disabled={siteCounts[index] === 0}
                    >
                      <img src={MinusBtn} alt="감소 버튼" />
                    </button>
                    <span className="detail__modal-site--counter">
                      {siteCounts[index]}
                    </span>
                    <button
                      className="detail__modal-site--rightBtn"
                      onClick={() => increaseCount(index)}
                      disabled={siteCounts[index] >= available}
                    >
                      <img src={PlusBtn} alt="증가 버튼" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DTsiteModal;
