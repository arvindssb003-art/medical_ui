import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Lock, Mail, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (Number(form.age) < 13) {
      setError("You must be at least 13 years old.");
      return;
    }

    setLoading(true);

    try {
      await register({
        username: form.username,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        age: Number(form.age),
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">

        <Link to="/" className="auth-logo">
          <HeartPulse size={32} />
          MediCare
        </Link>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Create your account to get started.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <label>Username</label>
          <div className="input-wrapper">
            <User size={18} />
            <input
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <label>Email</label>
          <div className="input-wrapper">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="two-columns">
            <div>
              <label>First Name</label>
              <input
                className="plain-input"
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Last Name</label>
              <input
                className="plain-input"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Age</label>
          <input
            className="plain-input"
            type="number"
            name="age"
            min="13"
            placeholder="Your age"
            value={form.age}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <div className="input-wrapper">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <label>Confirm Password</label>
          <div className="input-wrapper">
            <Lock size={18} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;