import { writeFileSync } from "fs";

// ── chat.jsx ──────────────────────────────────────────────────────────────────
writeFileSync(
  "client/src/components/chat/chat.jsx",
  `import "./chat.scss";
import { useEffect, useRef, useState } from "react";
import apiRequest from "../../lib/apiRequest.js";
import { useAuth } from "../../context/AuthContext.jsx";

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
  }, [messages]);

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
            style={{ cursor: "pointer" }}
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
`
);

// ── list.jsx ──────────────────────────────────────────────────────────────────
writeFileSync(
  "client/src/components/list/list.jsx",
  `import "./list.scss";
import Card from "../card/card";

function List({ posts = [] }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default List;
`
);

// ── newPostPage.scss additions ─────────────────────────────────────────────────
// Add missing styles for image upload section
const newPostScss = `
.newPostPage {
  display: flex;
  height: calc(100vh - 80px);

  .formContainer {
    flex: 3;
    overflow-y: scroll;
    padding: 50px;

    h1 {
      font-weight: 300;
      margin-bottom: 30px;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .item {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-size: 14px;
          font-weight: 500;
        }

        input, select, textarea {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
          font-family: inherit;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        &.description {
          grid-column: span 2;
        }
      }

      .error {
        color: red;
        font-size: 13px;
      }

      .sendButton {
        padding: 12px 20px;
        background-color: #fece51;
        border: none;
        border-radius: 5px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        width: fit-content;

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }

  .sideContainer {
    flex: 2;
    background-color: #fcf5f3;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;

    h3 {
      font-size: 18px;
      font-weight: 600;
    }

    p {
      font-size: 13px;
      color: #555;
    }

    .imageInputs {
      display: flex;
      gap: 8px;

      input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 13px;
      }

      button {
        padding: 8px 12px;
        background-color: #fece51;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
      }
    }

    .imageList {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .imageItem {
        display: flex;
        align-items: center;
        gap: 10px;

        img {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border-radius: 5px;
          border: 1px solid #ddd;
        }

        button {
          background: #ff4d4d;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .noImages {
        font-size: 12px;
        color: #999;
        font-style: italic;
      }
    }
  }
}
`;
writeFileSync("client/src/routes/newpostPage/newPostPage.scss", newPostScss);

// ── profileUpdatePage.scss ─────────────────────────────────────────────────────
const profileUpdateScss = `
.profileUpdatePage {
  display: flex;
  height: calc(100vh - 80px);

  .formContainer {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 400px;

      h1 {
        font-weight: 300;
        color: #333;
      }

      .item {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-size: 14px;
          font-weight: 500;
          color: #555;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
        }
      }

      .error {
        color: red;
        font-size: 13px;
      }

      button {
        padding: 12px;
        background-color: #fece51;
        border: none;
        border-radius: 5px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }

  .sideContainer {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fcf5f3;

    .avatar {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #fece51;
    }
  }
}
`;
writeFileSync("client/src/routes/profileUpdatePage/profileUpdatepage.scss", profileUpdateScss);

console.log("All files written successfully!");
