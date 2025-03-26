import { CollectionName } from "../constants/collectionName";
import { firebaseAPI } from "./firebaseApi";
import { query, where, collection } from "firebase/firestore";
import { firebaseDB } from "../firebaseConfig";

class FBService {
  getAllReservation = async () => {
    try {
      return firebaseAPI.getAllDocs(CollectionName.Reservation);
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

  fetchCartItems = async (userId) => {
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

  // getSearchCampSite = async () => {
  //   try {
  //     const q = query(
  //       collection(firebaseDB, CollectionName.Campsite),
  //       where("doNm", "==", "전라남도")
  //     );
  //     return firebaseAPI.getQueryDocs(q);
  //   } catch (e) {
  //     throw new Error("search Campsite Error: %o", e);
  //   }
  // };

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
}

export const fBService = new FBService();
