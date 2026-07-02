import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUser,
  FiMenu
} from "react-icons/fi";

function Navbar({

  toggleSidebar

}) {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.clear();

    navigate("/");

  };

  const fullName =
    localStorage.getItem("fullName");

  const role =
    localStorage.getItem("role");

  return (

    <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}

        <button
          onClick={toggleSidebar}
          className="md:hidden"
        >

          <FiMenu size={28} />

        </button>

        <h1 className="text-xl md:text-2xl font-bold text-blue-600">

          Al-Karam POS

        </h1>

      </div>

      <div className="flex items-center gap-3 md:gap-5">

        {/* User Info */}

        <div className="hidden sm:block text-right">

          <p className="font-semibold">

            {fullName}

          </p>

          <p className="text-sm text-gray-500">

            {role}

          </p>

        </div>

        {/* User Icon */}

        <div className="bg-blue-100 rounded-full p-2">

          <FiUser
            className="text-blue-600"
            size={22}
          />

        </div>

        {/* Logout */}

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg transition"
        >

          <FiLogOut />

          <span className="hidden sm:inline">

            Logout

          </span>

        </button>

      </div>

    </header>

  );

}

export default Navbar;