import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/card/card";
import Filter from "../../components/filter/filter";
import Map from "../../components/map/Map";
import apiRequest from "../../lib/apiRequest";
import "./listPage.scss";

function ListPage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest.get("/posts", {
          params: Object.fromEntries(searchParams.entries()),
        });
        setPosts(res.data);
      } catch (err) {
        setError("Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [searchParams]);

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          {loading && <p className="info">Loading listings...</p>}
          {error && <p className="info error">{error}</p>}
          {!loading && !error && posts.length === 0 && (
            <p className="info">No listings found. Try different filters.</p>
          )}
          {posts.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="mapContainer">
        <Map items={posts} />
      </div>
    </div>
  );
}

export default ListPage;
