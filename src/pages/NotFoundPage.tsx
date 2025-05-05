import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import notFoundImage from "../assets/404-image.png";
import { useAuth } from "../lib/AuthContext";
import SpaceButton from "../components/SpaceButton";
import "../styles/notFound.css";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBack = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="page-container">
      <Navbar isUserLoggedIn={isAuthenticated} disableSettings={true} />

      <main className="not-found-container">
        <img
          src={notFoundImage}
          alt="404 Not Found"
          className="not-found-image"
        />
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-text">
          We couldn't find the page you're looking for. It might have been moved
          or deleted.
        </p>
        <SpaceButton text="BACK TO THE BUCKET" onClick={handleBack} />
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
