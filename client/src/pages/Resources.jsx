import React from "react";
import VideoSection from "../components/VideoSection";

const Resources = () => {
  return (
    <div className="bg-green-50 min-h-screen px-6 md:px-20 py-16">

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center text-green-700 mb-16">
        Sustainability Resources
      </h1>

      <VideoSection
  title="What is Sustainable Living?"
  description="Learn the basics of sustainable living and how small lifestyle changes can reduce environmental impact."
  videoId="eRLJscAlk1M"
/>

<VideoSection
  title="Climate Change Explained"
  description="Understand climate change and how we can respond."
  videoId="ifrHogDujXw"
  reverse
/>

<VideoSection
  title="Renewable Energy 101"
  description="Introduction to renewable energy sources."
  videoId="1kUE0BZtTRc"
/>

<VideoSection
  title="Zero Waste Living"
  description="Practical guide to reducing waste."
  videoId="nYDQcBQUDpw"
  reverse
/>

<VideoSection
  title="Sustainability and Future"
  description="How we can build a sustainable future."
  videoId="ifrHogDujXw"
/>
    </div>
  );
};

export default Resources;