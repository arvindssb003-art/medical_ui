import {
  User,
  Mail,
  Lock,
  MapPin,
  Phone,
  Edit3,
  Save,
} from "lucide-react";
import { useState } from "react";
import "./Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings.</p>
        </div>

        <button
          className="profile-edit-button"
          onClick={() => setIsEditing((current) => !current)}
        >
          {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-layout">
        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              <User size={38} />
            </div>

            <div>
              <h2>John Doe</h2>
              <p>john.doe@example.com</p>
            </div>
          </div>

          <div className="profile-divider" />

          <div className="profile-form">
            <div className="profile-field">
              <label>Username</label>
              <div className="profile-input">
                <User size={18} />
                <input
                  type="text"
                  defaultValue="johndoe"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <div className="profile-input">
                <Mail size={18} />
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              <div className="profile-input">
                <Phone size={18} />
                <input
                  type="tel"
                  placeholder="Add phone number"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Address</label>
              <div className="profile-input">
                <MapPin size={18} />
                <input
                  type="text"
                  placeholder="Add delivery address"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="profile-side">
          <div className="profile-settings-card">
            <h2>Account Settings</h2>

            <button className="profile-setting-item">
              <Lock size={20} />
              <div>
                <strong>Change Password</strong>
                <span>Update your account password</span>
              </div>
            </button>

            <button className="profile-setting-item">
              <Mail size={20} />
              <div>
                <strong>Email Preferences</strong>
                <span>Manage notification preferences</span>
              </div>
            </button>
          </div>

          <div className="profile-security-card">
            <h2>Account Security</h2>
            <p>
              Your account information and authentication details are securely
              managed through the healthcare platform.
            </p>

            <div className="security-status">
              <span className="security-dot" />
              Account security status
              <strong>Protected</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Profile;