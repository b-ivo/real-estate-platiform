import "./chat.scss";
import { useEffect, useRef, useState } from "react";
import apiRequest from "../../lib/apiRequest.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + " min ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + " hr ago";
  return Math.floor(hrs / 24) + " days ago";
}

function Chat() {
  const [chats, setChats] = useState([]);
  const [openChat, setOpenChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const messageEndRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await apiRequest.get("/chats");
        setChats(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, openChat]);

  useEffect(() => {
    const getMessage = (data) => {
      if (openChat?.id === data.chatId) {
        setMessages((prev) => [...prev, data]);
        // Also update last message in chats list
        setChats((prev) =>
          prev.map((c) => (c.id === data.chatId ? { ...c, lastMessage: data.text } : c))
        );
      }
    };

    socket?.on("getMessage", getMessage);

    return () => {
      socket?.off("getMessage", getMessage);
    };
  }, [socket, openChat]);

  const handleOpenChat = async (chat) => {
    setOpenChat(chat);
    try {
      const res = await apiRequest.get("/chats/" + chat.id);
      setMessages(res.data.messages);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !openChat) return;
    try {
      const res = await apiRequest.post("/messages/" + openChat.id, { text });
      setMessages((prev) => [...prev, res.data]);
      setText("");
      
      // Emit socket event
      socket.emit("sendMessage", {
        receiverId: openChat.receiver.id,
        data: res.data,
      });

      setChats((prev) =>
        prev.map((c) => (c.id === openChat.id ? { ...c, lastMessage: text } : c))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats.length === 0 && (
          <p style={{ padding: "1rem", color: "#888" }}>No conversations yet.</p>
        )}
        {chats.map((chat) => (
          <div
            className="message"
            key={chat.id}
            onClick={() => handleOpenChat(chat)}
            style={{ 
              cursor: "pointer",
              backgroundColor: openChat?.id === chat.id ? "var(--soft-bg)" : "transparent"
            }}
          >
            <img src={chat.receiver?.avatar || "/profile-img.jpeg"} alt="" />
            <span>{chat.receiver?.username || "User"}</span>
            <p>{chat.lastMessage || "Start a conversation"}</p>
          </div>
        ))}
      </div>

      {openChat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={openChat.receiver?.avatar || "/profile-img.jpeg"} alt="" />
              <span>{openChat.receiver?.username}</span>
            </div>
            <span className="close" onClick={() => setOpenChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={"chatMessage" + (msg.userId === currentUser?.id ? " own" : "")}
              >
                <p>{msg.text}</p>
                <span>{timeAgo(msg.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <div className="bottom">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
