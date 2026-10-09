import apiClient from "./apiClient";

const CHECKOUT_SCRIPT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

export const getPaymentByOrderId = async (orderId) => {
  const response = await apiClient.get(
    `/api/payments/order/${orderId}`
  );

  return response.data;
};

export const isPaymentSuccessfulForOrder = (payment, orderId) =>
  payment?.status === "SUCCESS" &&
  String(payment.orderId) === String(orderId);

export const openRazorpayCheckout = async (payment, orderId) => {
  if (!window.Razorpay) {
    await new Promise((resolve, reject) => {
      const script = document.querySelector(
        `script[src="${CHECKOUT_SCRIPT_URL}"]`
      );

      if (script) {
        script.addEventListener("load", resolve, { once: true });
        script.addEventListener(
          "error",
          () => reject(new Error("Unable to load Razorpay Checkout.")),
          { once: true }
        );
        return;
      }

      const newScript = document.createElement("script");
      newScript.src = CHECKOUT_SCRIPT_URL;
      newScript.async = true;
      newScript.onload = resolve;
      newScript.onerror = () =>
        reject(new Error("Unable to load Razorpay Checkout."));
      document.body.appendChild(newScript);
    });
  }

  if (!window.Razorpay) {
    throw new Error("Razorpay Checkout did not initialize.");
  }

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: payment.razorpayKeyId,
      amount: Math.round(Number(payment.amount) * 100),
      currency: payment.currency,
      name: "Medical Store",
      description: `Payment for order #${orderId}`,
      order_id: payment.razorpayOrderId,
      handler: resolve,
      modal: {
        ondismiss: () =>
          reject(new Error("Checkout was closed before payment completed.")),
      },
      theme: {
        color: "#15998f",
      },
    });

    checkout.on("payment.failed", (failure) => {
      reject(
        new Error(
          failure.error?.description ||
            "Razorpay could not complete the payment."
        )
      );
    });

    checkout.open();
  });
};

export const verifyRazorpayPayment = async (
  orderId,
  paymentDetails
) => {
  const response = await apiClient.post(
    `/api/payments/order/${orderId}/verify`,
    {
      razorpayPaymentId: paymentDetails.razorpay_payment_id,
      razorpaySignature: paymentDetails.razorpay_signature,
    }
  );

  return response.data;
};
