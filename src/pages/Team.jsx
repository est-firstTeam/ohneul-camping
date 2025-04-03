import junyoung from "../images/team/GPT-junyoung.png";
import hyerim from "../images/team/GPT-hyerim.png";
import hyewon from "../images/team/GPT-hyewon.png";
import dongwook from "../images/team/GPT-dongwook.png";
import seungyup from "../images/team/GPT-seungyup.png";

const teamMembers = [
  {
    name: "김동욱",
    role: "팀원",
    git: "star0301",
    image: dongwook,
    content1: "메인 · 로그인 페이지",
    content2: "회원가입 · 회원정보수정",
  },
  {
    name: "노혜림",
    role: "팀장",
    git: "yeshforest",
    image: hyerim,
    content1: "장바구니 · 마이페이지",
    content2: "헤더 · 레이아웃",
  },
  {
    name: "서혜원",
    role: "팀원",
    git: "coding-pop",
    image: hyewon,
    content1: "예약 현황 페이지 · 푸터",
    content2: "상품 장바구니 목록 · 탑 버튼",
  },
  {
    name: "송승엽",
    role: "팀원",
    git: "seung-yuppy",
    image: seungyup,
    content1: "검색 결과 페이지 · 검색 바",
    content2: "상세 검색 모달 · 데이터 생성",
  },
  {
    name: "신준영",
    role: "팀원",
    git: "ShinJunYoung",
    image: junyoung,
    content1: "상세 · 팀 구성 페이지 · 장바구니 담기",
    content2: "버튼 · 체크박스 컴포넌트",
  },
];

const Team = () => {
  return (
    <section className="team">
      <h2 className="team__title">팀 구성</h2>
      <div className="team__inner">
        {teamMembers.map((member) => (
          <div key={member.name} className="team__box">
            <p className="team__box--role">{member.role}</p>
            <img
              src={member.image}
              alt={member.name}
              width={200}
              height={300}
            />
            <p className="team__box--title">{member.name}</p>
            <a
              href={`https://github.com/${member.git}`}
              className="team__box--git"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{member.git}
            </a>
            <p className="team__box--subtitle">역할</p>
            <p className="team__box--content">{member.content1}</p>
            <p className="team__box--content">{member.content2}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
