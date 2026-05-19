import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import Card from "../../components/card/Card";
import apiRequest from "../../lib/apiRequest";
import { useAuth } from "../../context/AuthContext.jsx";
import "./singlePage.scss";

function SinglePage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        setPost(res.data);
        setSaved(res.data.isSaved);
        
        // Fetch similar posts in the same city
        const similarRes = await apiRequest.get(`/posts?city=${res.data.city}&limit=4`);
        setSimilarPosts(similarRes.data.filter(p => p.id !== res.data.id).slice(0, 3));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaveLoading(true);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
      setSaved((prev) => !prev);
    } catch (err) {
      console.log(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChat = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await apiRequest.post("/chats", { receiverId: post.userId });
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div className="singlePage loading"><p>Loading details...</p></div>;
  if (!post) return <div className="singlePage error"><p>Post not found.</p></div>;

  return (
    <div className="singlePage">
      <div className="mainContent">
        <div className="details">
          <div className="wrapper">
            <Slider images={post.images} />
            <div className="info">
              <div className="top">
                <div className="post">
                  <h1>{post.title}</h1>
                  <div className="address">
                    <img src="/pin.png" alt="" />
                    <span>{post.address}</span>
                  </div>
                  <div className="price">$ {post.price}</div>
                </div>
                <div className="user">
                  <img src={post.user?.avatar || "/profile-img.jpeg"} alt="" />
                  <span>{post.user?.username}</span>
                </div>
              </div>
              <div className="bottom">
                {post.postDetail?.desc}
              </div>
            </div>
          </div>
        </div>

        <div className="features">
          <div className="wrapper">
            <p className="title">General</p>
            <div className="listVertical">
              <div className="feature">
                <img src="/utility.png" alt="" />
                <div className="featureText">
                  <span>Utilities</span>
                  <p>
                    {post.postDetail?.utilities === "owner"
                      ? "Owner is responsible"
                      : post.postDetail?.utilities === "tenant"
                      ? "Tenant is responsible"
                      : "Shared"}
                  </p>
                </div>
              </div>
              <div className="feature">
                <img src="/pet.png" alt="" />
                <div className="featureText">
                  <span>Pet Policy</span>
                  <p>
                    {post.postDetail?.pet === "allowed"
                      ? "Pets allowed"
                      : "No pets allowed"}
                  </p>
                </div>
              </div>
              <div className="feature">
                <img src="/fee.png" alt="" />
                <div className="featureText">
                  <span>Property Fees</span>
                  <p>{post.postDetail?.income || "Not specified"}</p>
                </div>
              </div>
            </div>

            <p className="title">Sizes</p>
            <div className="sizes">
              <div className="size">
                <img src="/size.png" alt="" />
                <span>{post.postDetail?.size || "—"} sqft</span>
              </div>
              <div className="size">
                <img src="/bed.png" alt="" />
                <span>{post.bedroom} bed{post.bedroom !== 1 ? "s" : ""}</span>
              </div>
              <div className="size">
                <img src="/bath.png" alt="" />
                <span>{post.bathroom} bath{post.bathroom !== 1 ? "s" : ""}</span>
              </div>
            </div>

            <p className="title">Nearby Places</p>
            <div className="listHorizontal">
              <div className="feature">
                <img src="/school.png" alt="" />
                <div className="featureText">
                  <span>School</span>
                  <p>
                    {post.postDetail?.school != null
                      ? `${post.postDetail.school}m away`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="feature">
                <img src="/bus.png" alt="" />
                <div className="featureText">
                  <span>Bus Stop</span>
                  <p>
                    {post.postDetail?.bus != null
                      ? `${post.postDetail.bus}m away`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="feature">
                <img src="/restaurant.png" alt="" />
                <div className="featureText">
                  <span>Restaurant</span>
                  <p>
                    {post.postDetail?.restaurant != null
                      ? `${post.postDetail.restaurant}m away`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <p className="title">Location</p>
            <div className="mapContainer">
              <Map items={[post]} />
            </div>

            <div className="buttons">
              <button onClick={handleChat}>
                <img src="/chat.png" alt="" />
                Send a Message
              </button>
              <button
                onClick={handleSave}
                disabled={saveLoading}
                style={{ backgroundColor: saved ? "#fece51" : "" }}
              >
                <img src="/save.png" alt="" />
                {saved ? "Saved" : "Save the Place"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {similarPosts.length > 0 && (
        <div className="similarSection">
          <h1 className="title">Similar Properties in {post.city}</h1>
          <div className="list">
            {similarPosts.map(p => (
              <Card key={p.id} item={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SinglePage;
