
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import "./Checkout.css";

function Checkout() {
  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/cart" className="checkout-back-link">
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <h1>Checkout</h1>
        <p>Complete your delivery and payment details to place your order.</p>
      </div>

      <div className="checkout-layout">
        <main className="checkout-main">
          <section className="checkout-card">
            <div className="checkout-card-header">
              <MapPin size={22} />
              <div>
                <h2>Delivery Address</h2>
                <p>Where should we deliver your order?</p>
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
                  <input type="text" placeholder="City" />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input type="text" placeholder="State" />
                </div>

                <div className="form-group">
                  <label>PIN Code</label>
                  <input type="text" placeholder="PIN code" />
                </div>
              </div>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-header">
              <Truck size={22} />
              <div>
                <h2>Delivery Method</h2>
                <p>Select your preferred delivery option.</p>
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
                <span>Delivery within the estimated delivery period</span>
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
                <span>Faster delivery where available</span>
              </div>

              <strong>₹0.00</strong>
            </label>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-header">
              <CreditCard size={22} />
              <div>
                <h2>Payment Method</h2>
                <p>Choose how you would like to pay.</p>
              </div>
            </div>

            <label className="payment-option selected">
              <input
                type="radio"
                name="payment"
                value="online"
                defaultChecked
              />

              <div className="payment-option-content">
                <strong>Online Payment</strong>
                <span>Secure payment through the payment gateway</span>
              </div>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="cod"
              />

              <div className="payment-option-content">
                <strong>Cash on Delivery</strong>
                <span>Pay when your order is delivered</span>
              </div>
            </label>
          </section>

          <section className="checkout-card prescription-note">
            <ShieldCheck size={24} />

            <div>
              <h3>Prescription Verification</h3>
              <p>
                If your order contains prescription medicines, the required
                prescription will be verified before the order is processed.
              </p>
            </div>
          </section>
        </main>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-product">
            <div className="checkout-product-image">Image</div>

            <div className="checkout-product-info">
              <strong>Medicine Name</strong>
              <span>Quantity: 1</span>
            </div>

            <strong>₹0.00</strong>
          </div>

          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <strong>₹0.00</strong>
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
            <strong>₹0.00</strong>
          </div>

          <button className="place-order-button">
            Place Order
            <ArrowRight size={18} />
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
