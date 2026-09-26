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
import "./MedicineDetails.css";

function MedicineDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const loadMedicine = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMedicineById(id);

        console.log("MEDICINE DETAILS API:", data);

        setMedicine(data);
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

  const handleAddToCart = async () => {
    if (!user?.id) {
      setCartMessage(
        "Please login before adding items to your cart."
      );
      return;
    }

    if (!medicine?.id) {
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");

      const updatedCart = await addToCart(
        user.id,
        medicine.id,
        quantity
      );

      console.log("ADD TO CART API:", updatedCart);

      setCartMessage("Medicine added to cart.");
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);

      setCartMessage(
        err.response?.data?.message ||
          "Unable to add medicine to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="medicine-details-page">
        <Link to="/medicines" className="back-link">
          <ArrowLeft size={18} />
          Back to Medicines
        </Link>

        <div className="medicine-empty">
          <h2>Loading medicine...</h2>
          <p>
            Please wait while we load the medicine details.
          </p>
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="medicine-details-page">
        <Link to="/medicines" className="back-link">
          <ArrowLeft size={18} />
          Back to Medicines
        </Link>

        <div className="medicine-empty">
          <h2>Medicine not found</h2>
          <p>
            {error ||
              "The requested medicine could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="medicine-details-page">
      <Link to="/medicines" className="back-link">
        <ArrowLeft size={18} />
        Back to Medicines
      </Link>

      <div className="medicine-details">
        <section className="medicine-image-section">
          <div className="medicine-image-placeholder">
            <span>Medicine Image</span>
          </div>
        </section>

        <section className="medicine-info">
          <span className="medicine-category">
            {medicine.category}
          </span>

          <h1>{medicine.name}</h1>

          <p className="medicine-id">
            Product ID: {medicine.id}
          </p>

          <p className="medicine-description">
            {medicine.description}
          </p>

          <div className="medicine-price">
            ₹{Number(medicine.price).toFixed(2)}
          </div>

          <div className="stock-status">
            <span className="stock-dot" />

            {medicine.active
              ? "Available"
              : "Currently unavailable"}
          </div>

          <div className="quantity-section">
            <span>Quantity</span>

            <div className="quantity-control">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1)
                  )
                }
                disabled={addingToCart}
              >
                <Minus size={16} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => current + 1)
                }
                disabled={addingToCart}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="medicine-actions">
            <button
              type="button"
              className="add-cart-button"
              onClick={handleAddToCart}
              disabled={
                addingToCart || !medicine.active
              }
            >
              <ShoppingCart size={20} />

              {addingToCart
                ? "Adding..."
                : "Add to Cart"}
            </button>

            <button
              type="button"
              className="wishlist-button"
            >
              <Heart size={20} />
            </button>
          </div>

          {cartMessage && (
            <p className="cart-message">
              {cartMessage}
            </p>
          )}

          <div className="medicine-safety">
            <ShieldCheck size={22} />

            <div>
              <strong>Safe & Trusted</strong>

              <p>
                Product information is provided by our
                medicine service.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="medicine-information">
        <h2>Product Information</h2>

        <div className="information-grid">
          <div>
            <span>Manufacturer</span>
            <strong>
              {medicine.manufacturer || "Not available"}
            </strong>
          </div>

          <div>
            <span>Generic Name</span>
            <strong>
              {medicine.genericName || "Not available"}
            </strong>
          </div>

          <div>
            <span>Category</span>
            <strong>
              {medicine.category || "Not available"}
            </strong>
          </div>

          <div>
            <span>Prescription Required</span>
            <strong>
              {medicine.prescriptionRequired
                ? "Yes"
                : "No"}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}
export default MedicineDetails;