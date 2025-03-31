import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { useUserStore } from "../store/useUserStore";

export default function Account() {
  const {
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    //Mode 값으로 -> OnBlur, OnChange, OnSubmit 가능. 어떤 시점에 Validation을 할지 정할 수 있다.
  } = useForm({ mode: "onBlur" });
  const [isLoading, setLoading] = useState(false);
  const [pwIcons, setPwIcons] = useState([true, true]);
  const [imgFile, setImgFile] = useState(null);
  const [imgPath, setImgPath] = useState(
    JSON.parse(localStorage.getItem("storage-user")).state.profileImg
  );
  const [error, setErr] = useState("");

  //에러없이 모든게 Ok되면 FormState를 리셋해준다.
  useEffect(() => {
    if (formState.isSubmitSuccessful && error === "") {
      console.log("Submit Success !!");
      reset();
    }
  }, [formState, reset, error]);

  const avatarURL = (event) => {
    const { files } = event.target;
    if (files && files.length === 1) {
      setImgPath(URL.createObjectURL(files[0]));
      setImgFile(files);
    }
  };

  const eyeToggle = (idx) => {
    setPwIcons((prev) => {
      const pwIcons = [...prev];
      pwIcons[idx] = !pwIcons[idx];
      return pwIcons;
    });
  };

  const onValid = () => {
    return null;
  };

  return (
    <div className="account__wrapper account__modify">
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
              })}
              className="account__input account__displayName"
              placeholder="변경할 닉네임"
              autoComplete="new-password"
            />
            <span className="account__error">
              {formState.errors?.displayName?.message}
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
              autoComplete="new-password"
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
          {/* Submit */}
          <div>
            <Button width="25rem" className="btn account__btn" type="submit">
              {isLoading ? "Loading..." : "정보 변경"}
            </Button>
            {/* 파이어베이스 에러 확인용 */}
            {error === "" ? null : (
              <span className="account__error">{error}</span>
            )}
          </div>
        </form>
        <div className="Account__delete">
          <button>{isLoading ? "Loading..." : "회원 탈퇴"}</button>
          {/* 파이어베이스 에러 확인용 */}
          {error === "" ? null : (
            <span className="account__error">{error}</span>
          )}
        </div>
      </section>
    </div>
  );
}
