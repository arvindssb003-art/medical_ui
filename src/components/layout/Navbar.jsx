import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  HeartPulse,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItemCount } = useCart();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

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

          <Link to="/cart" className="icon-button cart-icon-button">
            <ShoppingCart size={22} />

            {cartItemCount > 0 && (
              <span className="cart-badge">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div
              className="user-menu-container"
              ref={userMenuRef}
            >
              <button
                type="button"
                className="login-button user-menu-button"
                onClick={() =>
                  setShowUserMenu((previous) => !previous)
                }
              >
                <User size={18} />

                <span>
                  {user.username || user.firstName || "Account"}
                </span>

                <ChevronDown
                  size={16}
                  className={
                    showUserMenu
                      ? "user-chevron-open"
                      : ""
                  }
                />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-dropdown-name">
                    {user.username || "Account"}
                  </div>

                  <Link
                    to="/profile"
                    className="user-dropdown-link"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    className="user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button">
              <User size={18} />
              Login
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;