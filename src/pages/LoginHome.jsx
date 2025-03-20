import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "../store/zustandStore";

const Home = () => {
  const userId = useUserStore((state) => state.id);
  const userName = useUserStore((state) => state.name);
  const userEmail = useUserStore((state) => state.email);
  const userIsLoggedIn = useUserStore((state) => state.isLoggedIn);
  const setUserLoggedIn = useUserStore((state) => state.setUserLoggedIn);

  const navi = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      }
    });

    return unsubscribe;
  }, []);

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
      {userIsLoggedIn ? (
        <button onClick={logOut}>LogOut</button>
      ) : (
        <button onClick={login}>LogIn</button>
      )}
      <br></br>
      <h2 style={{ fontSize: "20px" }}>id is... {userId}</h2>
      <h2 style={{ fontSize: "20px" }}>email is... {userEmail}</h2>
      <h2 style={{ fontSize: "20px" }}>name is... {userName}</h2>
    </>
  );
};

export default Home;
