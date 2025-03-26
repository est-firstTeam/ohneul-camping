import { firebaseDB } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

class ReservationService {
  // 예약 취소
  cancelReservation = async (reservationId) => {
    const reservationRef = doc(firebaseDB, "Reservation", reservationId);
    try {
      await updateDoc(reservationRef, {
        rsvIsCanceled: true, // 예약 취소(true) 상태로 DB 업데이트
      });
    } catch (error) {
      console.error("예약 취소 오류:", error);
      throw new Error("예약 취소에 실패했습니다.");
    }
  };

  // 예약수 감소
  decrementRsvComplete = async (contentId) => {
    try {
      // Campsite에서 contentId 조회
      const campsiteQuery = query(
        collection(firebaseDB, "Campsite"),
        where("contentId", "==", String(contentId))
      );
      const querySnapshot = await getDocs(campsiteQuery);

      if (querySnapshot.empty) {
        throw new Error("해당 contentId를 가진 캠핑장을 찾을 수 없습니다.");
      }

      // Campsite : 캠핑장 정보 가져오기
      const campsiteDoc = querySnapshot.docs[0];
      const campsiteRef = campsiteDoc.ref; // doc(firebaseDB, "Campsite", campsiteDoc.id)
      const campsiteData = campsiteDoc.data();

      // 캠핑장 예약 수 감소 (rsvComplete -1)
      const currentCount = campsiteData.rsvComplete || 0;
      const newCount = Math.max(0, currentCount - 1); // 0 이하로 내려가지 않음

      await updateDoc(campsiteRef, { rsvComplete: newCount });
      console.log(`rsvComplete 업데이트에 성공했습니다. (새 값: ${newCount})`);
    } catch (error) {
      console.error("rsvComplete 오류:", error);
      throw new Error("rsvComplete 업데이트에 실패했습니다.");
    }
  };
}

export const reservationService = new ReservationService();
