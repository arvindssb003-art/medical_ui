import {
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import "./Prescriptions.css";

function Prescriptions() {
  return (
    <div className="prescriptions-page">
      <div className="prescriptions-header">
        <div>
          <h1>My Prescriptions</h1>
          <p>
            Upload, manage, and track your prescription documents.
          </p>
        </div>

        <button className="upload-prescription-button">
          <Upload size={18} />
          Upload Prescription
        </button>
      </div>

      <section className="prescription-upload-card">
        <div className="upload-icon">
          <Upload size={28} />
        </div>

        <div className="upload-content">
          <h2>Upload a Prescription</h2>

          <p>
            Upload a clear image or PDF of your prescription so it can be
            reviewed before purchasing prescription medicines.
          </p>

          <div className="upload-requirements">
            <span>Supported: JPG, PNG, PDF</span>
            <span>Maximum size: To be configured</span>
          </div>
        </div>

        <button className="choose-file-button">
          <Upload size={17} />
          Choose File
        </button>
      </section>

      <section className="prescriptions-section">
        <div className="prescriptions-section-header">
          <div>
            <h2>Prescription History</h2>
            <p>Your previously uploaded prescriptions.</p>
          </div>

          <span>0 prescriptions</span>
        </div>

        <div className="prescriptions-empty">
          <div className="prescriptions-empty-icon">
            <FileText size={40} />
          </div>

          <h2>No prescriptions uploaded</h2>

          <p>
            Your uploaded prescriptions and their verification status will
            appear here.
          </p>
        </div>

        {/* Prescription card skeleton for backend integration */}
        <article className="prescription-card-placeholder">
          <div className="prescription-document-icon">
            <FileText size={25} />
          </div>

          <div className="prescription-info">
            <h3>Prescription Document</h3>
            <span>Uploaded: 01 Jan 2026</span>
            <span>Prescription ID: #RX-000001</span>
          </div>

          <span className="prescription-status status-pending">
            <Clock3 size={15} />
            Pending Verification
          </span>
        </article>

        <article className="prescription-card-placeholder">
          <div className="prescription-document-icon">
            <FileText size={25} />
          </div>

          <div className="prescription-info">
            <h3>Verified Prescription</h3>
            <span>Uploaded: 01 Jan 2026</span>
            <span>Prescription ID: #RX-000002</span>
          </div>

          <span className="prescription-status status-approved">
            <CheckCircle2 size={15} />
            Verified
          </span>
        </article>

        <article className="prescription-card-placeholder">
          <div className="prescription-document-icon">
            <FileText size={25} />
          </div>

          <div className="prescription-info">
            <h3>Rejected Prescription</h3>
            <span>Uploaded: 01 Jan 2026</span>
            <span>Prescription ID: #RX-000003</span>
          </div>

          <span className="prescription-status status-rejected">
            <XCircle size={15} />
            Rejected
          </span>
        </article>
      </section>

      <section className="prescription-info-card">
        <ShieldCheck size={23} />

        <div>
          <h3>Prescription Privacy</h3>
          <p>
            Prescription documents are sensitive healthcare information.
            Access and verification will be handled through the backend
            prescription service.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Prescriptions;