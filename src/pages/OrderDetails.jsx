import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();

  return (
    <div className="order-details-page">
      <Link to="/orders" className="order-details-back">
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      <div className="order-details-header">
        <div>
          <span>Order Details</span>
          <h1>Order #{id}</h1>
          <p>Order information, items, delivery and payment details.</p>
        </div>

        <span className="order-details-status">
          Pending
        </span>
      </div>

      <div className="order-details-layout">
        <main className="order-details-main">
          <section className="order-detail-card">
            <div className="detail-card-title">
              <Package size={21} />
              <div>
                <h2>Order Status</h2>
                <p>Track the progress of your order.</p>
              </div>
            </div>

            <div className="order-timeline">
              <div className="timeline-item active">
                <div className="timeline-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Order Placed</strong>
                  <span>Your order has been received.</span>
                </div>
              </div>

              <div className="timeline-line" />

              <div className="timeline-item">
                <div className="timeline-icon">
                  <Clock3 size={18} />
                </div>

                <div>
                  <strong>Order Confirmed</strong>
                  <span>Confirmation is pending.</span>
                </div>
              </div>

              <div className="timeline-line" />

              <div className="timeline-item">
                <div className="timeline-icon">
                  <Package size={18} />
                </div>

                <div>
                  <strong>Preparing Order</strong>
                  <span>Your medicines will be prepared for dispatch.</span>
                </div>
              </div>

              <div className="timeline-line" />

              <div className="timeline-item">
                <div className="timeline-icon">
                  <Truck size={18} />
                </div>

                <div>
                  <strong>Out for Delivery</strong>
                  <span>Your order will be on its way.</span>
                </div>
              </div>

              <div className="timeline-line" />

              <div className="timeline-item">
                <div className="timeline-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Delivered</strong>
                  <span>Order delivery will be confirmed here.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="order-detail-card">
            <div className="detail-card-title">
              <Package size={21} />
              <div>
                <h2>Order Items</h2>
                <p>Medicines and healthcare products in this order.</p>
              </div>
            </div>

            <div className="order-item-placeholder">
              <div className="order-item-image">
                Image
              </div>

              <div className="order-item-info">
                <h3>Medicine Name</h3>
                <p>Healthcare product</p>
                <span>Quantity: 1</span>
              </div>

              <strong>₹0.00</strong>
            </div>

            <div className="order-item-placeholder">
              <div className="order-item-image">
                Image
              </div>

              <div className="order-item-info">
                <h3>Another Medicine</h3>
                <p>Healthcare product</p>
                <span>Quantity: 1</span>
              </div>

              <strong>₹0.00</strong>
            </div>
          </section>

          <section className="order-detail-card">
            <div className="detail-card-title">
              <MapPin size={21} />
              <div>
                <h2>Delivery Address</h2>
                <p>The address associated with this order.</p>
              </div>
            </div>

            <div className="address-display">
              <strong>Customer Name</strong>
              <p>House number, street and locality</p>
              <p>City, State - 000000</p>
              <p>Phone: +91 00000 00000</p>
            </div>
          </section>

          <section className="order-detail-card">
            <div className="detail-card-title">
              <CreditCard size={21} />
              <div>
                <h2>Payment Information</h2>
                <p>Payment details for this order.</p>
              </div>
            </div>

            <div className="payment-details">
              <div>
                <span>Payment Method</span>
                <strong>Online Payment</strong>
              </div>

              <div>
                <span>Payment Status</span>
                <strong>Pending</strong>
              </div>

              <div>
                <span>Transaction ID</span>
                <strong>Not available</strong>
              </div>
            </div>
          </section>
        </main>

        <aside className="order-summary-card">
          <h2>Order Summary</h2>

          <div className="summary-line">
            <span>Subtotal</span>
            <strong>₹0.00</strong>
          </div>

          <div className="summary-line">
            <span>Delivery</span>
            <strong>₹0.00</strong>
          </div>

          <div className="summary-line">
            <span>Discount</span>
            <strong>₹0.00</strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹0.00</strong>
          </div>

          <div className="estimated-delivery">
            <Truck size={19} />
            <div>
              <strong>Estimated Delivery</strong>
              <span>To be calculated</span>
            </div>
          </div>

          <Link to="/medicines" className="order-shop-button">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default OrderDetails;