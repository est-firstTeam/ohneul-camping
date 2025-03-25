import loadingSpinner from "/src/util/loading.json";
import Lottie from "lottie-react";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "400px",
        height: "400px",
        margin: "20px auto",
      }}
    >
      <Lottie animationData={loadingSpinner} />
    </div>
  );
};
export default LoadingSpinner;
