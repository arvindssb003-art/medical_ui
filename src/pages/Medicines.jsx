import { Search, SlidersHorizontal } from "lucide-react";
import "./Medicines.css";

function Medicines() {
  return (
    <div className="medicines-page">

      <div className="medicines-header">
        <div>
          <h1>Medicines</h1>
          <p>
            Find the medicines and healthcare products you need.
          </p>
        </div>
      </div>

      <div className="medicine-toolbar">

        <div className="medicine-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search medicines..."
          />
        </div>

        <button className="filter-button">
          <SlidersHorizontal size={18} />
          Filters
        </button>

      </div>

      <div className="medicine-content">

        <aside className="medicine-filters">

          <h3>Categories</h3>

          <label>
            <input type="checkbox" />
            Pain Relief
          </label>

          <label>
            <input type="checkbox" />
            Cold & Flu
          </label>

          <label>
            <input type="checkbox" />
            Vitamins
          </label>

          <label>
            <input type="checkbox" />
            Digestive Health
          </label>

          <label>
            <input type="checkbox" />
            Personal Care
          </label>

        </aside>

        <section className="medicine-results">

          <div className="results-header">
            <span>Medicines</span>

            <select defaultValue="">
              <option value="" disabled>
                Sort by
              </option>
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="medicine-grid">

            <div className="medicine-empty">
              <h2>No medicines loaded</h2>
              <p>
                Medicine products will appear here when connected
                to the medicine service.
              </p>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Medicines;