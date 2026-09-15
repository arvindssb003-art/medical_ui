import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, HeartPulse } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          <HeartPulse size={30} />
          <span>MediCare</span>
        </Link>

        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search medicines, health products..."
          />
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/medicines">Medicines</Link>
          <Link to="/prescriptions">Prescriptions</Link>
          <Link to="/orders">Orders</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="icon-button">
            <ShoppingCart size={22} />
          </Link>

          <Link to="/login" className="login-button">
            <User size={18} />
            Login
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
