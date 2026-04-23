import React from "react";

const VideoSection = ({ title, description, videoId, reverse }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-10 my-16">
      <div
        className={`grid md:grid-cols-2 gap-10 items-center ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Video */}
        <div className={reverse ? "md:order-2" : ""}>
          <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-xl">
            <iframe
              className="w-full h-[300px] md:h-[400px] rounded-2xl"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Text */}
        <div className={reverse ? "md:order-1" : ""}>
          <h2 className="text-3xl font-bold text-green-700 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;