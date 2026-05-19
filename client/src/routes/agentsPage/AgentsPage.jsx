import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { useAuth } from "../../context/AuthContext.jsx";
import "./agentsPage.scss";

function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await apiRequest.get("/users/agents");
        setAgents(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleContact = async (agentId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    // Prevent contacting yourself
    if (currentUser.id === agentId) {
      alert("You cannot contact yourself!");
      return;
    }

    try {
      await apiRequest.post("/chats", { receiverId: agentId });
      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert("Failed to start conversation. Please try again.");
    }
  };

  return (
    <div className="agentsPage">
      <h1 className="title">Our Elite Agents</h1>
      <p className="subtitle">Connect with our experts to find your perfect property.</p>
      
      {loading ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>Loading agents...</p>
      ) : (
        <div className="agentsList">
          {agents.map((agent) => (
            <div className="agentCard" key={agent.id}>
              <div className="imgContainer">
                <img src={agent.avatar || "/profile-img.jpeg"} alt={agent.username} />
              </div>
              <div className="info">
                <h2>{agent.username}</h2>
                <span className="role">Professional Agent</span>
                <div className="contact">
                  <p><b>Email:</b> {agent.email}</p>
                  <p><b>Joined:</b> {new Date(agent.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleContact(agent.id)}>
                  Contact Agent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && agents.length === 0 && (
        <p style={{ textAlign: "center", padding: "2rem" }}>No agents found.</p>
      )}
    </div>
  );
}

export default AgentsPage;
