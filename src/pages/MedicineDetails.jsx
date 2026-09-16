import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import "./MedicineDetails.css";

function MedicineDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

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
            Healthcare Product
          </span>

          <h1>Medicine Name</h1>

          <p className="medicine-id">
            Product ID: {id}
          </p>

          <div className="medicine-rating">
            ★★★★★
            <span>4.8 (120 reviews)</span>
          </div>

          <p className="medicine-description">
            Medicine description and important product information
            will be loaded from the medicine service.
          </p>

          <div className="medicine-price">
            ₹0.00
          </div>

          <div className="stock-status">
            <span className="stock-dot" />
            Availability will be checked from inventory
          </div>

          <div className="quantity-section">

            <span>Quantity</span>

            <div className="quantity-control">

              <button
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
              >
                <Minus size={16} />
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity((current) => current + 1)}
              >
                <Plus size={16} />
              </button>

            </div>

          </div>

          <div className="medicine-actions">

            <button className="add-cart-button">
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <button className="wishlist-button">
              <Heart size={20} />
            </button>

          </div>

          <div className="medicine-safety">

            <ShieldCheck size={22} />

            <div>
              <strong>Safe & Trusted</strong>
              <p>
                Product information and availability will be
                verified through our backend services.
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
            <strong>To be loaded</strong>
          </div>

          <div>
            <span>Category</span>
            <strong>To be loaded</strong>
          </div>

          <div>
            <span>Dosage</span>
            <strong>To be loaded</strong>
          </div>

          <div>
            <span>Prescription Required</span>
            <strong>To be loaded</strong>
          </div>

        </div>

      </section>

    </div>
  );
}

export default MedicineDetails;