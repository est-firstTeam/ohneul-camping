import { useForm } from "react-hook-form";
import { auth, db } from "../firebase";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { errorCodes } from "../constants/errorCodes";
import { doc, getDoc } from "firebase/firestore";
import { useUserStore } from "../store/zustandStore";
import Button from "./Button";

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
      //Session 로그인 정보 저장
      setPersistence(auth, browserSessionPersistence).then(() => {
        navi("/loginHome");
      });
      //DB에서 유저정보 가져오고 Zustand에 세팅.
      const userQuery = doc(db, "user", auth.currentUser.uid);
      const userSnapShot = await getDoc(userQuery);
      await setUser(userSnapShot.data());
    } catch (error) {
      if (error instanceof FirebaseError) console.log("code -> ", error.code);
      setErr(errorCodes[error.code]);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithPopup(auth, googleProvider)
        .then((data) => {
          console.log("Google Login Data -> ", data);
          navi("/loginHome");
        })
        .catch((err) => {
          console.log("Err!!!", error);
          console.log(err);
        });
    });
  };

  const eyeToggle = () => {
    setPwIcon((prev) => !prev);
  };

  return (
    <section className="account__wrapper">
      <div className="account">
        <div className="account__img-wrapper">
          <img src="../public/Logo.svg" alt="회원가입_로고" />
        </div>
        <form className="account__form" onSubmit={handleSubmit(onValid)}>
          {/* 닉네임*/}
          <div>
            <input
              {...register("email", {
                required: "이메일을 입력해주세요.",
              })}
              className="account__input account__email"
              placeholder="이메일"
            ></input>
            <span className="account__error">
              {formState.errors?.email?.message}
            </span>
          </div>
          {/* 비밀번호 */}
          <div className="account__form__password">
            <input
              {...register("password", {
                required: "패스워드를 입력해주세요.",
              })}
              className="account__input account__password"
              placeholder="비밀번호"
              type={pwIcon ? "password" : "text"}
            ></input>
            <span className="account__error">
              {formState.errors?.password?.message}
            </span>
            <div
              onClick={eyeToggle}
              className={pwIcon ? "account__icon" : "account__icon-slash"}
            ></div>
          </div>
          {/* submit 버튼 */}
          <div>
            <Button className="btn account__btn" type="submit">
              {isLoading ? "Loading..." : "로그인"}
            </Button>
            {/* 파이어베이스쪽에서 나는 에러메세지 출력 */}
            {error === "" ? null : (
              <span className="account__error">{error}</span>
            )}
          </div>
        </form>
        <div className="account__etc">
          <span className="hr-sect">OR</span>
          <Button
            className="btn btn__google"
            onClick={googleLogin}
            style={{ margin: "10px 0px" }}
          ></Button>
          <Link className="account__link" to="/createAccount">
            회원가입은 여기를 클릭해주세요
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
