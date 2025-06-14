import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-4 border-b bg-white">
      <Link to="/" className="flex items-center space-x-3">
        {/* Using convex.svg is temporary until I get team logo svg */}
        <img src="../public/convex.svg" alt="Logo" width="28" />
        <span className="text-xl font-semibold text-orange-500">
          FRC2357 Timeclock
        </span>
      </Link>

      <Link to="/logout">
        <Button variant="outline" className="cursor-pointer text-md">
          Sign out
        </Button>
      </Link>
    </nav>
  );
}
