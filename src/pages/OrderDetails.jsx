import { useEffect, useState } from "react";
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
import { getOrderById } from "../services/orderApi";
import { getPaymentByOrderId } from "../services/paymentApi";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    let intervalId;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const orderData = await getOrderById(id);

        console.log("ORDER DETAILS API:", orderData);

        setOrder(orderData);

        try {
          const paymentData =
            await getPaymentByOrderId(id);

          console.log(
            "PAYMENT DETAILS API:",
            paymentData
          );

          setPayment(paymentData);
        } catch (paymentError) {
          // Payment may not exist yet because payment processing
          // happens asynchronously.
          if (paymentError.response?.status !== 404) {
            console.error(
              "PAYMENT DETAILS API ERROR:",
              paymentError
            );
          }
        }

        return orderData;
      } catch (err) {
        console.error(
          "ORDER DETAILS API ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load order details."
        );

        return null;
      } finally {
        setLoading(false);
      }
    };

    const initialLoad = async () => {
      const orderData = await loadOrder();

      if (
        orderData &&
        orderData.status === "PAYMENT_PENDING"
      ) {
        setCheckingPayment(true);

        intervalId = setInterval(async () => {
          try {
            const updatedOrder =
              await getOrderById(id);

            console.log(
              "ORDER STATUS CHECK:",
              updatedOrder.status
            );

            setOrder(updatedOrder);

            try {
              const paymentData =
                await getPaymentByOrderId(id);

              setPayment(paymentData);
            } catch (paymentError) {
              if (
                paymentError.response?.status !== 404
              ) {
                console.error(
                  "PAYMENT STATUS ERROR:",
                  paymentError
                );
              }
            }

            if (
              updatedOrder.status !==
                "PAYMENT_PENDING"
            ) {
              clearInterval(intervalId);
              setCheckingPayment(false);
            }
          } catch (err) {
            console.error(
              "ORDER STATUS CHECK ERROR:",
              err
            );
          }
        }, 2000);
      }
    };

    initialLoad();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id]);

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

  const isPaid = order?.status === "PAID";

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

      {checkingPayment && (
        <div className="payment-processing-banner">
          <Clock3 size={18} />

          <div>
            <strong>Payment is being processed</strong>

            <span>
              We are waiting for payment confirmation.
            </span>
          </div>
        </div>
      )}

      {isPaid && (
        <div className="payment-success-banner">
          <CheckCircle2 size={18} />

          <div>
            <strong>Payment successful</strong>

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
            <strong>Order cancelled</strong>

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
                  <strong>Preparing Order</strong>

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
                  <strong>Out for Delivery</strong>

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
              <strong>Estimated Delivery</strong>

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