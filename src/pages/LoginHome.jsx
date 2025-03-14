import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Home = () => {
  const navi = useNavigate();
  const user = auth.currentUser;

  const login = () => {
    navi("/login");
  };

  const logOut = () => {
    auth.signOut();
  };

  return (
    <>
      <h1 style={{ fontSize: "30px" }}>LoginHome.jsx...</h1>
      <Link
        style={{ margin: "20px", display: "block", fontSize: "15px" }}
        to={"/createAccount"}
      >
        Go Create Account
      </Link>
      <br />
      {user === null ? (
        <button onClick={login}>LogIn</button>
      ) : (
        <button onClick={logOut}>LogOut</button>
      )}
    </>
  );
};

export default Home;
