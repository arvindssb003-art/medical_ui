import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Package,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../services/orderApi";
import "./Orders.css";

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PAYMENT_PENDING: "Payment Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

function formatOrderDate(orderDate) {
  if (!orderDate) {
    return "Date unavailable";
  }

  const date = new Date(orderDate);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatAmount(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
}

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      if (!user?.id) {
        setOrders([]);
        setLoading(false);
        setError("Please sign in to view your orders.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getUserOrders();
        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          console.error("ORDERS API ERROR:", loadError);
          setError(
            loadError.response?.data?.message ||
              "Unable to load your orders. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        String(order.id).toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>Track your medicines and healthcare orders.</p>
        </div>
      </div>

      <div className="orders-toolbar">
        <label className="orders-search">
          <Search size={19} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order ID..."
            aria-label="Search orders by order ID"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter orders by status"
        >
          <option value="all">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <option key={status} value={status}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <section className="orders-list-section">
        <div className="orders-list-header">
          <h2>Order History</h2>
          <span>
            {loading
              ? "Loading..."
              : `${filteredOrders.length} ${
                  filteredOrders.length === 1 ? "order" : "orders"
                }`}
          </span>
        </div>

        {loading && (
          <div className="orders-message" role="status">
            Loading your orders...
          </div>
        )}

        {!loading && error && (
          <div className="orders-message orders-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <Package size={42} />
            </div>

            <h2>No orders yet</h2>
            <p>
              Your ongoing and completed orders will appear here after you
              place an order.
            </p>

            <Link to="/medicines" className="browse-orders-button">
              Browse Medicines
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="orders-message">
            No orders match your search or selected status.
          </div>
        )}

        {!loading &&
          !error &&
          filteredOrders.map((order) => {
            const statusLabel =
              STATUS_LABELS[order.status] || order.status || "Unknown";
            const itemCount = (order.items || []).reduce(
              (total, item) => total + Number(item.quantity || 0),
              0
            );
            const statusClass = String(order.status || "unknown")
              .toLowerCase()
              .replaceAll("_", "-");

            return (
              <article className="order-card" key={order.id}>
                <div className="order-card-top">
                  <div>
                    <span className="order-label">Order ID</span>
                    <strong>#{order.id}</strong>
                  </div>

                  <span className={`order-status status-${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="order-card-info">
                  <div>
                    <CalendarDays size={17} aria-hidden="true" />
                    <span>Order date</span>
                    <strong>{formatOrderDate(order.orderDate)}</strong>
                  </div>

                  <div>
                    <Package size={17} aria-hidden="true" />
                    <span>Items</span>
                    <strong>
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>{formatAmount(order.totalAmount)}</strong>
                  </div>
                </div>

                <div className="order-card-bottom">
                  <span>
                    {(order.items || [])
                      .map((item) => item.medicineName)
                      .filter(Boolean)
                      .join(", ") || "Order details and tracking"}
                  </span>

                  <Link to={`/orders/${order.id}`}>
                    View Order
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
      </section>
    </div>
  );
}

export default Orders;
