import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  HeartPulse,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/CartContext";
import { hasRole } from "../../utils/authorization";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
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
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          <HeartPulse size={30} />
          <span>ArunCare</span>
        </Link>

        <div className="search-box">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search medicines, health products..."
          />
        </div>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/medicines">Medicines</NavLink>
          <NavLink to="/prescriptions">Prescriptions</NavLink>
          <NavLink to="/orders">Orders</NavLink>
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

                  {hasRole(user, "ADMIN") && (
                    <Link
                      to="/admin"
                      className="user-dropdown-link"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Admin dashboard
                    </Link>
                  )}

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