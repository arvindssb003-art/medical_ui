import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
  WalletCards,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../services/cartApi";
import { createOrder } from "../services/orderApi";
import "./Checkout.css";

function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [placingOrder, setPlacingOrder] = useState(false);

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

        console.log("CHECKOUT CART API:", data);

        setCart(data);
      } catch (err) {
        console.error("CHECKOUT CART API ERROR:", err);

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

  const items = cart?.items || [];

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      setError("Please login before placing your order.");
      return;
    }

    if (items.length === 0) {
      setError(
        "Your cart is empty. Add medicines before placing an order."
      );
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const orderData = {
        items: items.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
        })),
        paymentMethod,
      };

      console.log("CREATE ORDER REQUEST:", orderData);

      const order = await createOrder(orderData);

      console.log("CREATE ORDER RESPONSE:", order);

      navigate(`/orders/${order.id}`);
    } catch (err) {
      console.error("CREATE ORDER ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-header">
          <Link
            to="/cart"
            className="checkout-back-link"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>

          <h1>Checkout</h1>
          <p>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-header">
          <Link
            to="/cart"
            className="checkout-back-link"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>

          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
        </div>

        <div className="checkout-empty">
          <h2>No items to checkout</h2>

          <p>
            Add medicines to your cart before proceeding
            to checkout.
          </p>

          <Link
            to="/medicines"
            className="continue-checkout-button"
          >
            Browse Medicines
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = Number(
    cart?.totalAmount || 0
  );

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link
          to="/cart"
          className="checkout-back-link"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <h1>Checkout</h1>

        <p>
          Complete your delivery and payment details to
          place your order.
        </p>
      </div>

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      <div className="checkout-layout">
        <main className="checkout-main">
          <section className="checkout-card">
            <div className="checkout-card-header">
              <MapPin size={22} />

              <div>
                <h2>Delivery Address</h2>

                <p>
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>

                <textarea
                  rows="3"
                  placeholder="House number, street, locality"
                />
              </div>

              <div className="form-row three-columns">
                <div className="form-group">
                  <label>City</label>

                  <input
                    type="text"
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label>State</label>

                  <input
                    type="text"
                    placeholder="State"
                  />
                </div>

                <div className="form-group">
                  <label>PIN Code</label>

                  <input
                    type="text"
                    placeholder="PIN code"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-header">
              <Truck size={22} />

              <div>
                <h2>Delivery Method</h2>

                <p>
                  Select your preferred delivery option.
                </p>
              </div>
            </div>

            <label className="delivery-option selected">
              <input
                type="radio"
                name="delivery"
                value="standard"
                defaultChecked
              />

              <div className="delivery-option-content">
                <strong>Standard Delivery</strong>

                <span>
                  Delivery within the estimated delivery
                  period
                </span>
              </div>

              <strong>₹0.00</strong>
            </label>

            <label className="delivery-option">
              <input
                type="radio"
                name="delivery"
                value="express"
              />

              <div className="delivery-option-content">
                <strong>Express Delivery</strong>

                <span>
                  Faster delivery where available
                </span>
              </div>

              <strong>₹0.00</strong>
            </label>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-header">
              <CreditCard size={22} />

              <div>
                <h2>Payment Method</h2>

                <p>
                  Choose how you would like to pay.
                </p>
              </div>
            </div>

            <label
              className={`payment-option ${
                paymentMethod === "UPI"
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              />

              <WalletCards size={20} />

              <div className="payment-option-content">
                <strong>UPI</strong>

                <span>
                  Pay securely using UPI
                </span>
              </div>
            </label>

            <label
              className={`payment-option ${
                paymentMethod === "CARD"
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              />

              <CreditCard size={20} />

              <div className="payment-option-content">
                <strong>Credit / Debit Card</strong>

                <span>
                  Pay using your card
                </span>
              </div>
            </label>

            <label
              className={`payment-option ${
                paymentMethod === "NET_BANKING"
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="NET_BANKING"
                checked={
                  paymentMethod === "NET_BANKING"
                }
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              />

              <Building2 size={20} />

              <div className="payment-option-content">
                <strong>Net Banking</strong>

                <span>
                  Pay directly through your bank
                </span>
              </div>
            </label>

            <label
              className={`payment-option ${
                paymentMethod === "COD"
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              />

              <Truck size={20} />

              <div className="payment-option-content">
                <strong>Cash on Delivery</strong>

                <span>
                  Pay when your order is delivered
                </span>
              </div>
            </label>
          </section>

          <section className="checkout-card prescription-note">
            <ShieldCheck size={24} />

            <div>
              <h3>Prescription Verification</h3>

              <p>
                If your order contains prescription
                medicines, the required prescription will
                be verified before the order is processed.
              </p>
            </div>
          </section>
        </main>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-products">
            {items.map((item) => (
              <div
                className="checkout-product"
                key={item.id}
              >
                <div className="checkout-product-image">
                  Medicine
                </div>

                <div className="checkout-product-info">
                  <strong>
                    Medicine #{item.medicineId}
                  </strong>

                  <span>
                    Quantity: {item.quantity}
                  </span>
                </div>

                <strong>
                  ₹
                  {Number(
                    item.subtotal || 0
                  ).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-row">
            <span>Subtotal</span>

            <strong>
              ₹{totalAmount.toFixed(2)}
            </strong>
          </div>

          <div className="checkout-summary-row">
            <span>Delivery</span>

            <strong>₹0.00</strong>
          </div>

          <div className="checkout-summary-row">
            <span>Discount</span>

            <strong>₹0.00</strong>
          </div>

          <div className="checkout-divider" />

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              ₹{totalAmount.toFixed(2)}
            </strong>
          </div>

          <button
            type="button"
            className="place-order-button"
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}

            {!placingOrder && (
              <ArrowRight size={18} />
            )}
          </button>

          <p className="secure-payment-note">
            <ShieldCheck size={16} />

            Your order information is securely processed.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;