import { firebaseDB } from "../firebaseConfig";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
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

  getQueryAllSearchDocs = async (queryContent) => {
    const querySnapshot = await getDocs(queryContent);

    const mergedContent = querySnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      return acc.concat(data.content);
    }, []);
    return [
      {
        id: new Date().toISOString(),
        data: { content: mergedContent },
      },
    ];
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

  updateData = async (collectionName, docName, data) => {
    /*
    데이터 update
    https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko&_gl=1*4dt7ou*_up*MQ..*_ga*NDQwNDY2NDAyLjE3NDMxMzc0Nzg.*_ga_CW55HF8NVT*MTc0MzEzNzQ3OC4xLjAuMTc0MzEzNzQ3OC4wLjAuMA..#update-data
    */
    const ref = doc(firebaseDB, collectionName, docName);
    await updateDoc(ref, data);
  };

  insertData = async (collectionName, data) => {
    /*
    데이터 insert
    https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko&_gl=1*1xljah9*_up*MQ..*_ga*MTM5MTExODI2NS4xNzQzNDcxNTI4*_ga_CW55HF8NVT*MTc0MzQ3MTUyNy4xLjAuMTc0MzQ3MTUyNy4wLjAuMA..#add_a_document
    */
    await addDoc(collection(firebaseDB, collectionName), data);
  };
}

export const firebaseAPI = new FirebaseAPI();
