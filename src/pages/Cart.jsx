import { Link } from "react-router-dom";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import "./Cart.css";

function Cart() {
  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1>Shopping Cart</h1>
          <p>Review your medicines and healthcare products before checkout.</p>
        </div>
      </div>

      <div className="cart-layout">
        <section className="cart-items-section">
          <div className="cart-section-header">
            <h2>Cart Items</h2>
            <span>0 items</span>
          </div>

          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={42} />
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Add medicines and healthcare products to your cart and they
              will appear here.
            </p>

            <Link to="/medicines" className="continue-shopping-button">
              Browse Medicines
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Product item skeleton for later backend integration */}
          <div className="cart-item-placeholder">
            <div className="cart-item-image">Image</div>

            <div className="cart-item-info">
              <h3>Medicine Name</h3>
              <p>Medicine category</p>

              <div className="cart-item-bottom">
                <div className="quantity-control">
                  <button>
                    <Minus size={16} />
                  </button>

                  <span>1</span>

                  <button>
                    <Plus size={16} />
                  </button>
                </div>

                <strong>₹0.00</strong>
              </div>
            </div>

            <button className="remove-item-button">
              <Trash2 size={18} />
            </button>
          </div>
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹0.00</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <strong>₹0.00</strong>
          </div>

          <div className="summary-row">
            <span>Discount</span>
            <strong>₹0.00</strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹0.00</strong>
          </div>

          <Link to="/checkout" className="checkout-button">
            Proceed to Checkout
            <ArrowRight size={18} />
          </Link>

          <Link to="/medicines" className="summary-back-link">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;