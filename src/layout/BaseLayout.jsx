import { Outlet } from "react-router-dom";
import Header from "../components/Header";
const BaseLayout = () => {
  return (
    <div className="baselayout">
      <Header />
      <main>
        <Outlet />
      </main>
      {/* TODO: footer자리 */}
    </div>
  );
};

export default BaseLayout;
