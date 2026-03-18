"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";

export default function UsersPage() {

  const initialUsers = [
    { id: 1, name: "Super Admin", email: "admin@mail.com", role: "Admin", type: "Admin", status: true },
    { id: 2, name: "John Manager", email: "manager@mail.com", role: "Manager", type: "Staff", status: true },
    { id: 3, name: "Alex Staff", email: "staff@mail.com", role: "Staff", type: "Staff", status: false },
    { id: 4, name: "Maria", email: "maria@mail.com", role: "User", type: "User", status: true },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 5;

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / perPage);

  const paginated = filteredUsers.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const toggleStatus = (id) => {

    setUsers(users.map((u) =>
      u.id === id ? { ...u, status: !u.status } : u
    ));

    toast.success("Status updated");

  };

  const deleteUser = () => {

    setUsers(users.filter((u) => u.id !== selectedUser.id));

    setModal(null);

    toast.success("User deleted");

  };

  return (

    <div className="p-0 space-y-5">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        
      <input
        placeholder="Search user..."
        className="border border-gray-200 px-3 py-2 rounded-md w-64 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

        <button
          onClick={() => setModal("create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
        >
          + Create User
        </button>

      </div>

      {/* SEARCH */}


      {/* TABLE */}

      <div className="bg-white border border-gray-200  overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>

            </tr>

          </thead>

          <tbody>

            {paginated.map((user) => (

              <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">

                <td className="px-4 py-3 font-medium">
                  {user.name}
                </td>

                <td className="px-4 py-3">
                  {user.email}
                </td>

                <td className="px-4 py-3">
                  {user.role}
                </td>

                <td className="px-4 py-3">

                  <span className="bg-gray-100 px-2 py-1 text-xs rounded">
                    {user.type}
                  </span>

                </td>

                {/* TOGGLE */}

                <td className="px-4 py-3 text-center">

                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`relative w-11 h-6 rounded-full transition  cursor-pointer ${
                      user.status ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >

                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                        user.status ? "translate-x-5" : ""
                      }`}
                    />

                  </button>

                </td>

                {/* ACTIONS */}

                <td className="px-4 py-3 text-right space-x-3">

                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setModal("edit");
                    }}
                    className="text-blue-600 cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setModal("delete");
                    }}
                    className="text-red-600 cursor-pointer"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div className="flex gap-2">

        {Array.from({ length: totalPages }, (_, i) => (

          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 text-sm border border-gray-200 rounded cursor-pointer ${
              page === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >

            {i + 1}

          </button>

        ))}

      </div>

      {/* CREATE / EDIT MODAL */}

      <Dialog open={modal === "create" || modal === "edit"} onClose={() => setModal(null)}>

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

          <Dialog.Panel className="bg-white rounded-xl p-6 w-96 space-y-4">

            <Dialog.Title className="font-semibold text-lg">

              {modal === "create" ? "Create User" : "Edit User"}

            </Dialog.Title>

            <input
              placeholder="Name"
              defaultValue={selectedUser?.name}
              className="border border-gray-200 w-full px-3 py-2 rounded-md"
            />

            <input
              placeholder="Email"
              defaultValue={selectedUser?.email}
              className="border border-gray-200 w-full px-3 py-2 rounded-md"
            />

            <select className="border border-gray-200 w-full px-3 py-2 rounded-md">

              <option>Admin</option>
              <option>Manager</option>
              <option>Staff</option>

            </select>

            <div className="flex justify-end gap-2 pt-2">

              <button
                onClick={() => setModal(null)}
                className="border border-gray-200 px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  toast.success("User saved");
                  setModal(null);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Save
              </button>

            </div>

          </Dialog.Panel>

        </div>

      </Dialog>

      {/* DELETE MODAL */}

      <Dialog open={modal === "delete"} onClose={() => setModal(null)}>

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

          <Dialog.Panel className="bg-white p-6 rounded-xl w-80">

            <Dialog.Title className="font-semibold mb-2">

              Delete User

            </Dialog.Title>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete this user?
            </p>

            <div className="flex justify-end gap-2 mt-4">

              <button
                onClick={() => setModal(null)}
                className="border border-gray-200 px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={deleteUser}
                className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Delete
              </button>

            </div>

          </Dialog.Panel>

        </div>

      </Dialog>

    </div>
  );
}