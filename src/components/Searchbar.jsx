import right_arr from "../images/ico-rightArrow.svg";
import mapico from "../images/ico-map.svg";
import calico from "../images/ico-calendar.svg";
import siteico from "../images/ico-vector.svg";
import Button from "./Button";

const SearchBar = () => {
    return (
        <>
            <div className="search__bar">
                <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    icon={<img src={mapico} width={"20px"} height={"20px"} />}
                    iconPosition="left"
                >
                    어디로 가세요?
                </Button>
                <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    icon={<img src={calico} width={"20px"} height={"20px"} />}
                    iconPosition="left"
                >
                    날짜 및 일정
                </Button>
                <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    icon={<img src={siteico} width={"20px"} height={"20px"} />}
                    iconPosition="left"
                >
                    사이트 형태
                </Button>
                <Button
                    color={"primary"}
                    icon={<img src={right_arr} />}
                    iconPosition="right"
                >
                    검색
                </Button>
            </div>
        </>
    );
};

export default SearchBar;
