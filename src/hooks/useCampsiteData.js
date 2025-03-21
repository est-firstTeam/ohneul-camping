import { useEffect, useState } from "react";
import { firebaseAPI } from "../util/firebaseApi";

const useCampsiteData = () => {
  const [campsiteData, setCampsiteData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCampsites = await firebaseAPI.getAllDocs("Campsite");

        setCampsiteData(allCampsites);
        setLoading(false);
      } catch (error) {
        console.error("campsite 데이터 불러오기 실패: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { campsiteData, loading };
};

export default useCampsiteData;
