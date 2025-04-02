import { useForm } from "react-hook-form";
import { auth, firebaseDB } from "../firebaseConfig";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { errorCodes } from "../constants/errorCodes";
import { doc, getDoc } from "firebase/firestore";
import { useUserStore } from "../store/useUserStore";
import Button from "../components/Button";
import imgLogo from "../../public/Logo.svg";
import emailIcon from "../images/ico_email.svg";
import keyIcon from "../images/ico_password.svg";

const Login = () => {
  const { register, handleSubmit, formState } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [pwIcon, setPwIcon] = useState(true);
  const [error, setErr] = useState("");
  const navi = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const onValid = async (data) => {
    setLoading(true);
    try {
      //로그인 처리
      await signInWithEmailAndPassword(auth, data.email, data.password);
      //DB에서 유저정보 가져오고 Zustand에 세팅.
      const userQuery = doc(firebaseDB, "User", auth.currentUser.uid);
      const userSnapShot = await getDoc(userQuery);
      await setUser(userSnapShot.data());
      navi("/");
    } catch (error) {
      if (error instanceof FirebaseError) console.log("code -> ", error.code);
      setErr(errorCodes[error.code]);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then((data) => {
        setUser({
          id: data.user.uid,
          name: data.user.displayName,
          email: data.user.email,
          profileImg: data.user.photoURL,
        });
        navi("/");
      })
      .catch((err) => {
        if (err instanceof FirebaseError) {
          console.log("DB ERROR!!!");
          console.log("code -> ", err.code);
          setErr(errorCodes[err.code]);
        }
        console.log("Err!!!", err);
      });
  };

  const eyeToggle = () => {
    setPwIcon((prev) => !prev);
  };

  return (
    <article className="account__wrapper">
      {/* h2 로그인 display:none */}
      <h2>로그인</h2>
      <section className="account">
        <h2>로그인 양식</h2>
        <div className="account__img-wrapper">
          <img src={imgLogo} />
        </div>
        <form className="account__form" onSubmit={handleSubmit(onValid)}>
          {/* 닉네임*/}
          <div className="account__input-container">
            <div className="account__input-inner">
              <img src={emailIcon} />
              <input
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                })}
                className="account__input"
                placeholder="이메일"
                type="email"
              />
            </div>

            <span className="account__error">
              {formState.errors?.email?.message}
            </span>
          </div>
          {/* 비밀번호 */}
          <div className="account__input-container">
            <div className="account__input-inner">
              <img src={keyIcon} />
              <input
                {...register("password", {
                  required: "패스워드를 입력해주세요.",
                })}
                className="account__input account__password"
                placeholder="비밀번호"
                type={pwIcon ? "password" : "text"}
              />
              <Button
                type="button"
                onClick={eyeToggle}
                color="none"
                className={pwIcon ? "account__icon" : "account__icon-slash"}
              ></Button>
            </div>
            <span className="account__error">
              {formState.errors?.password?.message}
            </span>
          </div>
          {/* submit 버튼 */}
          <div>
            <Button
              disabled={isLoading && true}
              width="25rem"
              className="btn account__btn"
              type="submit"
            >
              {isLoading ? "Loading..." : "로그인"}
            </Button>
            {/* 파이어베이스쪽에서 나는 에러메세지 출력 */}
            {error === "" ? null : (
              <span className="account__error">{error}</span>
            )}
          </div>
        </form>
      </section>

      <section className="account__etc">
        <h2>소셜 로그인</h2>
        <span className="hr-sect">OR</span>
        <Button className="btn-google" onClick={googleLogin}></Button>
        <Link className="account__link" to="/createAccount">
          회원가입은 여기를 클릭해주세요
        </Link>
      </section>
    </article>
  );
};

export default Login;
