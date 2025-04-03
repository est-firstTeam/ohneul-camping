import loadingSpinner from "/src/util/loading.json";
import Lottie from "lottie-react";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "20rem",
        height: "20rem",
        margin: "2rem auto",
      }}
    >
      <Lottie animationData={loadingSpinner} />
    </div>
  );
};
export default LoadingSpinner;
