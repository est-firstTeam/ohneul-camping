import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, fbStorage, firebaseDB } from "../firebaseConfig";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { errorCodes } from "../constants/errorCodes";
import { doc, setDoc } from "firebase/firestore";
import { useUserStore } from "../store/useUserStore";
import Button from "../components/Button";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CreateAccount = () => {
  const navi = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [pwIcons, setPwIcons] = useState([true, true]);
  const [error, setErr] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPath, setImgPath] = useState(null);
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
    data.profileImg = imgFile === null ? "" : imgFile;
    let avatarURL = null;
    setLoading(true);

    try {
      //계정생성
      const credential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      //Storage에 유저 이미지 저장. 파일이름 -> userID
      if (data.profileImg) {
        const file = data.profileImg[0];
        const locationRef = ref(fbStorage, `avatars/${credential.user.uid}`);
        const result = await uploadBytes(locationRef, file);
        avatarURL = await getDownloadURL(result.ref);
      }

      await updateProfile(credential.user, {
        displayName: data.displayName,
        photoURL: avatarURL ?? "",
      });

      //Zustand Data 세팅
      setUser({
        id: credential.user.uid,
        name: credential.user.displayName,
        email: credential.user.email,
        profileImg: credential.user.photoURL,
      });

      // users DB에 사용자 데이터 넣기.
      saveDataToDB(credential);

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

  //에러없이 모든게 Ok되면 FormState를 리셋해준다.
  useEffect(() => {
    if (formState.isSubmitSuccessful && error === "") {
      console.log("Submit Success !!");
      reset();
    }
  }, [formState, reset, error]);

  const saveDataToDB = async (credential) => {
    const uid = auth.currentUser.uid;
    const obj = {
      id: uid,
      name: credential.user.displayName,
      email: credential.user.email,
      profileImg: credential.user.photoURL,
      carts: [],
    };
    await setDoc(doc(firebaseDB, "User", uid), obj);
  };

  const eyeToggle = (idx) => {
    setPwIcons((prev) => {
      const pwIcons = [...prev];
      pwIcons[idx] = !pwIcons[idx];
      return pwIcons;
    });
  };

  const googleAccount = async () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then(async (data) => {
        //사용자 프로필 업데이트
        await updateProfile(data.user, {
          displayName: data.user.displayName,
          photoURL: data.user.photoURL,
        });

        //FirebaseDB에 데이터 입력
        await saveDataToDB(data);

        //Zustand에 데이터 입력
        setUser({
          id: data.user.uid,
          name: data.user.displayName,
          email: data.user.email,
          profileImg: data.user.photoURL,
        });

        navi("/");
      })
      .catch((err) => {
        console.log("Err!!!", error);
        console.log(err);
      });
  };

  const avatarURL = (event) => {
    const { files } = event.target;
    if (files && files.length === 1) {
      setImgPath(URL.createObjectURL(files[0]));
      setImgFile(files);
    }
  };

  return (
    <div className="account__wrapper">
      {/* h2 회원가입 display:none */}
      <section className="account">
        <h2>회원 가입</h2>
        <form className="account__form" onSubmit={handleSubmit(onValid)}>
          {/* 아바타 파트 */}
          <label className="account__profile-label" htmlFor="file">
            <img
              src={imgPath === null ? "/src/images/ico_profile.svg" : imgPath}
            />
          </label>
          <input
            {...register("profileImg")}
            id="file"
            type="file"
            accept="image/*"
            className="account__input account__profile-input"
            onChange={avatarURL}
          />
          <span className="account__error">
            {formState.errors?.profileImg?.message}
          </span>
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
            <Button
              disabled={isLoading && true}
              width="25rem"
              className="btn account__btn"
              type="submit"
            >
              {isLoading ? "Loading..." : "계정 생성"}
            </Button>
            {/* 파이어베이스 에러 확인용 */}
            {error === "" ? null : (
              <span className="account__error">{error}</span>
            )}
          </div>
        </form>
      </section>
      <section className="account__etc">
        <h2>소셜 회원가입</h2>
        <span className="hr-sect">OR</span>
        <Button className="btn-google" onClick={googleAccount}></Button>
        {/* <button onClick={() => navi("/loginHome")}>로그인 홈 돌아가기</button> */}
      </section>
    </div>
  );
};

export default CreateAccount;
