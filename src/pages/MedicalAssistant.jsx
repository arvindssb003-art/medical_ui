import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getMedicineById } from "../services/medicineApi";
import { addToCart } from "../services/cartApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./MedicineDetails.css";

function MedicineDetails() {
  const { id } = useParams();

  const { user } = useAuth();
  const { refreshCartCount } = useCart();

  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [showCartToast, setShowCartToast] = useState(false);

  useEffect(() => {
    const loadMedicine = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMedicineById(id);

        console.log("MEDICINE DETAILS API:", data);

        setMedicine(data);
        setQuantity(1);
      } catch (err) {
        console.error("MEDICINE DETAILS API ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load medicine details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMedicine();
  }, [id]);

  const handleDecrease = () => {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1)
    );
  };

  const handleIncrease = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleAddToCart = async () => {
    if (!user?.id) {
      setCartMessage(
        "Please login before adding items to your cart."
      );
      setShowCartToast(false);
      return;
    }

    if (!medicine?.id) {
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");
      setShowCartToast(false);

      const updatedCart = await addToCart(
        user.id,
        medicine.id,
        quantity
      );

      console.log("ADD TO CART API:", updatedCart);

      // Update the cart badge in the Navbar.
      await refreshCartCount();

      setCartMessage("Medicine added to cart.");
      setShowCartToast(true);

      setTimeout(() => {
        setShowCartToast(false);
      }, 2500);
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);

      setCartMessage(
        err.response?.data?.message ||
          "Unable to add medicine to cart."
      );

      setShowCartToast(false);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="medicine-details-page">
        <div className="medicine-details-loading">
          Loading medicine details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medicine-details-page">
        <div className="medicine-details-error">
          <h2>Unable to load medicine</h2>
          <p>{error}</p>

          <Link
            to="/medicines"
            className="back-to-medicines-button"
          >
            <ArrowLeft size={18} />
            Back to Medicines
          </Link>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="medicine-details-page">
        <div className="medicine-details-error">
          <h2>Medicine not found</h2>
          <p>
            The requested medicine could not be found.
          </p>

          <Link
            to="/medicines"
            className="back-to-medicines-button"
          >
            <ArrowLeft size={18} />
            Back to Medicines
          </Link>
        </div>
      </div>
    );
  }

  const medicineName =
    medicine.name ||
    medicine.medicineName ||
    `Medicine #${medicine.id}`;

  const medicineDescription =
    medicine.description ||
    "Quality healthcare medicine available through MediCare.";

  const price = Number(medicine.price || 0);

  const isActive =
    medicine.active !== false &&
    medicine.isActive !== false;

  return (
    <div className="medicine-details-page">

      {showCartToast && (
        <div className="cart-toast">
          <span className="cart-toast-icon">✓</span>
          <span>Medicine added to cart</span>
        </div>
      )}

      <div className="medicine-details-container">

        <Link
          to="/medicines"
          className="medicine-back-link"
        >
          <ArrowLeft size={18} />
          Back to Medicines
        </Link>

        <div className="medicine-details-card">

          <div className="medicine-details-image-section">
            <div className="medicine-details-image">
              <span>Medicine</span>
            </div>

            <button
              type="button"
              className="medicine-wishlist-button"
              title="Add to wishlist"
            >
              <Heart size={21} />
            </button>
          </div>

          <div className="medicine-details-content">

            <div className="medicine-details-category">
              Healthcare Product
            </div>

            <h1>{medicineName}</h1>

            <p className="medicine-details-description">
              {medicineDescription}
            </p>

            <div className="medicine-details-price">
              ₹{price.toFixed(2)}
            </div>

            <div className="medicine-details-status">
              <ShieldCheck size={18} />

              <span>
                {isActive
                  ? "Available for purchase"
                  : "Currently unavailable"}
              </span>
            </div>

            <div className="medicine-details-divider" />

            <div className="medicine-details-info">
              <div className="medicine-info-item">
                <span>Medicine ID</span>
                <strong>{medicine.id}</strong>
              </div>

              {medicine.manufacturer && (
                <div className="medicine-info-item">
                  <span>Manufacturer</span>
                  <strong>
                    {medicine.manufacturer}
                  </strong>
                </div>
              )}

              {medicine.category && (
                <div className="medicine-info-item">
                  <span>Category</span>
                  <strong>
                    {medicine.category}
                  </strong>
                </div>
              )}
            </div>

            <div className="medicine-details-divider" />

            <div className="medicine-purchase-section">

              <div className="quantity-section">
                <span>Quantity</span>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={
                      quantity <= 1 ||
                      addingToCart ||
                      !isActive
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={
                      addingToCart ||
                      !isActive
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={
                  addingToCart ||
                  !isActive
                }
              >
                <ShoppingCart size={19} />

                {addingToCart
                  ? "Adding..."
                  : isActive
                  ? "Add to Cart"
                  : "Unavailable"}
              </button>

            </div>

            {cartMessage && !showCartToast && (
              <div className="cart-message">
                {cartMessage}
              </div>
            )}

            {user?.id && (
              <p className="medicine-login-status">
                Signed in as{" "}
                <strong>
                  {user.username || user.email}
                </strong>
              </p>
            )}

          </div>
        </div>

        <div className="medicine-details-benefits">

          <div className="benefit-card">
            <ShieldCheck size={24} />

            <div>
              <h3>Trusted Products</h3>
              <p>
                Medicines sourced through our
                healthcare platform.
              </p>
            </div>
          </div>

          <div className="benefit-card">
            <ShoppingCart size={24} />

            <div>
              <h3>Easy Ordering</h3>
              <p>
                Add medicines to your cart and
                order whenever you need them.
              </p>
            </div>
          </div>

          <div className="benefit-card">
            <Heart size={24} />

            <div>
              <h3>Healthcare Support</h3>
              <p>
                Access medicines, prescriptions,
                and healthcare assistance in one place.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MedicineDetails;