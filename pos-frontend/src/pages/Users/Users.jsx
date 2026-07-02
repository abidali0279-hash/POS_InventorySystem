import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  getUsers,
  createUser,
  toggleUserStatus
} from "../../services/userService";

function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    branchId: 1,
    fullName: "",
    email: "",
    password: "",
    role: "Cashier"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {

    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);

  }, [message]);

  useEffect(() => {

    const close = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", close);

    return () =>
      window.removeEventListener("keydown", close);

  }, []);

  const loadUsers = async () => {

    try {

      setLoading(true);

      const data = await getUsers();

      setUsers(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const resetForm = () => {

    setForm({
      branchId: 1,
      fullName: "",
      email: "",
      password: "",
      role: "Cashier"
    });

  };

  const handleSubmit = async () => {

    if (
      !form.fullName ||
      !form.email ||
      !form.password
    ) {

      setMessage("Please fill all fields.");
      setMessageType("error");
      return;

    }

    try {

      await createUser(form);

      setMessage("User created successfully.");
      setMessageType("success");

      setShowModal(false);

      resetForm();

      loadUsers();

    }

    catch {

      setMessage("Failed to create user.");
      setMessageType("error");

    }

  };

  const changeStatus = async (id) => {

    const confirmStatus = window.confirm(
      "Change user status?"
    );

    if (!confirmStatus) return;

    try {

      await toggleUserStatus(id);

      setMessage("Status updated.");

      setMessageType("success");

      loadUsers();

    }

    catch {

      setMessage("Operation failed.");

      setMessageType("error");

    }

  };

  const filteredUsers =
    users.filter(user =>
      user.fullName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

   if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="space-y-6">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Users
            </h1>

            <p className="text-gray-500">
              Manage system users
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow"
          >
            + Add User
          </button>

        </div>

        {/* Alert */}

        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-white ${
              messageType === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Search */}

        <div className="bg-white rounded-xl shadow p-5">

          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

        </div>

        {/* Users Table */}

        <div className="bg-white rounded-xl shadow">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4">ID</th>

                  <th className="text-left p-4">Name</th>

                  <th className="text-left p-4">Email</th>

                  <th className="text-left p-4">Role</th>

                  <th className="text-left p-4">Status</th>

                  <th className="text-center p-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-500"
                    >
                      No Users Found
                    </td>

                  </tr>

                ) : (

                  filteredUsers.map(user => (

                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {user.id}
                      </td>

                      <td className="p-4 font-medium">
                        {user.fullName}
                      </td>

                      <td className="p-4">
                        {user.email}
                      </td>

                      <td className="p-4">

                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">

                          {user.role}

                        </span>

                      </td>

                      <td className="p-4">

                        {user.isActive ? (

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                            Active

                          </span>

                        ) : (

                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">

                            Inactive

                          </span>

                        )}

                      </td>

                      <td className="p-4">

                        <div className="flex justify-center">

                          <button
                            onClick={() => changeStatus(user.id)}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                          >
                            Toggle
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Modal */}

        {showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                  Add User
                </h2>

                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>

              </div>

              <div className="space-y-4">

                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />

                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                />

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="Cashier">
                    Cashier
                  </option>

                  <option value="Manager">
                    Manager
                  </option>

                  <option value="Admin">
                    Admin
                  </option>

                </select>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="border px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  Save User
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </Layout>
  );
}

export default Users;