import "./profilePage.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import apiRequest from "../../lib/apiRequest.js";
import { useEffect, useState } from "react";
import Chat from "../../components/chat/chat.jsx";
import Card from "../../components/card/card.jsx";

function ProfilePage() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfilePosts = async () => {
      try {
        const res = await apiRequest.get("/users/profilePosts");
        setUserPosts(res.data.userPosts);
        setSavedPosts(res.data.savedPosts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfilePosts();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser?.avatar || "/profile-img.jpeg"}
                alt="avatar"
              />
            </span>
            <span>
              Username: <b>{currentUser?.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser?.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : userPosts.length > 0 ? (
            <div className="list">
              {userPosts.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p>No posts yet.</p>
          )}

          <div className="title">
            <h1>Saved List</h1>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : savedPosts.length > 0 ? (
            <div className="list">
              {savedPosts.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p>No saved posts yet.</p>
          )}
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
