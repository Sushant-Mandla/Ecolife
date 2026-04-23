import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsSection = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/news")
      .then(res => setArticles(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="px-8 py-16 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">
        🌍 Latest Sustainability News
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={article.urlToImage}
              alt=""
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {article.description}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="text-green-700 font-semibold"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
