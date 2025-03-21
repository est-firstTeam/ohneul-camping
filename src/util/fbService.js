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

  getCartItems = async (userId) => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.User),
        where("id", "==", userId)
      );
      return firebaseAPI.getQueryDocs(q);
    } catch (e) {
      throw new Error("get all Reservation Error: %o", e);
    }
  };

  getSearchCampSite = async () => {
    try {
      const q = query(
        collection(firebaseDB, CollectionName.Campsite),
        where("doNm", "==", "전라남도")
      );
      return firebaseAPI.getQueryDocs(q);
    } catch (e) {
      throw new Error("search Campsite Error: %o", e);
    }
  };
}

export const fBService = new FBService();
