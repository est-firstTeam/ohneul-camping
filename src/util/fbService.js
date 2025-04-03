import { CollectionName } from "../constants/collectionName";
import { firebaseAPI } from "./firebaseApi";
import { query, where, collection, deleteDoc, doc } from "firebase/firestore";
import { firebaseDB } from "../firebaseConfig";

class FBService {
  // 모든 캠핑장 조회
  getAllCampsites = async () => {
    try {
      return firebaseAPI.getAllDocs(CollectionName.Campsite);
    } catch (e) {
      throw new Error("모든 캠핑장 조회 실패: %o", e);
    }
  };

  // 캠핑장 검색
  getSearchCampSite = async (contentId) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.Campsite),
        where("contentId", "==", contentId)
      );
      return firebaseAPI.getListQueryDocs(q);
    } catch (e) {
      throw new Error("캠핑장 검색 실패: %o", e);
    }
  };

  // id로 캠핑장 조회
  getCampsiteData = async (id) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.Campsite),
        where("contentId", "==", id.toString())
      );
      const result = await firebaseAPI.getQueryDocs(q);
      return result[0].data;
    } catch (e) {
      console.error("캠핑장 id로 조회 실패: %o", e);
      return null;
    }
  };

  // 유저 가져오기
  fetchUser = async (userId) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.User),
        where("id", "==", userId)
      );
      return await firebaseAPI.getQueryDocs(q);
    } catch (e) {
      throw new Error("유저 정보 가져오기 실패: %o", e);
    }
  };

  // 예약 가능데이터 검색
  getSearchARSV = async (location, startDate) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.Available_RSV),
        where("address", "==", location),
        where("date", "==", startDate)
      );
      return firebaseAPI.getQueryDocs(q);
    } catch (e) {
      throw new Error("예약 가능데이터 검색 실패: %o", e);
    }
  };

  // 모든 지역의 예약 가능데이터 검색
  getSearchAllARSV = async (startDate) => {
    try {
      const location = [
        "서울시",
        "인천시",
        "경기도",
        "강원도",
        "대전시",
        "세종시",
        "대구시",
        "부산시",
        "울산시",
        "전주시",
        "광주시",
        "충청남도",
        "충청북도",
        "전라남도",
        "전라북도",
        "경상남도",
        "경상북도",
        "제주도",
      ];

      const q = query(
        collection(firebaseDB, CollectionName.Available_RSV),
        where("date", "==", startDate),
        where("address", "in", location)
      );
      return firebaseAPI.getQueryAllSearchDocs(q);
    } catch (e) {
      console.error(e);
      throw new Error("search All AvailableRSV Error: %o", e);
    }
  };

  // 해당 유저의 장바구니 내역조회 + 캠핑장 가격,지역이름 조회 후 조합하여 리턴
  getUserCartItems = async (users) => {
    try {
      const hasCartItems =
        users &&
        users[0] &&
        users[0].data &&
        users[0].data.carts &&
        users[0].data.carts.length > 0;

      if (!hasCartItems) {
        return [];
      }
      const carts = users[0].data.carts;
      // cart의 campsiteId를 가져와 campsite의 각 사이트 price조회
      const cartItems = await Promise.all(
        carts.map(async (cart) => {
          const campSiteInfo = await fBService.getCampsiteData(cart.campSiteId);
          // const campSiteInfoData = campSiteInfo[0].data;

          const priceInfo = {
            siteSPrice: campSiteInfo.siteMg1CoPrice,
            siteMPrice: campSiteInfo.siteMg2CoPrice,
            siteLPrice: campSiteInfo.siteMg3CoPrice,
            siteCPrice: campSiteInfo.caravSiteCoPrice,
          };

          return { ...cart, ...priceInfo, doNM: campSiteInfo.doNm };
        })
      );
      return cartItems ?? [];
    } catch (error) {
      console.error("장바구니 데이터 조회에 실패%o:", error);
      throw new Error("장바구니 데이터 조회에 실패했습니다.");
    }
  };

  // 장바구니 데이터 업데이트
  insertUserCart = async (userId, carts) => {
    try {
      const data = { carts: carts };
      await firebaseAPI.updateData(CollectionName.User, userId, data);
    } catch (error) {
      console.error("장바구니 데이터 업데이트 실패%o:", error);
      throw new Error("장바구니 데이터 업데이트에 실패했습니다");
    }
  };

  // 예약데이터 추가
  insertReservation = async (reservation) => {
    try {
      await firebaseAPI.insertData(CollectionName.Reservation, reservation);
    } catch (error) {
      console.error("예약 데이터 추가 오류%o:", error);
      throw new Error("예약 데이터 추가에 실패했습니다.");
    }
  };

  // 예약 완료 횟수 증가
  increaseRsvComplete = async (contentId) => {
    try {
      const campsiteQuery = query(
        collection(firebaseDB, CollectionName.Campsite),
        where("contentId", "==", contentId.toString())
      );
      const campsite = await firebaseAPI.getQueryDocs(campsiteQuery);

      if (campsite.empty) {
        throw new Error("해당 contentId를 가진 캠핑장을 찾을 수 없습니다.");
      }

      const campsiteData = campsite[0].data; // Campsite : 캠핑장 정보 가져오기
      const currentCount = campsiteData.rsvComplete || 0; // 캠핑장 예약 수 증가 (rsvComplete +1)

      await firebaseAPI.updateData(CollectionName.Campsite, contentId, {
        rsvComplete: currentCount + 1,
      });

      // console.log(
      //   `rsvComplete 업데이트에 성공했습니다. (새 값: ${currentCount + 1})`
      // );
    } catch (error) {
      console.error("rsvComplete 오류:%o", error);
      throw new Error("rsvComplete 업데이트에 실패했습니다.");
    }
  };

  deleteReservation = async (reservationId) => {
    try {
      await deleteDoc(
        doc(firebaseDB, CollectionName.Reservation, reservationId)
      );
    } catch (e) {
      throw new Error("get all Reservation Error: %o", e);
    }
  };

  deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(firebaseDB, CollectionName.User, userId));
    } catch (e) {
      throw new Error("get all Reservation Error: %o", e);
    }
  };
}

export const fBService = new FBService();
