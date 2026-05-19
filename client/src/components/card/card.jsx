import "./card.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCompare } from "../../context/CompareContext.jsx";
import apiRequest from "../../lib/apiRequest.js";
import { useState } from "react";

function Card({ item }) {
  const { currentUser } = useAuth();
  const { compareList, addToCompare, removeFromCompare } = useCompare();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(item.isSaved || false);

  const isComparing = compareList.some(p => p.id === item.id);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await apiRequest.post("/users/save", { postId: item.id });
      setSaved((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await apiRequest.post("/chats", { receiverId: item.userId });
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    if (isComparing) {
      removeFromCompare(item.id);
    } else {
      addToCompare(item);
    }
  };

  const firstImage = Array.isArray(item.images) ? item.images[0] : item.images;

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={firstImage} alt={item.title} />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">${item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom{item.bedroom !== 1 ? "s" : ""}</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom{item.bathroom !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <div className="icons">
            <div 
              className={`icon ${isComparing ? 'active' : ''}`} 
              onClick={handleCompare}
              title="Compare"
            >
              <img src="/size.png" alt="compare" />
            </div>
            <div 
              className="icon" 
              onClick={handleSave}
              style={{ backgroundColor: saved ? "var(--primary-color)" : "" }}
              title="Save"
            >
              <img src="/save.png" alt="save" />
            </div>
            <div className="icon" onClick={handleChat} title="Chat">
              <img src="/chat.png" alt="chat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;