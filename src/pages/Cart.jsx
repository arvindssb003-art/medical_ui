import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getCart,
  removeFromCart,
} from "../services/cartApi";
import "./Cart.css";

function Cart() {
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getCart(user.id);

        console.log("CART API:", data);

        setCart(data);
      } catch (err) {
        console.error("CART API ERROR:", err);

        // A user may not have a cart yet.
        // Treat 404 as an empty cart instead of an error.
        if (err.response?.status === 404) {
          setCart({
            id: null,
            userId: user.id,
            items: [],
            totalAmount: 0,
          });

          setError("");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load your cart."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user?.id]);

  const handleRemove = async (medicineId) => {
    if (!user?.id) return;

    try {
      setError("");

      const updatedCart = await removeFromCart(
        user.id,
        medicineId
      );

      console.log("REMOVE CART ITEM API:", updatedCart);

      setCart(updatedCart);
    } catch (err) {
      console.error("REMOVE CART ITEM ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to remove the item."
      );
    }
  };

  const items = cart?.items || [];

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <div>
            <h1>Shopping Cart</h1>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1>Shopping Cart</h1>
          <p>
            Review your medicines and healthcare products before
            checkout.
          </p>
        </div>
      </div>

      {error && (
        <div className="cart-error">
          {error}
        </div>
      )}

      <div className="cart-layout">
        <section className="cart-items-section">
          <div className="cart-section-header">
            <h2>Cart Items</h2>

            <span>
              {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingBag size={42} />
              </div>

              <h2>Your cart is empty</h2>

              <p>
                Add medicines and healthcare products to your cart
                and they will appear here.
              </p>

              <Link
                to="/medicines"
                className="continue-shopping-button"
              >
                Browse Medicines
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                className="cart-item-placeholder"
                key={item.id}
              >
                <div className="cart-item-image">
                  Medicine
                </div>

                <div className="cart-item-info">
                  <h3>
                    Medicine #{item.medicineId}
                  </h3>

                  <p>
                    Price: ₹
                    {Number(item.price).toFixed(2)}
                  </p>

                  <div className="cart-item-bottom">
                    <div className="quantity-control">
                      <button
                        type="button"
                        disabled
                        title="Quantity update will be connected later"
                      >
                        <Minus size={16} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        disabled
                        title="Quantity update will be connected later"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <strong>
                      ₹
                      {Number(item.subtotal).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="remove-item-button"
                  onClick={() =>
                    handleRemove(item.medicineId)
                  }
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>
              ₹
              {Number(
                cart?.totalAmount || 0
              ).toFixed(2)}
            </strong>
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

            <strong>
              ₹
              {Number(
                cart?.totalAmount || 0
              ).toFixed(2)}
            </strong>
          </div>

          <Link
            to="/checkout"
            className="checkout-button"
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/medicines"
            className="summary-back-link"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;