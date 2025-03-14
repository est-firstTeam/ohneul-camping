import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
const BaseLayout = () => {
  return (
    <div>
      {/* TODO: <Header />자리*/}
      <main>
        <Outlet />
      </main>
      {/* TODO: footer자리 */}
      <Footer />
    </div>
  );
};

export default BaseLayout;
