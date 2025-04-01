import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { useUserStore } from "../store/useUserStore";
import Modal from "../components/Modal";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, fbStorage, firebaseDB } from "../firebaseConfig";
import { deleteUser, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { errorCodes } from "../constants/errorCodes";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { fBService } from "../util/fbService";
import myPageTitleStore from "../store/mypageTitleStore";
import profileimg from "../images/ico_profile.svg";

export default function Account() {
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
    defaultValues: {
      displayName: JSON.parse(localStorage.getItem("storage-user")).state.name,
    },
  });
  const [isLoading, setLoading] = useState(false);
  const [pwIcons, setPwIcons] = useState([true, true]);
  const [imgFile, setImgFile] = useState(null);
  const [imgPath, setImgPath] = useState(
    JSON.parse(localStorage.getItem("storage-user")).state.profileImg
  );
  const [error, setErr] = useState("");
  const modalRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("storage-user")).state;
  const setUser = useUserStore((state) => state.setUser);
  const resetUser = useUserStore((state) => state.resetUser);
  const userName = useUserStore((state) => state.name); // User/name: 레이아웃 상단에 이름 출력 시 사용
  const { setTitle } = myPageTitleStore();

  const navi = useNavigate();

  const modalOpen = (ref) => {
    if (ref.current) {
      ref.current.showModal();
    }
  };

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

  useEffect(() => {
    if (userName) {
      setTitle(`${userName} 님, 반가워요!`);
    }
  }, [userName, setTitle]);

  const eyeToggle = (idx) => {
    setPwIcons((prev) => {
      const pwIcons = [...prev];
      pwIcons[idx] = !pwIcons[idx];
      return pwIcons;
    });
  };

  const onValid = async (data) => {
    setLoading(true);
    let profileURL = null;
    data.profileImg = imgFile === null ? "" : imgFile;

    try {
      // Storage에 유저 이미지 저장. 파일이름 -> userID
      if (data.profileImg) {
        const file = data.profileImg[0];
        const locationRef = ref(fbStorage, `avatars/${auth.currentUser.uid}`);
        const result = await uploadBytes(locationRef, file);
        profileURL = await getDownloadURL(result.ref);
      }

      await updateProfile(auth.currentUser, {
        displayName: data.displayName ?? user.displayName,
        photoURL: profileURL ?? user.profileImg,
      });

      user.displayName = data.displayName ?? user.displayName;
      user.photoURL = profileURL ?? user.profileImg;

      //Zustand Data 세팅
      setUser({
        id: auth.currentUser.uid,
        name: user.displayName,
        email: user.email,
        profileImg: user.photoURL,
      });

      const obj = {
        id: auth.currentUser.uid,
        name: user.displayName,
        email: user.email,
        profileImg: user.photoURL,
        carts: user.carts,
      };
      await setDoc(doc(firebaseDB, "User", user.id), obj);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log("ERR code -> ", error.code);
      }
      setErr(errorCodes[error.code]);
    } finally {
      setLoading(false);
      navi("/");
    }
  };

  const deleteConfirm = async () => {
    try {
      //유저가 예약한 부분 삭제
      fBService.getAllReservation(auth.currentUser.uid).then((rsvArr) => {
        rsvArr.map((ele) => {
          fBService.deleteReservation(ele.id);
        });
      });

      //유저의 아바타 삭제
      const deleteRef = ref(fbStorage, `avatars/${auth.currentUser.uid}`);
      deleteObject(deleteRef)
        .then(() => {
          console.log("UserAvatar Delete Success!!");
        })
        .catch((error) => {
          if (error instanceof FirebaseError) {
            if (error.code === "storage/object-not-found") {
              console.log("아바타가 없는 유저. 아바타 삭제 Pass");
            }
          }
        });

      //User DB 삭제
      fBService.deleteUser(auth.currentUser.uid);
      //Auth 삭제
      deleteUser(auth.currentUser)
        .then(() => {
          // User deleted.
        })
        .catch((error) => {
          if (error instanceof FirebaseError) {
            console.log("ERR!!", error.code);
          }
        });

      //Zustand Data 초기화
      resetUser();

      console.log("User Delete Success!!");
    } catch (error) {
      console.log("ERR!!", error);
    } finally {
      navi("/");
    }
  };

  return (
    <div className="account__wrapper account__modify">
      {/* h2 회원가입 display:none */}
      <section className="account">
        <h2>회원 가입</h2>
        <form className="account__form" onSubmit={handleSubmit(onValid)}>
          {/* 아바타 파트 */}
          <label className="account__profile-label" htmlFor="file">
            <img src={imgPath === null ? { profileimg } : imgPath} />
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
                required: "닉네임은 필수값입니다.",
                maxLength: {
                  value: 8,
                  message: "8글자 이하로 만들어주세요.",
                },
              })}
              className="account__input account__displayName"
              // placeholder="변경할 닉네임"
              autoComplete="new-password"
              value={user.displayName}
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
                  message: "6~15자 이내 / 숫자+영문 조합 필요.",
                },
                required: "패스워드를 입력해주세요.",
              })}
              className="account__input account__password"
              placeholder="현재 비밀번호"
              type={pwIcons[0] ? "password" : "text"}
              autoComplete="new-password"
            />
            <span className="account__error">
              {formState.errors?.password?.message}
            </span>
            <button
              onClick={() => eyeToggle(0)}
              type="button"
              color="none"
              className={pwIcons[0] ? "account__icon" : "account__icon-slash"}
            ></button>
          </div>
          {/* Submit */}
          <div>
            <Button
              disabled={isLoading && true}
              width="25rem"
              className="btn account__btn"
              type="submit"
            >
              {isLoading ? "Loading..." : "정보 변경"}
            </Button>
            {/* 파이어베이스 에러 확인용 */}
            {error === "" ? null : (
              <span className="account__error">{error}</span>
            )}
          </div>
        </form>
        <div className="account__delete">
          <button onClick={() => modalOpen(modalRef)}>
            <span className="gnb__item-text">회원탈퇴는 여기를 클릭</span>
          </button>

          <Modal
            modalRef={modalRef}
            handleConfirm={deleteConfirm}
            text={"확인"}
            cancelBtn
            confirmBtn={true}
            buttonType={"button"}
          >
            <div className="delete-modal-wrapper">
              <div>
                <span className="delete-modal__title">진짜 탈퇴할꾸에염?</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M9.5 3.5a.5.5 0 0 0 .5.5c.838 0 1.65.416 2.053 1.224a.5.5 0 1 0 .894-.448C12.351 3.584 11.162 3 10 3a.5.5 0 0 0-.5.5M7 6.5C7 5.672 6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8s1-.672 1-1.5M4.5 13c.828 0 1.5-.746 1.5-1.667 0-.706-.882-2.29-1.294-2.99a.238.238 0 0 0-.412 0C3.882 9.044 3 10.628 3 11.334 3 12.253 3.672 13 4.5 13M8 11.197c.916 0 1.607.408 2.25.826.212.138.424-.069.282-.277-.564-.83-1.558-2.049-2.532-2.049-.53 0-1.066.361-1.536.824q.126.27.232.535.069.174.135.373A3.1 3.1 0 0 1 8 11.197M10 8c.552 0 1-.672 1-1.5S10.552 5 10 5s-1 .672-1 1.5S9.448 8 10 8M6.5 3c-1.162 0-2.35.584-2.947 1.776a.5.5 0 1 0 .894.448C4.851 4.416 5.662 4 6.5 4a.5.5 0 0 0 0-1" />
                </svg>
              </div>
              <span className="delete-modal__content">
                탈퇴하시면 계정을 되돌릴 수 없습니다.
              </span>
            </div>
          </Modal>
        </div>
      </section>
    </div>
  );
}
