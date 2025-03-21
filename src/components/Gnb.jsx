import { Link } from "react-router-dom";

const Gnb = (props) => {
  const menus = props.menus;
  return (
    <nav className="gnb">
      <ul className="gnb__list">
        {menus.map((menu, idx) => (
          <li key={idx} className="gnb__item">
            <Link to={menu.path}>
              <span className="gnb__item-text">{menu.title && menu.title}</span>
              <span>
                {menu.iconPath && (
                  <div>
                    <img src={menu.iconPath} />
                  </div>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default Gnb;
