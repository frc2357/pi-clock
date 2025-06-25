import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-3 py-3 border-b bg-white">
      <Link to="/" className="flex items-center space-x-4">
        <img src="../src/assets/logo.png" alt="Logo" width="48" />
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
