import { useState, useEffect } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import user_profile from "../../assets/user_profile.jpg";
// Make sure to replace the API_KEY import with an environment variable.
import { API_KEY, value_converter } from "../../data"; // Consider using process.env.REACT_APP_API_KEY
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchVideoData = async () => {
    try {
      const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(videoDetailsUrl);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setApiData(data.items[0]);
    } catch (error) {
      console.error(error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchChannelData = async () => {
    try {
      const channelDetailsUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      await fetch(channelDetailsUrl)
        .then((response) => response.json())
        .then((data) => setChannelData(data.items[0]));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCommentData = async () => {
    try {
      const commentDataUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
      await fetch(commentDataUrl)
        .then((response) => response.json())
        .then((data) => setCommentData(data.items));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchChannelData();
  }, [apiData]); //when the effect above occur, this will happens

  useEffect(() => {
    fetchCommentData();
  }, [videoId]);

  if (loading) return <p>Loading...</p>; // Show loading text
  if (error) return <p>Error: {error}</p>; // Show error message

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen // Correct casing
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : "Title here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "0 Views"}{" "}
          &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="Like" />
            {apiData ? value_converter(apiData.statistics.likeCount) : 0}
          </span>
          <span>
            <img src={dislike} alt="Dislike" />
            {apiData ? value_converter(apiData.statistics.dislikeCount) : 0}
          </span>
          <span>
            <img src={share} alt="Share" />
            Share
          </span>
          <span>
            <img src={save} alt="Save" />
            Save
          </span>
        </div>
      </div>

      <hr />
      <div className="publisher">
        <img
          src={
            channelData
              ? channelData.snippet.thumbnails.default.url
              : user_profile
          }
          alt="Publisher"
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : "Channel Name"}</p>
          <span>
            {channelData
              ? `${value_converter(
                  channelData.statistics.subscriberCount
                )} Subscribers`
              : "0 Subscribers"}
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="video-description">
        <p>{apiData ? apiData.snippet.description : "Channel description"}</p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : 0}
        </h4>
        {commentData.map((item, index) => {
          const comment = item.snippet.topLevelComment.snippet;
          return (
            <div key={index} className="comment">
              <img
                src={comment.authorProfileImageUrl || user_profile}
                alt="User"
              />
              <div>
                <h3>
                  {commentData
                    ? item.snippet.topLevelComment.snippet.authorDisplayName
                    : "username"}{" "}
                  <span>1 day ago</span>
                </h3>
                <p>
                  {" "}
                  {commentData
                    ? item.snippet.topLevelComment.snippet.textDisplay
                    : "comment"}
                </p>
                <div className="comment-action">
                  <img src={like} alt="Like" />
                  <span>{value_converter(comment.likeCount || 0)}</span>
                  <img src={dislike} alt="Dislike" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
