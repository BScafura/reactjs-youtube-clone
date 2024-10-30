import { useState, useEffect } from "react";
import "./Recommended.css";
import { API_KEY, value_converter } from "../../data";
import { Link } from "react-router-dom";

const Recommended = ({ categoryId }) => {
  const [apiData, setApiData] = useState(null);

  const fetchRecommendedData = async () => {
    const recommendedDataUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=PT&videoCategoryId=${categoryId}&key=${API_KEY}`;
    await fetch(recommendedDataUrl)
      .then((response) => response.json())
      .then((data) => setApiData(data.items))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchRecommendedData();
  }, [categoryId]); // Run when categoryId changes

  return (
    <div className="recommended">
      {apiData &&
        apiData.map((data, index) => {
          const thumbnailUrl = data.snippet.thumbnails.medium.url;
          const title = data.snippet.title;
          const channelName = data.snippet.channelTitle;
          const views = data.statistics.viewCount;

          return (
            <Link
              to={`/video/${data.snippet.categoryId}/${data.id}`}
              className="side-video-list"
              key={index}
            >
              <img src={thumbnailUrl} alt={title} />
              <div className="vid-info">
                <h4>{title}</h4>
                <p>{channelName}</p>
                <p>{value_converter(views)} views</p>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default Recommended;
