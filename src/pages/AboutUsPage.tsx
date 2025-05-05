import { useEffect } from "react";
import "../styles/about.css";
import aboutUsImage from "../assets/about-us.png";
import githubIcon from "../assets/github.png";
import linkedinIcon from "../assets/linkedin.png";
import Navbar from "../components/Navbar"; // Import your Navbar component
import Footer from "../components/Footer"; // Import your Footer component
import SpaceButton from "../components/SpaceButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

const AboutUsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Set document title when component mounts
    document.title = "About Us | Bucket List";
  }, []);

  const handleBack = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="page-container">
      <Navbar isUserLoggedIn={isAuthenticated} />

      <main className="about-container">
        <div className="about-content">
          <h1>About Us</h1>

          <div className="about-image-container">
            <img
              src={aboutUsImage}
              alt="Rojda and Vassilis"
              className="about-image"
            />
          </div>

          <div className="about-text">
            <p>Hey there!</p>

            <p>
              We're Rojda and Vassilis – two professional daydreamers, adventure
              seekers, and expert pizza eaters. One random afternoon (probably
              while we were supposed to be doing something productive), we
              realized we had a serious problem: too many dreams, too little
              organization.
            </p>

            <p>Enter the idea for this Bucketlist website!</p>

            <p>
              Instead of just talking about all the crazy, fun, and sometimes
              completely ridiculous things we wanted to do "one day," we decided
              to actually write them down – and invite you to join the chaos!
            </p>

            <h2>Our mission?</h2>

            <p>
              Make sure no dream is left behind — whether it's skydiving, baking
              the world's biggest cookie, eating pizza in every country, or
              learning to juggle flaming torches (disclaimer: we're still
              practicing... badly).
            </p>

            <p>In short: life's too short to keep saying "maybe later."</p>

            <p>
              So grab your biggest dreams (and maybe a helmet), and let's make
              them happen!
            </p>
          </div>

          {/* Updated social buttons section */}
          <div className="social-profiles-container">
            <div className="profile-links">
              <h3>Rojda Polat</h3>
              <div className="social-buttons">
                <a
                  href="https://github.com/itsroj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button github"
                >
                  <img src={githubIcon} alt="GitHub" className="social-icon" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/rojdapolat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button linkedin"
                >
                  <img
                    src={linkedinIcon}
                    alt="LinkedIn"
                    className="social-icon"
                  />
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="profile-links">
              <h3>Vassilis Bousbourelis</h3>
              <div className="social-buttons">
                <a
                  href="https://github.com/vasbous"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button github"
                >
                  <img src={githubIcon} alt="GitHub" className="social-icon" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/vassilis-bousbourelis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button linkedin"
                >
                  <img
                    src={linkedinIcon}
                    alt="LinkedIn"
                    className="social-icon"
                  />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="back-button-container">
            <SpaceButton text="BACK TO THE BUCKET" onClick={handleBack} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
