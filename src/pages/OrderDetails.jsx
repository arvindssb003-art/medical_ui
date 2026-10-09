import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { clearCart } from "../services/cartApi";
import { getOrderById } from "../services/orderApi";
import {
  getPaymentByOrderId,
  isPaymentSuccessfulForOrder,
  openRazorpayCheckout,
  verifyRazorpayPayment,
} from "../services/paymentApi";
import "./OrderDetails.css";

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [startingPayment, setStartingPayment] = useState(false);
  const cartClearedOrderId = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPayment = async () => {
      try {
        const paymentData = await getPaymentByOrderId(id);

        if (!cancelled) {
          setPayment(paymentData);
        }

        return paymentData;
      } catch (paymentError) {
        if (paymentError.response?.status !== 404) {
          console.error(
            "PAYMENT DETAILS API ERROR:",
            paymentError
          );
        }

        return null;
      }
    };

    const loadOrder = async () => {
      try {
        const orderData = await getOrderById(id);

        if (cancelled) {
          return null;
        }

        setOrder(orderData);
        return orderData;
      } catch (err) {
        if (cancelled) {
          return null;
        }

        console.error(
          "ORDER DETAILS API ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load order details."
        );

        return null;
      }
    };

    const initialize = async () => {
      setLoading(true);
      setError("");

      try {
        const currentOrder = await loadOrder();
        if (currentOrder) {
          let currentPayment = await loadPayment();

          for (
            let attempt = 0;
            !cancelled &&
            currentOrder.status === "PAYMENT_PENDING" &&
            !currentPayment &&
            attempt < 8;
            attempt += 1
          ) {
            await wait(2500);
            if (!cancelled) {
              currentPayment = await loadPayment();
            }
          }

          if (!cancelled) {
            setLoading(false);
          }

          if (
            !cancelled &&
            currentOrder.status === "PAYMENT_PENDING" &&
            isPaymentSuccessfulForOrder(currentPayment, currentOrder.id)
          ) {
            let latestOrder = currentOrder;
            for (let attempt = 0; attempt < 10; attempt += 1) {
              await wait(1500);
              if (cancelled) {
                break;
              }

              latestOrder = await loadOrder();
              if (latestOrder?.status !== "PAYMENT_PENDING") {
                break;
              }
            }

            if (
              !cancelled &&
              latestOrder?.status === "PAYMENT_PENDING"
            ) {
              setPaymentError(
                "The payment service reports success, but the order is still pending. Refresh shortly or contact support."
              );
            }
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (
      order?.status !== "PAID" ||
      !isPaymentSuccessfulForOrder(payment, order.id) ||
      !user?.id ||
      cartClearedOrderId.current === order.id
    ) {
      return undefined;
    }

    let cancelled = false;
    cartClearedOrderId.current = order.id;

    const clearPaidOrderCart = async () => {
      try {
        await clearCart(user.id);
      } catch (cartError) {
        if (cartError.response?.status !== 404) {
          cartClearedOrderId.current = null;
          if (!cancelled) {
            setPaymentError(
              "Your order is paid, but the cart could not be cleared. Please refresh your cart."
            );
          }
          return;
        }
      }

      if (!cancelled) {
        await refreshCartCount();
      }
    };

    clearPaidOrderCart();

    return () => {
      cancelled = true;
    };
  }, [
    order?.id,
    order?.status,
    payment,
    user?.id,
    refreshCartCount,
  ]);

  const handlePayNow = async () => {
    if (!payment?.razorpayKeyId || !payment?.razorpayOrderId) {
      setPaymentError("Secure checkout is not ready yet. Please wait and try again.");
      return;
    }

    try {
      setStartingPayment(true);
      setPaymentError("");
      const checkoutResponse = await openRazorpayCheckout(payment, order.id);
      const verifiedPayment = await verifyRazorpayPayment(
        order.id,
        checkoutResponse
      );
      const persistedPayment = await getPaymentByOrderId(order.id);
      if (
        !isPaymentSuccessfulForOrder(verifiedPayment, order.id) ||
        !isPaymentSuccessfulForOrder(persistedPayment, order.id)
      ) {
        throw new Error(
          `The payment service has not confirmed payment for order ${order.id}. Its current status is ${persistedPayment?.status || verifiedPayment?.status || "unknown"}. Your cart has not been cleared.`
        );
      }

      setPayment(persistedPayment);
      setPaymentError("");

      let updatedOrder;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        updatedOrder = await getOrderById(id);
        setOrder(updatedOrder);
        if (updatedOrder.status !== "PAYMENT_PENDING") {
          break;
        }
        await wait(1500);
      }

      if (updatedOrder?.status === "PAYMENT_PENDING") {
        setPaymentError(
          "The payment service reports success, but the order is still pending. Cart contents are unchanged until the order is paid."
        );
      }
    } catch (checkoutError) {
      console.error("RAZORPAY CHECKOUT ERROR:", checkoutError);
      setPaymentError(
        checkoutError.response?.data?.message ||
          checkoutError.message ||
          "Unable to start Razorpay Checkout."
      );
    } finally {
      setStartingPayment(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PAYMENT_PENDING":
        return "Payment Pending";

      case "PAID":
        return "Paid";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status || "Unknown";
    }
  };

  const isPaymentPending =
    order?.status === "PAYMENT_PENDING";

  const isPaymentConfirmed =
    isPaymentSuccessfulForOrder(payment, order?.id);

  const isPaid =
    order?.status === "PAID";

  const isCancelled =
    order?.status === "CANCELLED";

  if (loading) {
    return (
      <div className="order-details-page">
        <Link
          to="/orders"
          className="order-details-back"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>

        <div className="order-loading">
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-page">
        <Link
          to="/orders"
          className="order-details-back"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>

        <div className="order-error">
          {error || "Order not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <Link
        to="/orders"
        className="order-details-back"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      <div className="order-details-header">
        <div>
          <span>Order Details</span>

          <h1>Order #{order.id}</h1>

          <p>
            Order information, items, delivery and
            payment details.
          </p>
        </div>

        <span
          className={`order-details-status ${
            isPaid
              ? "status-paid"
              : isCancelled
              ? "status-cancelled"
              : "status-pending"
          }`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {isPaymentPending && (
        <div className="payment-processing-banner">
          <Clock3 size={18} />

          <div>
            <strong>
              {isPaymentConfirmed
                ? "Payment received"
                : payment?.razorpayOrderId
                ? "Complete your payment"
                : "Preparing secure checkout"}
            </strong>

            <span>
              {isPaymentConfirmed
                ? "Payment succeeded, but the order is pending confirmation. Your cart will remain until the order is paid."
                : payment?.razorpayOrderId
                ? `Pay ₹${Number(payment.amount).toFixed(2)} securely with Razorpay.`
                : "Your payment session is being created. This page will update automatically."}
            </span>

            {payment?.status === "PENDING" &&
              payment.razorpayOrderId &&
              payment.razorpayKeyId && (
                <button
                  type="button"
                  className="pay-now-button"
                  onClick={handlePayNow}
                  disabled={startingPayment}
                >
                  {startingPayment ? "Opening checkout..." : "Pay securely now"}
                </button>
              )}
          </div>
        </div>
      )}

      {paymentError && (
        <div className="payment-action-error" role="alert">
          {paymentError}
        </div>
      )}

      {isPaid && (
        <div className="payment-success-banner">
          <CheckCircle2 size={18} />

          <div>
            <strong>
              Payment successful
            </strong>

            <span>
              Your order has been confirmed.
            </span>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="payment-failed-banner">
          <XCircle size={18} />

          <div>
            <strong>
              Order cancelled
            </strong>

            <span>
              The payment could not be completed.
            </span>
          </div>
        </div>
      )}

      <div className="order-details-layout">
        <main className="order-details-main">
          <section className="order-detail-card">
            <div className="detail-card-title">
              <Package size={21} />

              <div>
                <h2>Order Status</h2>

                <p>
                  Track the progress of your order.
                </p>
              </div>
            </div>

            <div className="order-timeline">
              <div className="timeline-item active">
                <div className="timeline-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Order Placed</strong>

                  <span>
                    Your order has been received.
                  </span>
                </div>
              </div>

              <div className="timeline-line" />

              <div
                className={`timeline-item ${
                  isPaid ? "active" : ""
                }`}
              >
                <div className="timeline-icon">
                  {isCancelled ? (
                    <XCircle size={18} />
                  ) : isPaid ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Clock3 size={18} />
                  )}
                </div>

                <div>
                  <strong>
                    {isCancelled
                      ? "Payment Failed"
                      : isPaid
                      ? "Order Confirmed"
                      : "Payment Pending"}
                  </strong>

                  <span>
                    {isCancelled
                      ? "The order was cancelled because payment was not completed."
                      : isPaid
                      ? "Payment has been confirmed and your order is confirmed."
                      : "We are waiting for payment confirmation."}
                  </span>
                </div>
              </div>

              <div className="timeline-line" />

              <div className="timeline-item">
                <div className="timeline-icon">
                  <Package size={18} />
                </div>

                <div>
                  <strong>
                    Preparing Order
                  </strong>

                  <span>
                    Your medicines will be prepared
                    for dispatch.
                  </span>
                </div>
              </div>

              <div className="timeline-line" />

              <div className="timeline-item">
                <div className="timeline-icon">
                  <Truck size={18} />
                </div>

                <div>
                  <strong>
                    Out for Delivery
                  </strong>

                  <span>
                    Your order will be on its way.
                  </span>
                </div>
              </div>

              <div className="timeline-line" />

              <div className="timeline-item">
                <div className="timeline-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Delivered</strong>

                  <span>
                    Order delivery will be confirmed
                    here.
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="order-detail-card">
            <div className="detail-card-title">
              <Package size={21} />

              <div>
                <h2>Order Items</h2>

                <p>
                  Medicines and healthcare products in
                  this order.
                </p>
              </div>
            </div>

            {order.items?.map((item) => (
              <div
                className="order-item-placeholder"
                key={item.id}
              >
                <div className="order-item-image">
                  Medicine
                </div>

                <div className="order-item-info">
                  <h3>{item.medicineName}</h3>

                  <p>
                    Medicine #{item.medicineId}
                  </p>

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
          </section>

          <section className="order-detail-card">
            <div className="detail-card-title">
              <MapPin size={21} />

              <div>
                <h2>Delivery Address</h2>

                <p>
                  The address associated with this
                  order.
                </p>
              </div>
            </div>

            <div className="address-display">
              <strong>
                Delivery address
              </strong>

              <p>
                Address information will be connected
                when the backend supports order
                addresses.
              </p>
            </div>
          </section>

          <section className="order-detail-card">
            <div className="detail-card-title">
              <CreditCard size={21} />

              <div>
                <h2>Payment Information</h2>

                <p>
                  Payment details for this order.
                </p>
              </div>
            </div>

            <div className="payment-details">
              <div>
                <span>Payment Method</span>

                <strong>
                  {payment?.paymentMethod ||
                    "Processing"}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>

                <strong>
                  {payment?.status ||
                    getStatusLabel(
                      order.status
                    )}
                </strong>
              </div>

              <div>
                <span>Transaction ID</span>

                <strong>
                  {payment?.transactionId ||
                    "Not available"}
                </strong>
              </div>
            </div>
          </section>
        </main>

        <aside className="order-summary-card">
          <h2>Order Summary</h2>

          <div className="summary-line">
            <span>Subtotal</span>

            <strong>
              ₹
              {Number(
                order.totalAmount || 0
              ).toFixed(2)}
            </strong>
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

            <strong>
              ₹
              {Number(
                order.totalAmount || 0
              ).toFixed(2)}
            </strong>
          </div>

          <div className="estimated-delivery">
            <Truck size={19} />

            <div>
              <strong>
                Estimated Delivery
              </strong>

              <span>
                To be calculated
              </span>
            </div>
          </div>

          <Link
            to="/medicines"
            className="order-shop-button"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default OrderDetails;