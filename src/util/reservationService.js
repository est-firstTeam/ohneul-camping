import { firebaseDB } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDoc,
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

  // 예약 취소 복구 'rsvIsCanceled: false' 시 rsvComplete +1
  restoreReservation = async (reservationId) => {
    const reservationRef = doc(firebaseDB, "Reservation", reservationId);
    try {
      // 예약 데이터 가져오기
      const reservationDoc = await getDoc(reservationRef);
      if (!reservationDoc.exists()) {
        throw new Error("해당 예약이 존재하지 않습니다.");
      }
      const reservationData = reservationDoc.data();

      // 이미 복구된 예약이면 작업 X
      if (!reservationData.rsvIsCanceled) {
        console.log("이미 활성화된 예약입니다.");
        return;
      }

      // 캠핑장 예약 수 증가 (rsvComplete +1)
      const campSiteId = reservationData.campSiteId;
      if (campSiteId) {
        const campsiteQuery = query(
          collection(firebaseDB, "Campsite"),
          where("contentId", "==", String(campSiteId)) // contentId와 비교
        );
        const campsiteSnapshot = await getDocs(campsiteQuery);
        if (!campsiteSnapshot.empty) {
          const campsiteDoc = campsiteSnapshot.docs[0]; // 첫 번째 문서 가져오기
          const campsiteRef = doc(firebaseDB, "Campsite", campsiteDoc.id);
          const currentCount = campsiteDoc.data().rsvComplete || 0;

          // rsvComplete +1 업데이트
          await updateDoc(campsiteRef, { rsvComplete: currentCount + 1 });
        }
      }

      // 예약 취소 복구 (rsvIsCanceled: false)
      await updateDoc(reservationRef, { rsvIsCanceled: false });
    } catch (error) {
      console.error("예약 취소 복구 오류:", error);
      throw new Error("예약 복구에 실패했습니다.");
    }
  };
}

export const reservationService = new ReservationService();
