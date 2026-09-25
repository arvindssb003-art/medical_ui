import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { getActiveMedicines } from "../services/medicineApi";
import "./Medicines.css";
import { Link } from "react-router-dom";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getActiveMedicines();

        console.log("MEDICINES API:", data);

        setMedicines(data);
      } catch (err) {
        console.error("MEDICINES API ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load medicines. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  /*
   * Get unique categories from the API data.
   * Example:
   * ANALGESIC
   * ANTIBIOTIC
   * VITAMIN
   */
  const categories = useMemo(() => {
    return [...new Set(medicines.map((medicine) => medicine.category))]
      .filter(Boolean)
      .sort();
  }, [medicines]);

  /*
   * Search + category filter + sorting
   */
  const filteredMedicines = useMemo(() => {
    let result = [...medicines];

    // Search
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((medicine) =>
        [
          medicine.name,
          medicine.genericName,
          medicine.category,
          medicine.manufacturer,
          medicine.description,
        ]
          .filter(Boolean)
          .some((value) =>
            value.toLowerCase().includes(search)
          )
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(
        (medicine) => medicine.category === selectedCategory
      );
    }

    // Sorting
    if (sortBy === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    return result;
  }, [
    medicines,
    searchTerm,
    selectedCategory,
    sortBy,
  ]);

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

      {/* Search */}
      <div className="medicine-toolbar">

        <div className="medicine-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <button
          className="filter-button"
          type="button"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>

      </div>

      <div className="medicine-content">

        {/* Categories */}
        <aside className="medicine-filters">

          <h3>Categories</h3>

          <label>
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() => setSelectedCategory("")}
            />

            All Categories
          </label>

          {categories.map((category) => (
            <label key={category}>
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() =>
                  setSelectedCategory(category)
                }
              />

              {category}
            </label>
          ))}

        </aside>

        {/* Results */}
        <section className="medicine-results">

          <div className="results-header">

            <span>
              Medicines ({filteredMedicines.length})
            </span>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              <option value="">
                Sort by
              </option>

              <option value="name">
                Name
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>
            </select>

          </div>

          <div className="medicine-grid">

            {/* Loading */}
            {loading && (
              <div className="medicine-empty">

                <h2>Loading medicines...</h2>

                <p>
                  Please wait while we load the available
                  medicines.
                </p>

              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="medicine-empty">

                <h2>Unable to load medicines</h2>

                <p>{error}</p>

              </div>
            )}

            {/* No results */}
            {!loading &&
              !error &&
              filteredMedicines.length === 0 && (
                <div className="medicine-empty">

                  <h2>No medicines found</h2>

                  <p>
                    Try changing your search or category
                    filter.
                  </p>

                </div>
              )}

            {/* Medicine cards */}
            {!loading &&
              !error &&
              filteredMedicines.map((medicine) => (
                <Link
                  to={`/medicines/${medicine.id}`}
                  className="medicine-card"
                  key={medicine.id}
                >

                  <div className="medicine-card-content">

                    <h2>{medicine.name}</h2>

                    <p className="medicine-generic">
                      {medicine.genericName}
                    </p>

                    <p className="medicine-category">
                      {medicine.category}
                    </p>

                    <p className="medicine-description">
                      {medicine.description}
                    </p>

                    <p className="medicine-manufacturer">
                      <strong>Manufacturer:</strong>{" "}
                      {medicine.manufacturer}
                    </p>

                    <div className="medicine-card-footer">

                      <strong>
                        ₹{Number(medicine.price).toFixed(2)}
                      </strong>

                      {medicine.prescriptionRequired && (
                        <span className="prescription-badge">
                          Prescription Required
                        </span>
                      )}

                    </div>

                  </div>

                </Link>
              ))}

          </div>

        </section>

      </div>

    </div>
  );
}

export default Medicines;