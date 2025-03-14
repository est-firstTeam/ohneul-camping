import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { errorCodes } from "../constants/errorCodes";

const Login = () => {
  const { register, handleSubmit, formState } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [error, setErr] = useState("");
  const navi = useNavigate();

  const onValid = async (data) => {
    console.log("data is..", data);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navi("/loginHome");
    } catch (error) {
      if (error instanceof FirebaseError) console.log("code -> ", error.code);
      setErr(errorCodes[error.code]);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    // setPersistence -> 로그인을 얼만큼 유지할것인가. Session단위로 유지시키려면
    // browserSessionPersistence 을 두 번째 인자로 넘겨준다.
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithPopup(auth, googleProvider)
        .then((data) => {
          console.log("Login Data -> ", data);
          navi("/loginHome");
        })
        .catch((err) => {
          console.log("Err!!!", error);
          console.log(err);
        });
    });
  };

  return (
    <div className="account__wrapper">
      <h2>Log In</h2>
      <form className="account__form" onSubmit={handleSubmit(onValid)}>
        {/* 닉네임 파트 */}
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
        <div>
          <input
            {...register("password", {
              required: "패스워드를 입력해주세요.",
            })}
            className="account__input account__password"
            placeholder="비밀번호"
          ></input>
          <span className="account__error">
            {formState.errors?.password?.message}
          </span>
        </div>
        {/* submit 버튼 */}
        <div>
          <input
            className="btn btn__account-submit"
            type="submit"
            value={isLoading ? "Loading..." : "로그인"}
          ></input>
          {/* 파이어베이스쪽에서 나는 에러메세지 출력 */}
          {error === "" ? null : (
            <span className="account__error">{error}</span>
          )}
        </div>
      </form>
      <div>
        <span className="hr-sect">OR</span>
        <button onClick={googleLogin} style={{ margin: "10px 0px" }}>
          구글 로그인
        </button>
        <button onClick={() => navi("/loginHome")}>로그인 홈 돌아가기</button>
      </div>
    </div>
  );
};

export default Login;
