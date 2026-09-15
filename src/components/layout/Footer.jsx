import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <HeartPulse size={26} />
            MediCare
          </Link>

          <p>
            Your trusted digital healthcare platform for medicines,
            prescriptions, orders, and healthcare assistance.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/medicines">Medicines</Link>
          <Link to="/prescriptions">Prescriptions</Link>
          <Link to="/orders">Orders</Link>
        </div>

        <div className="footer-section">
          <h3>Account</h3>

          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-section">
          <h3>Healthcare</h3>

          <Link to="/chatbot">Medical Assistant</Link>
          <Link to="/prescriptions">Prescriptions</Link>
          <Link to="/medicines">Medicines</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 MediCare. All rights reserved.</p>
        <p>Healthcare made simple.</p>
      </div>
    </footer>
  );
}

export default Footer;
