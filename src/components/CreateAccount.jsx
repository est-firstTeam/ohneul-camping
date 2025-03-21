import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, firebaseDB } from "../firebaseConfig";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { errorCodes } from "../constants/errorCodes";
import { doc, setDoc } from "firebase/firestore";
import { useUserStore } from "../store/useUserStore";
import Button from "./Button";

const CreateAccount = () => {
  const navi = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [pwIcons, setPwIcons] = useState([true, true]);
  const [error, setErr] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    //Mode 값으로 -> OnBlur, OnChange, OnSubmit 가능. 어떤 시점에 Validation을 할지 정할 수 있다.
  } = useForm({ mode: "onBlur" });

  //Submit되면 onValid에서 입력된 input값을 가지고 유저를 생성한다.
  const onValid = async (data) => {
    console.log("Submit Form data is...", data);
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      //마이페이지의 닉네임을 출력하기위해 현재 유저에 닉네임을 설정.
      await updateProfile(credential.user, { displayName: data.displayName });
      setUser({
        Id: credential.user.uid,
        Name: credential.user.displayName,
        Email: credential.user.email,
      });

      // users DB에 사용자 데이터 넣기.
      saveDataToDB(data);
      // Session에 로그인 정보 넣기.
      setPersistence(auth, browserSessionPersistence);

      navi("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log("ERR code -> ", error.code);
      }
      setErr(errorCodes[error.code]);
    } finally {
      setLoading(false);
    }
  };

  const saveDataToDB = async (data) => {
    const uid = auth.currentUser.uid;
    await setDoc(doc(firebaseDB, "User", uid), {
      id: uid,
      name: data.displayName,
      email: data.email,
      profileImg: "",
      carts: [],
    });
  };

  //에러없이 모든게 Ok되면 FormState를 리셋해준다.
  useEffect(() => {
    if (formState.isSubmitSuccessful && error === "") {
      console.log("SubMit Successful !");
      reset();
    }
  }, [formState, reset, error]);

  const eyeToggle = (idx) => {
    setPwIcons((prev) => {
      const pwIcons = [...prev];
      pwIcons[idx] = !pwIcons[idx];
      return pwIcons;
    });
  };

  const googleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    // setPersistence -> 로그인을 얼만큼 유지할것인가. Session단위로 유지시키려면
    // browserSessionPersistence 을 두 번째 인자로 넘겨준다.
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithPopup(auth, googleProvider)
        .then(async (data) => {
          await saveDataToDB(data.user);
          await updateProfile(data.user, {
            displayName: data.user.displayName,
          });

          navi("/");
        })
        .catch((err) => {
          console.log("Err!!!", error);
          console.log(err);
        });
    });
  };

  return (
    <section className="account__wrapper">
      <div className="account">
        <div className="account__img-wrapper">
          <img src="../public/Logo.svg" alt="회원가입_로고" />
        </div>
        <form className="account__form" onSubmit={handleSubmit(onValid)}>
          {/* 닉네임 파트 */}
          <div>
            <input
              {...register("displayName", {
                maxLength: { value: 8, message: "8글자 이하로 만들어주세요." },
                required: "닉네임을 입력해주세요.",
              })}
              className="account__input account__displayName"
              placeholder="닉네임"
            />
            <span className="account__error">
              {formState.errors?.displayName?.message}
            </span>
          </div>
          {/* 이메일 */}
          <div>
            <input
              {...register("email", {
                required: "이메일을 입력해주세요.",
              })}
              className="account__input account__email"
              placeholder="이메일"
              type="email"
            />
            <span className="account__error">
              {formState.errors?.email?.message}
            </span>
          </div>
          {/* 비밀번호 */}
          <div className="account__form__password">
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
              type={pwIcons[0] ? "password" : "text"}
            />
            <span className="account__error">
              {formState.errors?.password?.message}
            </span>
            <div
              onClick={() => eyeToggle(0)}
              type="button"
              color="none"
              className={pwIcons[0] ? "account__icon" : "account__icon-slash"}
            ></div>
          </div>
          {/* 비밀번호 체크 */}
          <div className="account__form__password">
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
              })}
              className="account__input account__password-chk"
              placeholder="비밀번호 확인"
              type={pwIcons[1] ? "password" : "text"}
            />
            <span className="account__error">
              {formState.errors?.passwordCheck?.message}
            </span>
            <div
              onClick={() => eyeToggle(1)}
              type="button"
              color="none"
              className={pwIcons[1] ? "account__icon" : "account__icon-slash"}
            ></div>
          </div>
          {/* Submit */}
          <div>
            <Button className="btn account__btn" type="submit">
              {isLoading ? "Loading..." : "계정 생성"}
            </Button>
            {/* 파이어베이스 에러 확인용 */}
            {error === "" ? null : (
              <span className="account__error">{error}</span>
            )}
          </div>
        </form>
        <span className="hr-sect">OR</span>
        <Button className="btn-google" onClick={googleLogin}></Button>
        {/* <button onClick={() => navi("/loginHome")}>로그인 홈 돌아가기</button> */}
      </div>
    </section>
  );
};

export default CreateAccount;
