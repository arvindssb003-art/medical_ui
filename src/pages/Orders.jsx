import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Package,
  Search,
} from "lucide-react";
import "./Orders.css";

function Orders() {
  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>Track your medicines and healthcare orders.</p>
        </div>
      </div>

      <div className="orders-toolbar">
        <div className="orders-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search by order ID..."
          />
        </div>

        <select defaultValue="">
          <option value="" disabled>
            Filter by status
          </option>
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <section className="orders-list-section">
        <div className="orders-list-header">
          <h2>Order History</h2>
          <span>0 orders</span>
        </div>

        <div className="orders-empty">
          <div className="orders-empty-icon">
            <Package size={42} />
          </div>

          <h2>No orders yet</h2>

          <p>
            Your completed and ongoing orders will appear here once you
            place your first order.
          </p>

          <Link to="/medicines" className="browse-orders-button">
            Browse Medicines
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Order card skeleton for backend integration */}
        <article className="order-card-placeholder">
          <div className="order-card-top">
            <div>
              <span className="order-label">Order ID</span>
              <strong>#ORD-000001</strong>
            </div>

            <span className="order-status status-pending">
              Pending
            </span>
          </div>

          <div className="order-card-info">
            <div>
              <CalendarDays size={17} />
              <span>Order date</span>
              <strong>01 Jan 2026</strong>
            </div>

            <div>
              <Package size={17} />
              <span>Items</span>
              <strong>0 items</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>₹0.00</strong>
            </div>
          </div>

          <div className="order-card-bottom">
            <span>Order details and tracking will be available here.</span>

            <Link to="/orders/1">
              View Order
              <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Orders;
