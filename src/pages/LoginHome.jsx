import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useUserStore } from "../store/useUserStore";

const Home = () => {
  const { id, name, email, setUserLoggedIn } = useUserStore((state) => state);
  const testBoolean = false;

  const navi = useNavigate();

  // const unsubscribe = onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     setUserLoggedIn(true);
  //   }
  // });

  const login = () => {
    navi("/login");
  };

  const logOut = () => {
    auth.signOut();
    setUserLoggedIn(false);
  };

  return (
    <>
      <Link
        style={{
          margin: "20px",
          display: "block",
          fontSize: "20px",
          textDecoration: "underline",
        }}
        to={"/createAccount"}
      >
        Go Create Account
      </Link>
      <br />
      {testBoolean ? (
        <button onClick={logOut}>LogOut</button>
      ) : (
        <button onClick={login}>LogIn</button>
      )}
      <br></br>
      <h2 style={{ fontSize: "20px" }}>id is... {id}</h2>
      <h2 style={{ fontSize: "20px" }}>email is... {email}</h2>
      <h2 style={{ fontSize: "20px" }}>name is... {name}</h2>
    </>
  );
};

export default Home;
