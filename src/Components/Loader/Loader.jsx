/* eslint-disable react/prop-types */
import Lottie from "lottie-react";
import LoadingData from "../../assets/images/loading.json";

const Loader = ({ className }) => {
  return (
    <div className="flex justify-center items-center m-auto">
      <Lottie animationData={LoadingData} className={` ${className} w-52`} />
    </div>
  );
};

export default Loader;
