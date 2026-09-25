import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageLayout from "../components/layout/PageLayout";

import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Medicines from "../pages/Medicines";
import MedicineDetails from "../pages/MedicineDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Prescriptions from "../pages/Prescriptions";
import Profile from "../pages/Profile";
import MedicalAssistant from "../pages/MedicalAssistant";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route
          path="/"
          element={
            <PageLayout>
              <Home />
            </PageLayout>
          }
        />

        <Route
          path="/medicines"
          element={
            <PageLayout>
              <Medicines />
            </PageLayout>
          }
        />

        <Route
          path="/medicines/:id"
          element={
            <PageLayout>
              <MedicineDetails />
            </PageLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <PageLayout>
                <Cart />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PageLayout>
              <Checkout />
            </PageLayout>
          }
        />

        <Route
          path="/orders"
          element={
            <PageLayout>
              <Orders />
            </PageLayout>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <PageLayout>
              <OrderDetails />
            </PageLayout>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <PageLayout>
              <Prescriptions />
            </PageLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <PageLayout>
              <Profile />
            </PageLayout>
          }
        />

        <Route
          path="/chatbot"
          element={
            <PageLayout>
              <MedicalAssistant />
            </PageLayout>
          }
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <PageLayout>
              <NotFound />
            </PageLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;