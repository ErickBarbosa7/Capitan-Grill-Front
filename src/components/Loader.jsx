import React from "react";
import LottiePackage from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";
import "./Loader.css";

const Lottie = LottiePackage.default || LottiePackage;

export const Loader = ({ size = 100, fullScreen = false, speed = 2 }) => {
  return (
    <div className={`loader-container ${fullScreen ? "fullscreen" : ""}`}>
      <div className="lottie-wrapper" style={{ width: size, height: size }}>
        <Lottie 
          animationData={loadingAnimation} 
          loop={true} 
          autoplay={true} 
          speed={speed}
        />
      </div>
    </div>
  );
};