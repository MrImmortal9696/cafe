"use client";
import React, { useState } from "react";
import BannerTextHorizontal from "../landing/BannerTextHorizontal";

const ResDiaryWidget = () => {
  const [loading, setLoading] = useState(true);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div>
      <BannerTextHorizontal
        top="Table Reservation"
        heading="Book a Reservation"
        description=""
      />

      {/* Loader with Spinner */}
      {loading && (
        <div className="flex justify-center items-center h-[640px] bg-gray-100">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src="https://booking.resdiary.com/widget/Standard/TropicalCafe/57145"
        onLoad={handleIframeLoad} // Iframe load event
        className={`w-full max-w-[95vw] h-[640px] border-none ${
          loading ? "hidden" : "block"
        }`}
        title="ResDiary Booking Widget"
      ></iframe>
    </div>
  );
};

export default ResDiaryWidget;
