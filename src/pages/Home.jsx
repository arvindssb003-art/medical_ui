import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  Clock,
  Stethoscope,
  Pill,
  FileText,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      <Navbar />

      <main>

        {/* Hero */}
        <section className="hero">
          <div className="hero-content">

            <div className="hero-text">
              <span className="hero-badge">
                Trusted Healthcare Platform
              </span>

              <h1>
                Your Health,
                <br />
                <span>Our Priority</span>
              </h1>

              <p>
                Order medicines, manage prescriptions, track orders,
                and get healthcare assistance — all in one place.
              </p>

              <div className="hero-buttons">
                <Link to="/medicines" className="primary-button">
                  Browse Medicines
                </Link>

                <Link to="/register" className="secondary-button">
                  Create Account
                </Link>
              </div>
            </div>

            <div className="hero-card">
              <div className="medical-icon">
                <Stethoscope size={70} />
              </div>

              <h3>Healthcare Made Simple</h3>

              <p>
                Safe medicines, easy prescriptions and reliable
                healthcare services.
              </p>
            </div>

          </div>
        </section>

        {/* Features */}
        <section className="features">

          <div className="feature-card">
            <ShieldCheck size={32} />
            <h3>Trusted Medicines</h3>
            <p>Quality medicines from reliable sources.</p>
          </div>

          <div className="feature-card">
            <Truck size={32} />
            <h3>Fast Delivery</h3>
            <p>Get your medicines delivered to your doorstep.</p>
          </div>

          <div className="feature-card">
            <Clock size={32} />
            <h3>Easy Ordering</h3>
            <p>Simple and convenient online ordering.</p>
          </div>

        </section>

        {/* Categories */}
        <section className="categories">

          <div className="section-heading">
            <h2>Explore Healthcare</h2>
            <p>Everything you need for your health and wellbeing.</p>
          </div>

          <div className="category-grid">

            <Link to="/medicines" className="category-card">
              <Pill size={36} />
              <h3>Medicines</h3>
              <p>Browse medicines and health products</p>
            </Link>

            <Link to="/prescriptions" className="category-card">
              <FileText size={36} />
              <h3>Prescriptions</h3>
              <p>Upload and manage your prescriptions</p>
            </Link>

            <Link to="/chatbot" className="category-card">
              <Stethoscope size={36} />
              <h3>Medical Assistant</h3>
              <p>Get assistance with your healthcare questions</p>
            </Link>

          </div>

        </section>

      </main>

      <footer className="footer">
        <div>
          <strong>MediCare</strong>
          <p>Your trusted digital healthcare platform.</p>
        </div>

        <p>© 2026 MediCare. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;
