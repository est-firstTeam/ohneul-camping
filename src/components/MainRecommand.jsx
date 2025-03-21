import { useEffect } from "react";
import { fBService } from "../util/fbService";
import { useQuery } from "@tanstack/react-query";

const MainRecommand = () => {
  const { data } = useQuery({
    queryKey: ["delay"],
    queryFn: async () => fBService.getAllCampsites(),
    select: (data) => {
      return data[Math.floor(Math.random() * 30)].data;
    },
  });

  console.log(data);
  return null;
};

// const campsite = data[Math.floor(Math.random() * 30)];
export default MainRecommand;
