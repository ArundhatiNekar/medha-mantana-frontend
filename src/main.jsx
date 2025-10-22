import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/AnimatedAuth.css"; // keep your styling imports

// ✅ Import Google OAuth provider
import { GoogleOAuthProvider } from "@react-oauth/google";

// ⚙️ Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "527955007857-b3aqe85ng77sr8295dlulof86rb2orin.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap the app so Google buttons work */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
