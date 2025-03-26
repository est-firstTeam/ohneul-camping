import Modal from "./Modal";
import PlusBtn from "../images/ico-plusBtn.svg";
import MinusBtn from "../images/ico-minusBtn.svg";
import useSiteStore from "../store/useSiteStore";

const DTsiteModal = ({ modalRef }) => {
  const { siteCounts, setSiteCounts } = useSiteStore();

  const sites = [
    "소 (최대 3인)",
    "중 (최대 6인)",
    "대 (최대 10인)",
    "카라반 (최대 4인)",
  ];

  const increaseCount = (index) => {
    setSiteCounts(
      siteCounts.map((count, i) => (i === index ? count + 1 : count))
    );
  };

  const decreaseCount = (index) => {
    setSiteCounts(
      siteCounts.map((count, i) =>
        i === index && count > 0 ? count - 1 : count
      )
    );
  };

  return (
    <Modal modalRef={modalRef}>
      <div className="detail__modal-site">
        <h2 className="detail__modal-site--title">자리 선택</h2>
        <div className="detail__modal-site--container">
          {sites.map((site, index) => (
            <div key={index} className={"detail__modal-site--row"}>
              <div>
                <span className="detail__modal-site--text">{site}</span>
              </div>
              <div>
                <button
                  className={`detail__modal-site--leftBtn ${
                    siteCounts[index] === 0 ? "disabled" : ""
                  }`}
                  onClick={() => decreaseCount(index)}
                  disabled={siteCounts[index] === 0}
                >
                  <img src={MinusBtn} alt="감소 버튼" />
                </button>
                <span className="detail__modal-site--counter">
                  {siteCounts[index]}
                </span>
                <button
                  className="detail__modal-site—rightBtn"
                  onClick={() => increaseCount(index)}
                >
                  <img src={PlusBtn} alt="증가 버튼" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default DTsiteModal;
