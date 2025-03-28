import { CollectionName } from "../constants/collectionName";
import { firebaseAPI } from "./firebaseApi";
import { query, where, collection } from "firebase/firestore";
import { firebaseDB } from "../firebaseConfig";

class FBService {
  getAllReservation = async (userId) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.Reservation),
        where("userId", "==", userId) // 해당 userId 정보만 가져옴
      );
      return await firebaseAPI.getQueryDocs(q);
    } catch (e) {
      throw new Error("get all Reservation Error: %o", e);
    }
  };

  getAllCampsites = async () => {
    try {
      return firebaseAPI.getAllDocs(CollectionName.Campsite);
    } catch (e) {
      throw new Error("get all Reservation Error: %o", e);
    }
  };

  fetchUser = async (userId) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.User),
        where("id", "==", userId)
      );
      return await firebaseAPI.getQueryDocs(q);
    } catch (e) {
      throw new Error("get all Reservation Error: %o", e);
    }
  };

  getSearchARSV = async (location, startDate) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.Available_RSV),
        where("address", "==", location),
        where("date", "==", startDate)
      );
      return firebaseAPI.getQueryDocs(q);
    } catch (e) {
      throw new Error("search AvailableRSV Error: %o", e);
    }
  };

  getSearchCampSite = async (contentId) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.Campsite),
        where("contentId", "==", contentId)
      );
      return firebaseAPI.getListQueryDocs(q);
    } catch (e) {
      throw new Error("search Campsite Error: %o", e);
    }
  };

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

  // User 컬렉션: name
  getUserNameById = async (userId) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.User),
        where("id", "==", userId)
      );
      const users = await firebaseAPI.getQueryDocs(q);

      if (users.length > 0) {
        return users[0].data.name;
      }
      return null;
    } catch (e) {
      console.error("get User Name By Id Error: %o", e);
      return null;
    }
  };

  getCampsiteData = async (ids) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.Campsite),
        where("contentId", "==", ids.toString())
      );
      const result = await firebaseAPI.getQueryDocs(q);
      return result;
    } catch (e) {
      console.error("get getCampsiteData Error: %o", e);
      return null;
    }
  };

  getUserCartItems = async (users) => {
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
        const campSiteInfoData = campSiteInfo[0].data;

        const priceInfo = {
          siteSPrice: campSiteInfoData.siteMg1CoPrice,
          siteMPrice: campSiteInfoData.siteMg2CoPrice,
          siteLPrice: campSiteInfoData.siteMg3CoPrice,
          siteCPrice: campSiteInfoData.caravSiteCoPrice,
        };

        return { ...cart, ...priceInfo };
      })
    );
    return cartItems ?? [];
  };

  insertUserCart = async (userId, carts) => {
    await firebaseAPI.updateData(CollectionName.User, userId, carts);
  };
}

export const fBService = new FBService();
