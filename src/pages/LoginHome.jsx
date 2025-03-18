import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "../store/zustandStore";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userInfo = useUserStore();
  const navi = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      }
    });
    console.log("UserInfo ...", userInfo);

    return unsubscribe;
  }, []);

  const login = () => {
    navi("/login");
  };

  const logOut = () => {
    auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <>
      <h1 style={{ fontSize: "30px" }}>LoginHome.jsx page</h1>
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
      {isLoggedIn ? (
        <button onClick={logOut}>LogOut</button>
      ) : (
        <button onClick={login}>LogIn</button>
      )}
      <br></br>
      <h2 style={{ fontSize: "20px" }}>id is... {userInfo.id}</h2>
      <h2 style={{ fontSize: "20px" }}>email is... {userInfo.email}</h2>
      <h2 style={{ fontSize: "20px" }}>name is... {userInfo.name}</h2>
    </>
  );
};

export default Home;
