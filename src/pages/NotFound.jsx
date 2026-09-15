import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

function NotFound() {
  return (
    <div className="not-found-page">
      <SearchX size={70} />

      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        Sorry, the page you are looking for does not exist
        or may have been moved.
      </p>

      <Link to="/" className="not-found-button">
        <Home size={18} />
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
