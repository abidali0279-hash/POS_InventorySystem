import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products/Products";
import Categories from "./pages/Categories/Categories";
import Users from "./pages/Users/Users";
import Sales from "./pages/Sales/Sales";
import Inventory from "./pages/Inventory/Inventory";
import SalesHistory from "./pages/Sales/SalesHistory";
import Reports from "./pages/Reports/Reports";
import InventoryHistory from "./pages/Inventory/InventoryHistory";


function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
      path="/categories"
      element={
        <ProtectedRoute>
          <Categories />
        </ProtectedRoute>
      }
      />

      <Route
      path="/products"
      element={
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      }
      />

      <Route path="/users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />

      <Route path="/sales" element={
        <ProtectedRoute>
          <Sales />
        </ProtectedRoute>
      } />

      <Route path="/inventory" element={
        <ProtectedRoute>
          <Inventory />
        </ProtectedRoute>
      } />

      <Route path="/sales-history" element={
        <ProtectedRoute>
          <SalesHistory />
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />

      <Route
        path="/inventory-history"
        element={
        <ProtectedRoute>
          <InventoryHistory />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;