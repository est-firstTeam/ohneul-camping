import { fBService } from "../util/fbService";

const MainRecommand = () => {
  const campsites = fBService.getSearchCampSite();

  campsites.then((data) => console.log("data", data));
  return null;
};

export default MainRecommand;
