import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getCart } from "../services/cartApi";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cartItemCount, setCartItemCount] = useState(0);

  const refreshCartCount = async () => {
    if (!user?.id) {
      setCartItemCount(0);
      return;
    }

    try {
      const cart = await getCart(user.id);

      const count = (cart?.items || []).reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      );

      setCartItemCount(count);
    } catch (error) {
      // A 404 simply means the user doesn't have a cart yet.
      if (error.response?.status === 404) {
        setCartItemCount(0);
        return;
      }

      console.error("CART COUNT ERROR:", error);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, [user?.id]);

  return (
    <CartContext.Provider
      value={{
        cartItemCount,
        refreshCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
