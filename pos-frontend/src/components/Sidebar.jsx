import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiGrid,
  FiUsers,
  FiShoppingCart,
  FiClipboard,
  FiBarChart2,
  FiLayers,
  FiCpu,
  FiX,
  FiMenu
} from "react-icons/fi";

function Sidebar({

  sidebarOpen,

  setSidebarOpen

}) {

  const role =
    localStorage.getItem("role");

  const menuClass =
    ({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`;

  const closeSidebar = () => {

    if (window.innerWidth < 768) {

      setSidebarOpen(false);

    }

  };

  return (
    <>

      {/* Overlay */}

      {sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed md:static
          top-0 left-0
          z-50
          w-64
          bg-white
          shadow
          min-h-screen
          p-5
          transform
          transition-transform
          duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* Mobile Header */}

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-xl font-bold">

            Menu

          </h2>

          <button
            className="md:hidden"
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <FiX size={26} />

          </button>

        </div>

        <nav className="space-y-2">

          <NavLink
            to="/dashboard"
            className={menuClass}
            onClick={closeSidebar}
          >
            <FiHome />
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            className={menuClass}
            onClick={closeSidebar}
          >
            <FiBox />
            Products
          </NavLink>

          <NavLink
            to="/sales"
            className={menuClass}
            onClick={closeSidebar}
          >
            <FiShoppingCart />
            Sales
          </NavLink>

          <NavLink
            to="/sales-history"
            className={menuClass}
            onClick={closeSidebar}
          >
            <FiClipboard />
            Sales History
          </NavLink>

          {role === "Admin" && (

            <>

              <NavLink
                to="/categories"
                className={menuClass}
                onClick={closeSidebar}
              >
                <FiGrid />
                Categories
              </NavLink>

              <NavLink
                to="/inventory"
                className={menuClass}
                onClick={closeSidebar}
              >
                <FiLayers />
                Inventory
              </NavLink>

              <NavLink
                to="/inventory-history"
                className={menuClass}
                onClick={closeSidebar}
              >
                <FiClipboard />
                Inventory History
              </NavLink>

              <NavLink
                to="/users"
                className={menuClass}
                onClick={closeSidebar}
              >
                <FiUsers />
                Users
              </NavLink>

              <NavLink
                to="/reports"
                className={menuClass}
                onClick={closeSidebar}
              >
                <FiBarChart2 />
                Reports
              </NavLink>

              <NavLink
                to="/ai-reports"
                className={menuClass}
                onClick={closeSidebar}
              >
                <FiCpu />
                AI Reports
              </NavLink>

            </>

          )}

        </nav>

      </aside>

    </>
  );

}

export default Sidebar;