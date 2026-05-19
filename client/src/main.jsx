import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ThemeProvider>
        <SocketContextProvider>
          <CompareProvider>
            <App />
          </CompareProvider>
        </SocketContextProvider>
      </ThemeProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
