import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  FileSpreadsheet,
  ImagePlus,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag,
  Upload,
  X,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import {
  createAdminMedicine,
  commitMedicineImport,
  createMedicineInventory,
  getAdminMedicines,
  getAdminOrders,
  previewMedicineImport,
  setAdminMedicineActive,
  updateAdminMedicine,
  updateAdminOrderStatus,
} from "../services/adminApi";
import "./AdminDashboard.css";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const EMPTY_MEDICINE = {
  name: "",
  genericName: "",
  category: "",
  manufacturer: "",
  description: "",
  price: "",
  stock: "",
  reorderLevel: "0",
  expiryDate: "",
  prescriptionRequired: false,
  image: null,
};

function formatCurrency(value) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
    : "—";
}

function formatDate(value) {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
      }).format(date)
    : "Date unavailable";
}

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStock(medicine) {
  return (
    medicine.stock ??
    medicine.stockQuantity ??
    medicine.quantity ??
    medicine.availableQuantity ??
    null
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [section, setSection] = useState("overview");
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState("");
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [medicineFormOpen, setMedicineFormOpen] = useState(false);
  const [medicineForm, setMedicineForm] = useState(EMPTY_MEDICINE);
  const [imagePreview, setImagePreview] = useState("");
  const imagePreviewUrlRef = useRef(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  useEffect(
    () => () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    },
    []
  );

  const loadData = useCallback(async () => {
    try {
      const [medicineResult, orderResult] = await Promise.allSettled([
        getAdminMedicines(),
        getAdminOrders(),
      ]);
      if (medicineResult.status === "rejected") {
        throw medicineResult.reason;
      }
      const medicineData = medicineResult.value;
      setMedicines(Array.isArray(medicineData) ? medicineData : []);
      if (orderResult.status === "fulfilled") {
        setOrders(Array.isArray(orderResult.value) ? orderResult.value : []);
        setOrdersError("");
      } else {
        console.error("ADMIN ORDERS API ERROR:", orderResult.reason);
        setOrders([]);
        setOrdersError(
          orderResult.reason.response?.data?.message ||
            "Order management API is not available yet."
        );
      }
    } catch (loadError) {
      console.error("ADMIN DASHBOARD API ERROR:", loadError);
      setError(
        loadError.response?.data?.message ||
          "Unable to load medicines. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getAdminMedicines(), getAdminOrders()])
      .then(([medicineResult, orderResult]) => {
        if (!active) {
          return;
        }
        if (medicineResult.status === "fulfilled") {
          setMedicines(
            Array.isArray(medicineResult.value) ? medicineResult.value : []
          );
        } else {
          console.error("ADMIN MEDICINES API ERROR:", medicineResult.reason);
          setError(
            medicineResult.reason.response?.data?.message ||
              "Unable to load medicines. Please try again."
          );
        }
        if (orderResult.status === "fulfilled") {
          setOrders(Array.isArray(orderResult.value) ? orderResult.value : []);
        } else {
          console.error("ADMIN ORDERS API ERROR:", orderResult.reason);
          setOrdersError(
            orderResult.reason.response?.data?.message ||
              "Order management API is not available yet."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    loadData();
  };

  const lowStockMedicines = useMemo(
    () =>
      medicines.filter((medicine) => {
        const stock = getStock(medicine);
        return stock !== null && Number(stock) <= 10;
      }),
    [medicines]
  );
  const hasStockData = medicines.some((medicine) => getStock(medicine) !== null);

  const clearImagePreviewUrl = () => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = null;
    }
  };

  const openCreateForm = () => {
    clearImagePreviewUrl();
    setEditingMedicine(null);
    setMedicineForm(EMPTY_MEDICINE);
    setImagePreview("");
    setMedicineFormOpen(true);
  };

  const openEditForm = (medicine) => {
    clearImagePreviewUrl();
    setEditingMedicine(medicine);
    setImagePreview(medicine.imageUrl || "");
    setMedicineForm({
      name: medicine.name || "",
      genericName: medicine.genericName || "",
      category: medicine.category || "",
      manufacturer: medicine.manufacturer || "",
      description: medicine.description || "",
      price: medicine.price ?? "",
      stock: getStock(medicine),
      reorderLevel: medicine.reorderLevel ?? "0",
      expiryDate: medicine.expiryDate || "",
      prescriptionRequired: Boolean(medicine.prescriptionRequired),
      image: null,
    });
    setMedicineFormOpen(true);
  };

  const closeMedicineForm = () => {
    clearImagePreviewUrl();
    setEditingMedicine(null);
    setMedicineForm(EMPTY_MEDICINE);
    setImagePreview("");
    setMedicineFormOpen(false);
  };

  const handleMedicineSubmit = async (event) => {
    event.preventDefault();
    setSavingId("medicine-form");
    setError("");
    setNotice("");

    const payload = {
      name: medicineForm.name.trim(),
      genericName: medicineForm.genericName.trim(),
      manufacturer: medicineForm.manufacturer.trim(),
      category: medicineForm.category,
      description: medicineForm.description.trim(),
      price: Number(medicineForm.price),
      prescriptionRequired: medicineForm.prescriptionRequired,
      expiryDate: medicineForm.expiryDate,
      active: editingMedicine ? editingMedicine.active : true,
    };
    let savedMedicine = null;

    try {
      if (editingMedicine) {
        savedMedicine = await updateAdminMedicine(editingMedicine.id, payload);
        setNotice("Medicine updated.");
      } else {
        savedMedicine = await createAdminMedicine(payload);
        await createMedicineInventory(
          savedMedicine.id,
          Number(medicineForm.stock),
          Number(medicineForm.reorderLevel)
        );
        setNotice("Medicine added.");
      }
      closeMedicineForm();
      await loadData();
    } catch (saveError) {
      console.error("ADMIN MEDICINE SAVE ERROR:", saveError);
      if (savedMedicine) {
        closeMedicineForm();
        await loadData();
      }
      setError(
        savedMedicine
          ? `Medicine ${savedMedicine.id} was saved, but a follow-up step failed: ${
              saveError.response?.data?.message ||
              "initial stock could not be saved"
            }. The medicine record exists; verify its initial stock before retrying.`
          : saveError.response?.data?.message ||
              "Unable to save this medicine. Please try again."
      );
    } finally {
      setSavingId("");
    }
  };

  const handleMedicineImageChange = (event) => {
    const image = event.target.files?.[0] || null;
    if (
      image &&
      !["image/jpeg", "image/png", "image/webp"].includes(image.type)
    ) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      clearImagePreviewUrl();
      setImagePreview(editingMedicine?.imageUrl || "");
      setMedicineForm((current) => ({ ...current, image: null }));
      return;
    }
    if (image && image.size > 5 * 1024 * 1024) {
      setError("Medicine images must be 5 MB or smaller.");
      event.target.value = "";
      clearImagePreviewUrl();
      setImagePreview(editingMedicine?.imageUrl || "");
      setMedicineForm((current) => ({ ...current, image: null }));
      return;
    }
    clearImagePreviewUrl();
    setError("");
    if (image) {
      imagePreviewUrlRef.current = URL.createObjectURL(image);
      setImagePreview(imagePreviewUrlRef.current);
    } else {
      setImagePreview(editingMedicine?.imageUrl || "");
    }
    setMedicineForm((current) => ({ ...current, image }));
  };

  const handleToggleMedicine = async (medicine) => {
    setSavingId(`medicine-${medicine.id}`);
    setError("");
    setNotice("");
    try {
      await setAdminMedicineActive(medicine.id, {
        ...medicine,
        active: !medicine.active,
      });
      setNotice(
        medicine.active ? "Medicine made unavailable." : "Medicine activated."
      );
      await loadData();
    } catch (actionError) {
      console.error("ADMIN MEDICINE STATUS ERROR:", actionError);
      setError(
        actionError.response?.data?.message ||
          "Unable to update medicine availability."
      );
    } finally {
      setSavingId("");
    }
  };

  const handleImportPreview = async (event) => {
    event.preventDefault();
    if (!importFile) {
      setError("Choose a CSV or Excel file to preview.");
      return;
    }

    setImporting(true);
    setImportPreview(null);
    setError("");
    setNotice("");
    try {
      const preview = await previewMedicineImport(importFile);
      setImportPreview(preview);
      setNotice("Import preview is ready. Review all rows before confirming.");
    } catch (previewError) {
      console.error("MEDICINE IMPORT PREVIEW ERROR:", previewError);
      setError(
        previewError.response?.data?.message ||
          "Unable to preview this file. The import service may not be available yet."
      );
    } finally {
      setImporting(false);
    }
  };

  const handleImportCommit = async () => {
    if (!importPreview?.importId) {
      setError("The preview did not include an import ID. Preview the file again.");
      return;
    }

    setImporting(true);
    setError("");
    setNotice("");
    try {
      const result = await commitMedicineImport(importPreview.importId);
      const importedCount = result.importedCount ?? result.createdCount ?? 0;
      setNotice(`Import completed. ${importedCount} medicines were added.`);
      setImportFile(null);
      setImportPreview(null);
      setBulkUploadOpen(false);
      await loadData();
    } catch (importError) {
      console.error("MEDICINE IMPORT COMMIT ERROR:", importError);
      setError(
        importError.response?.data?.message ||
          "Unable to complete the medicine import."
      );
    } finally {
      setImporting(false);
    }
  };

  const downloadImportTemplate = () => {
    const template = [
      "name,genericName,manufacturer,category,description,price,prescriptionRequired,expiryDate,active,stockQuantity,reorderLevel,imageFilename",
      'Example Medicine,Example ingredient,Example Pharma,ANALGESIC,Example description,25.50,false,2027-12-31,true,100,10,example-medicine.jpg',
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([template], { type: "text/csv;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "medicine-import-template.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleOrderStatus = async (orderId, status) => {
    setSavingId(`order-${orderId}`);
    setError("");
    setNotice("");
    try {
      await updateAdminOrderStatus(orderId, status);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      setNotice(`Order #${orderId} updated.`);
    } catch (actionError) {
      console.error("ADMIN ORDER STATUS ERROR:", actionError);
      setError(
        actionError.response?.data?.message ||
          "Unable to update order status."
      );
      await loadData();
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="admin-workspace">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <Activity size={23} />
          <span>ArunCare Admin</span>
        </Link>

        <nav className="admin-navigation" aria-label="Admin navigation">
          {[
            ["overview", "Overview"],
            ["medicines", "Inventory"],
            ["orders", "Orders"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={section === value ? "active" : ""}
              onClick={() => setSection(value)}
            >
              {value === "medicines" ? (
                <Package size={18} />
              ) : (
                <ShoppingBag size={18} />
              )}
              {label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span>{user?.username || user?.firstName || "Administrator"}</span>
          <button type="button" onClick={handleLogout}>
            <LogOut size={17} />
            Sign out
          </button>
          <Link to="/">Back to store</Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">STORE MANAGEMENT</span>
            <h1>
              {section === "overview"
                ? "Overview"
                : section === "medicines"
                  ? "Medicine inventory"
                  : "Orders"}
            </h1>
          </div>
          <button
            type="button"
            className="admin-refresh-button"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            {error}
          </div>
        )}
        {notice && (
          <div className="admin-alert" role="status">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="admin-panel admin-loading" role="status">
            Loading admin data...
          </div>
        ) : (
          <>
            {section === "overview" && (
              <section className="admin-overview">
                <div className="admin-stat-grid">
                  <article className="admin-stat">
                    <span>Total medicines</span>
                    <strong>{medicines.length}</strong>
                    <Package size={21} />
                  </article>
                  <article className="admin-stat">
                    <span>Total orders</span>
                    <strong>{ordersError ? "—" : orders.length}</strong>
                    <ShoppingBag size={21} />
                  </article>
                  <article className="admin-stat">
                    <span>Low stock</span>
                    <strong>{hasStockData ? lowStockMedicines.length : "—"}</strong>
                    <Activity size={21} />
                  </article>
                </div>
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <h2>Low-stock medicines</h2>
                      <p>Items with 10 or fewer units recorded.</p>
                    </div>
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() => setSection("medicines")}
                    >
                      Manage inventory
                    </button>
                  </div>
                  {lowStockMedicines.length === 0 ? (
                    <p className="admin-empty">
                      {hasStockData
                        ? "No low-stock medicines to show."
                        : "Stock levels are not included in the medicine list response yet."}
                    </p>
                  ) : (
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Medicine</th>
                            <th>Category</th>
                            <th>Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStockMedicines.slice(0, 6).map((medicine) => (
                            <tr key={medicine.id}>
                              <td>{medicine.name}</td>
                              <td>{medicine.category || "—"}</td>
                              <td>
                                <span className="admin-stock-low">
                                  {getStock(medicine) ?? "—"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </section>
            )}

            {section === "medicines" && (
              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>Inventory</h2>
                    <p>
                      {medicines.length}{" "}
                      {medicines.length === 1 ? "medicine" : "medicines"}
                    </p>
                  </div>
                  <div className="admin-toolbar-actions">
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() => {
                        setBulkUploadOpen((open) => !open);
                        setImportPreview(null);
                        setImportFile(null);
                        setError("");
                      }}
                    >
                      <Upload size={17} />
                      Bulk upload
                    </button>
                    <button
                      type="button"
                      className="admin-primary-button"
                      onClick={openCreateForm}
                    >
                      <Plus size={18} />
                      Add medicine
                    </button>
                  </div>
                </div>
                {bulkUploadOpen && (
                  <section className="admin-import-panel" aria-labelledby="admin-import-title">
                    <div className="admin-import-heading">
                      <div>
                        <h3 id="admin-import-title">Bulk medicine upload</h3>
                        <p>
                          Upload a CSV or Excel file. Review each row and its
                          validation errors before confirming the import.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="admin-template-button"
                        onClick={downloadImportTemplate}
                      >
                        <FileSpreadsheet size={16} />
                        Download CSV template
                      </button>
                    </div>
                    <form
                      className="admin-import-form"
                      onSubmit={handleImportPreview}
                    >
                      <label className="admin-file-picker">
                        <Upload size={20} />
                        <span>
                          {importFile?.name || "Choose a CSV, XLSX, or XLS file"}
                        </span>
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            if (file && file.size > 10 * 1024 * 1024) {
                              setError("Bulk upload files must be 10 MB or smaller.");
                              event.target.value = "";
                              return;
                            }
                            setError("");
                            setImportFile(file);
                            setImportPreview(null);
                          }}
                        />
                      </label>
                      <button
                        type="submit"
                        className="admin-primary-button"
                        disabled={!importFile || importing}
                      >
                        {importing ? "Preparing preview..." : "Preview import"}
                      </button>
                    </form>
                    {importPreview && (
                      <div className="admin-import-preview">
                        <div className="admin-import-summary">
                          <strong>
                            {importPreview.validCount ??
                              importPreview.rows?.filter(
                                (row) => !row.errors?.length
                              ).length ??
                              0}{" "}
                            ready
                          </strong>
                          <span>
                            {importPreview.errorCount ??
                              importPreview.rows?.filter(
                                (row) => row.errors?.length
                              ).length ??
                              0}{" "}
                            with errors
                          </span>
                        </div>
                        <div className="admin-table-wrap">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Row</th>
                                <th>Medicine</th>
                                <th>Price</th>
                                <th>Initial stock</th>
                                <th>Validation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(importPreview.rows || []).map((row, index) => {
                                const errors = row.errors || [];
                                return (
                                  <tr key={row.rowNumber ?? index}>
                                    <td>{row.rowNumber ?? index + 1}</td>
                                    <td>
                                      <strong>
                                        {row.medicine?.name || row.name || "—"}
                                      </strong>
                                      <small>
                                        {row.medicine?.genericName ||
                                          row.genericName ||
                                          ""}
                                      </small>
                                    </td>
                                    <td>
                                      {formatCurrency(
                                        row.medicine?.price ?? row.price
                                      )}
                                    </td>
                                    <td>
                                      {row.medicine?.stockQuantity ??
                                        row.stockQuantity ??
                                        "—"}
                                    </td>
                                    <td>
                                      {errors.length ? (
                                        <span className="admin-import-errors">
                                          {errors.join(", ")}
                                        </span>
                                      ) : (
                                        <span className="admin-pill is-active">
                                          Valid
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="admin-import-actions">
                          <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={() => {
                              setImportPreview(null);
                              setImportFile(null);
                            }}
                          >
                            Choose another file
                          </button>
                          <button
                            type="button"
                            className="admin-primary-button"
                            disabled={
                              importing ||
                              !importPreview.importId ||
                              (importPreview.validCount ??
                                importPreview.rows?.filter(
                                  (row) => !row.errors?.length
                                ).length ??
                                0) < 1 ||
                              (importPreview.errorCount ??
                                importPreview.rows?.filter(
                                  (row) => row.errors?.length
                                ).length ??
                                0) > 0
                            }
                            onClick={handleImportCommit}
                          >
                            {importing ? "Importing..." : "Confirm and import"}
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                )}
                {medicines.length === 0 ? (
                  <p className="admin-empty">No medicines found.</p>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Availability</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicines.map((medicine) => (
                          <tr key={medicine.id}>
                            <td>
                              <strong>{medicine.name}</strong>
                              <small>{medicine.genericName}</small>
                            </td>
                            <td>{medicine.category || "—"}</td>
                            <td>{formatCurrency(medicine.price)}</td>
                            <td>{getStock(medicine) ?? "—"}</td>
                            <td>
                              <span
                                className={`admin-pill ${
                                  medicine.active ? "is-active" : "is-inactive"
                                }`}
                              >
                                {medicine.active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td>
                              <div className="admin-row-actions">
                                <button
                                  type="button"
                                  onClick={() => openEditForm(medicine)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={savingId === `medicine-${medicine.id}`}
                                  onClick={() => handleToggleMedicine(medicine)}
                                >
                                  {medicine.active ? "Deactivate" : "Activate"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {section === "orders" && (
              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>Order management</h2>
                    <p>{orders.length} orders</p>
                  </div>
                </div>
                {orders.length === 0 ? (
                  <p className="admin-empty">
                    {ordersError || "No orders found."}
                  </p>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Update status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <Link to={`/orders/${order.id}`}>#{order.id}</Link>
                            </td>
                            <td>{formatDate(order.orderDate)}</td>
                            <td>
                              {order.user?.username ||
                                order.customerName ||
                                order.userId ||
                                "—"}
                            </td>
                            <td>{formatCurrency(order.totalAmount)}</td>
                            <td>
                              <span className="admin-pill is-active">
                                {order.status || "Unknown"}
                              </span>
                            </td>
                            <td>
                              <select
                                value={order.status || ""}
                                aria-label={`Update order ${order.id} status`}
                                disabled={savingId === `order-${order.id}`}
                                onChange={(event) =>
                                  handleOrderStatus(order.id, event.target.value)
                                }
                              >
                                {!ORDER_STATUSES.includes(order.status) && (
                                  <option value={order.status}>
                                    {order.status || "Unknown"}
                                  </option>
                                )}
                                {ORDER_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {status.replaceAll("_", " ")}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {section === "medicines" && medicineFormOpen && (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-medicine-form-title"
          >
            <div className="admin-modal-heading">
              <h2 id="admin-medicine-form-title">
                {editingMedicine ? "Edit medicine" : "Add medicine"}
              </h2>
              <button
                type="button"
                aria-label="Close medicine form"
                onClick={closeMedicineForm}
              >
                <X size={20} />
              </button>
            </div>
            <form className="admin-medicine-form" onSubmit={handleMedicineSubmit}>
              {[
                ["name", "Medicine name", "text"],
                ["genericName", "Generic name", "text"],
                ["manufacturer", "Manufacturer", "text"],
                ["price", "Price (INR)", "number"],
              ].map(([field, label, type]) => (
                <label key={field}>
                  {label}
                  <input
                    type={type}
                    min={field === "price" ? "0.01" : undefined}
                    step={field === "price" ? "0.01" : "1"}
                    value={medicineForm[field]}
                    onChange={(event) =>
                      setMedicineForm((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              ))}
              <label>
                Category
                <select
                  value={medicineForm.category}
                  onChange={(event) =>
                    setMedicineForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select category</option>
                  {[
                    "ANALGESIC",
                    "ANTIBIOTIC",
                    "ANTIVIRAL",
                    "ANTIFUNGAL",
                    "ANTIHISTAMINE",
                    "ANTACID",
                    "CARDIOVASCULAR",
                    "DIABETES",
                    "VITAMINS",
                    "OTHER",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Expiry date
                <input
                  type="date"
                  min={getTomorrowDate()}
                  value={medicineForm.expiryDate}
                  onChange={(event) =>
                    setMedicineForm((current) => ({
                      ...current,
                      expiryDate: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              {!editingMedicine && (
                <>
                  <label>
                    Initial stock quantity
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={medicineForm.stock}
                      onChange={(event) =>
                        setMedicineForm((current) => ({
                          ...current,
                          stock: event.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                  <label>
                    Reorder level
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={medicineForm.reorderLevel}
                      onChange={(event) =>
                        setMedicineForm((current) => ({
                          ...current,
                          reorderLevel: event.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                </>
              )}
              <label className="admin-form-wide">
                Description
                <textarea
                  rows="3"
                  value={medicineForm.description}
                  onChange={(event) =>
                    setMedicineForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="admin-form-wide admin-image-picker">
                <span>
                  <ImagePlus size={17} />
                  {editingMedicine ? "Medicine image preview" : "Optional medicine image preview"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleMedicineImageChange}
                />
                <small>
                  JPG, PNG, or WebP · maximum 5 MB. Image upload will be added
                  with the backend image API.
                </small>
              </label>
              {imagePreview && (
                <div className="admin-image-preview admin-form-wide">
                  <img src={imagePreview} alt="Medicine preview" />
                </div>
              )}
              <label className="admin-checkbox admin-form-wide">
                <input
                  type="checkbox"
                  checked={medicineForm.prescriptionRequired}
                  onChange={(event) =>
                    setMedicineForm((current) => ({
                      ...current,
                      prescriptionRequired: event.target.checked,
                    }))
                  }
                />
                Prescription required
              </label>
              <div className="admin-form-actions admin-form-wide">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeMedicineForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={savingId === "medicine-form"}
                >
                  {savingId === "medicine-form" ? "Saving..." : "Save medicine"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
