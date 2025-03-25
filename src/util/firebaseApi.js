import { firebaseDB } from "../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

class FirebaseAPI {
  getAllDocs = async (collectionName) => {
    /*
    모든 데이터를 가져옴:
  해당 collection의 모든 docs 데이터를 리턴 : {
    id : doc id
    data :값
  }
  */
    const querySnapshot = await getDocs(collection(firebaseDB, collectionName));

    return querySnapshot.docs.map((doc) => {
      return { id: doc.id, data: doc.data() };
    });
  };

  getQueryDocs = async (queryContent) => {
    /*
    데이터 쿼리: (쿼리 방법은 아래 문서 참조)
  인자로 받은 조건으로 docs 데이터를 쿼리하여 리턴 : {
    id : doc id
    data :값
  }

    */
    // https://firebase.google.com/docs/firestore/query-data/queries?hl=ko&_gl=1*18yeds5*_up*MQ..*_ga*MTY3OTE1NTIwMy4xNzQyMjc2Mzc4*_ga_CW55HF8NVT*MTc0MjI3NjM3OC4xLjAuMTc0MjI3NjM3OC4wLjAuMA..#query_operators

    const querySnapshot = await getDocs(queryContent);
    return querySnapshot.docs.map((doc) => {
      return { id: doc.id, data: doc.data() };
    });
  };

  getListQueryDocs = async (queryContent) => {
    const querySnapshot = await getDocs(queryContent);
    return querySnapshot.docs.map((doc) => {
      const {
        contentId,
        firstImageUrl,
        facltNm,
        doNm,
        addr1,
        sigunguNm,
        induty,
        siteMg1CoPrice,
        siteMg2CoPrice,
        siteMg3CoPrice,
        caravSiteCoPrice,
      } = doc.data();
      return {
        id: doc.id,
        data: {
          contentId,
          firstImageUrl,
          facltNm,
          doNm,
          addr1,
          sigunguNm,
          induty,
          siteMg1CoPrice,
          siteMg2CoPrice,
          siteMg3CoPrice,
          caravSiteCoPrice,
        },
      };
    });
  };
}

export const firebaseAPI = new FirebaseAPI();
