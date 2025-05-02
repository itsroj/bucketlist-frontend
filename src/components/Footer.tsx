import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            <div className="footer-section">
              <Link to="/about">
              <h3 className="footer-heading">About Us</h3>
              </Link>
            </div>
            <div className="footer-section">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="footer-menu">
                <li>
                  <a href="#" className="footer-link">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Email
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Bucket List App. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
