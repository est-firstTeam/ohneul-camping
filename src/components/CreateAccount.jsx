import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { errorCodes } from "../constants/errorCodes";

const CreateAccount = () => {
  const navi = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [error, setErr] = useState("");
  const {
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    //Mode 값으로 -> OnBlur, OnChange, OnSubmit 을 줘서 어떤 시점에 Validation을 할지 정할 수 있다.
  } = useForm({ mode: "onBlur" });

  //에러없이 모든게 Ok되면 FormState를 리셋해준다.
  useEffect(() => {
    if (formState.isSubmitSuccessful && error === "") {
      console.log("SubMit Successful !");
      reset();
    }
  }, [formState, reset, error]);

  //Submit되면 onValid에서 입력된 input값을 가지고 유저를 생성한다.
  const onValid = async (data) => {
    console.log("data is..", data);
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      //마이페이지의 닉네임을 출력하기위해 현재 유저에 닉네임을 설정.
      await updateProfile(credential.user, { displayName: data.name });
      navi("/");
    } catch (error) {
      if (error instanceof FirebaseError)
        console.log("ERR code -> ", error.code);
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
      <h2 style={{ fontSize: "20px" }}>Create Account</h2>
      <form className="account__form" onSubmit={handleSubmit(onValid)}>
        {/* 닉네임 파트 */}
        <div>
          <input
            {...register("nickname", {
              maxLength: { value: 8, message: "8글자 이하로 만들어주세요." },
              required: "닉네임을 입력해주세요.",
            })}
            className="account__input account__nickname"
            placeholder="닉네임"
          ></input>
          <span className="account__error">
            {formState.errors?.nickname?.message}
          </span>
        </div>
        {/* 이메일 */}
        <div>
          <input
            {...register("email", {
              pattern: {
                value:
                  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                message: "이메일 형식에 맞지 않습니다.",
              },
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
              pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,15}$/,
                message: "6~15자 이내 / 숫자+영문 조합으로 만들어주세요.",
              },
              required: "패스워드를 입력해주세요.",
            })}
            className="account__input account__password"
            placeholder="비밀번호"
          ></input>
          <span className="account__error">
            {formState.errors?.password?.message}
          </span>
        </div>
        {/* 비밀번호 체크 */}
        <div>
          <input
            {...register("passwordCheck", {
              minLength: {
                value: 6,
                message: "비밀번호가 너무 짧습니다.",
              },
              validate: {
                matchPassword: (value) => {
                  const { password } = getValues();
                  return password === value || "비밀번호가 일치하지 않습니다";
                },
              },
              // 비밀번호 체크 또다른 방법 ↓
              // validate: (val) => {
              //   if (watch("password") !== val) {
              //     return "Your passwords do no match";
              //   }
              // },
            })}
            className="account__input account__password-chk"
            placeholder="비밀번호 확인"
          ></input>
          <span className="account__error">
            {formState.errors?.passwordCheck?.message}
          </span>
        </div>
        {/* Submit */}
        <div>
          <input
            className="btn btn__account-submit"
            type="submit"
            value={isLoading ? "Loading..." : "계정 생성"}
          ></input>
          {/* 파이어베이스 에러 확인용 */}
          {error === "" ? null : (
            <span className="account__error">{error}</span>
          )}
        </div>
      </form>
      <span className="hr-sect">OR</span>
      <button
        className="btn btn__google"
        onClick={googleLogin}
        style={{ margin: "10px 0px" }}
      >
        ......
      </button>
      <button onClick={() => navi("/loginHome")}>로그인 홈 돌아가기</button>
    </div>
  );
};

export default CreateAccount;
