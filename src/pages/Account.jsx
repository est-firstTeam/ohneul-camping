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
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { errorCodes } from "../constants/errorCodes";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { fBService } from "../util/fbService";
import myPageTitleStore from "../store/mypageTitleStore";
import profileimg from "../images/ico_profile.svg";
import { handleOpenModal } from "../util/modalUtil";
import { reservationService } from "../util/reservationService";
import nicknameIcon from "../images/ico_profile.svg";
import keyIcon from "../images/ico_password.svg";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

export default function Account() {
  const { register, handleSubmit, formState, setFocus, setValue } = useForm({
    mode: "onBlur",
    defaultValues: {
      displayName: JSON.parse(localStorage.getItem("storage-user")).state.name,
    },
  });
  const [isLoading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState("");
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
  const [pwIcons, setPwIcons] = useState([true, true]);

  const navi = useNavigate();

  useEffect(() => {
    if (userName) {
      setTitle(`${userName} 님, 반가워요!`);
    }
  }, [userName, setTitle]);

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

  const onValid = async (data) => {
    setLoading(true);
    let profileURL = null;
    let credential = null;
    data.profileImg = imgFile === null ? "" : imgFile;
    const loginMethod = auth.currentUser.providerData[0].providerId;

    if (loginMethod === "password") {
      credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        data.password
      );
    } else if (loginMethod === "google.com") {
      credential = GoogleAuthProvider.credential(
        auth.currentUser.email,
        data.password
      );
    }

    //사용자 인증 재확인
    reauthenticateWithCredential(auth.currentUser, credential)
      //인증되면 처리
      .then(async () => {
        try {
          // Storage에 유저 이미지 저장. 파일이름 -> userID
          if (imgFile !== "") {
            const locationRef = ref(
              fbStorage,
              `avatars/${auth.currentUser.uid}`
            );
            const result = await uploadBytes(locationRef, imgFile[0]);
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
            carts: user.carts,
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
            //console.log("ERR code -> ", error.code);
            setErr(errorCodes[error.code]);
          }
        } finally {
          setLoading(false);
          navi("/");
        }
      })
      //에러면 재입력요청
      .catch((error) => {
        if (error instanceof FirebaseError) {
          console.log("ERR code -> ", error.code);
          setErr(errorCodes[error.code]);
        }
        setFocus("password");
        setValue("password", "");
        setLoading(false);
        return;
      });
  };

  const deleteConfirm = async () => {
    try {
      //유저가 예약한 부분 삭제
      reservationService
        .getAllReservation(auth.currentUser.uid)
        .then((rsvArr) => {
          rsvArr.map((ele) => {
            fBService.deleteReservation(ele.id);
          });
        });
      //유저의 아바타 삭제
      const deleteRef = ref(fbStorage, `avatars/${auth.currentUser.uid}`);
      deleteObject(deleteRef)
        .then(() => {
          //console.log("UserAvatar Delete Success!!");
        })
        .catch((error) => {
          if (error instanceof FirebaseError) {
            if (error.code === "storage/object-not-found") {
              // console.log("아바타가 없는 유저. 아바타 삭제 Pass");
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
            // console.log("ERR!!", error.code);
          }
        });
      //Zustand Data 초기화
      resetUser();
      // console.log("User Delete Success!!");
    } catch (error) {
      throw new Error(error);
      // console.log("ERR!!", error);
    } finally {
      navi("/");
    }
  };

  return (
    <section className="account">
      <h2>회원 가입</h2>
      <form className="account__form" onSubmit={handleSubmit(onValid)}>
        {/* 아바타 파트 */}
        <label className="account__profile-label" htmlFor="file">
          <img src={imgPath === null ? profileimg : imgPath} />
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
        <div className="account__input-container">
          <span className="account__nickname-change-text">
            닉네임을 바꾸고싶다면 입력하세요.
          </span>
          <div className="account__input-inner">
            <img src={nicknameIcon} />
            <input
              {...register("displayName", {
                required: "닉네임은 필수값입니다.",
                maxLength: {
                  value: 8,
                  message: "8글자 이하로 만들어주세요.",
                },
              })}
              className="account__input"
              autoComplete="new-password"
              value={user.displayName}
              onFocus={() => setValue("displayName", "")}
            />
          </div>

          <span className="account__error">
            {formState.errors?.displayName?.message}
          </span>
        </div>
        {/* 비밀번호 */}
        <div className="account__input-container">
          <div className="account__input-inner">
            <img src={keyIcon} />
            <input
              {...register("password", {
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,15}$/,
                  message: "6~15자 이내 / 숫자+영문 조합 필요.",
                },
                required: "패스워드를 입력해주세요.",
              })}
              className="account__input"
              placeholder="비밀번호"
              type={pwIcons[0] ? "password" : "text"}
            />
            <button
              onClick={() => eyeToggle(0)}
              type="button"
              color="none"
              className={pwIcons[0] ? "account__icon" : "account__icon-slash"}
            ></button>
          </div>
          <span className="account__error">
            {formState.errors?.password?.message}
          </span>
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
        <button onClick={() => handleOpenModal(modalRef)}>
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
            </div>
            <span className="delete-modal__content">
              탈퇴하시면 계정을 되돌릴 수 없습니다.
            </span>
          </div>
        </Modal>
      </div>
    </section>
  );
}
