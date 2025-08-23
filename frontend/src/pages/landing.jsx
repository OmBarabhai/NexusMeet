import React from "react";
import { Link } from "react-router-dom";  // ✅ import Link
import "../App.css";

export default function LandingPage() {
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>NEXUSMEET Video Call</h2>
        </div>
        <div className="navList">
          <Link to="/guest">Join as Guest</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">
            <button>Log In</button>
          </Link>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#ff9839" }}>Connect </span> with your loved ones
          </h1>
          <p>Cover a distance by NEXUSMEET video call</p>
          <div role="button">
            <Link to={"/home"} className="getStartedBtn">Get Started</Link>
          </div>
        </div>

        <div>
          <img src="/NexusMeet.png" alt="NexusMeet Illustration" />
        </div>
      </div>
    </div>
  );
}
