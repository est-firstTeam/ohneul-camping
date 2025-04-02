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
import { deleteUser, EmailAuthProvider, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { errorCodes } from "../constants/errorCodes";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { fBService } from "../util/fbService";
import myPageTitleStore from "../store/mypageTitleStore";
import profileimg from "../images/ico_profile.svg";
import { handleOpenModal } from "../util/modalUtil";
import { reservationService } from "../util/reservationService";
import keyIcon from "../images/ico_password.svg";
import nicknameIcon from "../images/ico_profile.svg";

export default function Account() {
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
    defaultValues: {
      displayName: JSON.parse(localStorage.getItem("storage-user")).state.name,
    },
  });
  const [isLoading, setLoading] = useState(false);
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
              />
            </div>

            <span className="account__error">
              {formState.errors?.displayName?.message ?? "변경할 닉네임 입력"}
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
    </div>
  );
}
