"use client";

import { useState } from "react";
// import PermissionTable from "./PermissionTable";

export default function RolesPage() {

  const [roles, setRoles] = useState([
    { id: 1, name: "Admin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "Staff" },
  ]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");

  const createRole = () => {
    if (!roleName) return;

    const newRole = {
      id: roles.length + 1,
      name: roleName,
    };

    setRoles([...roles, newRole]);
    setRoleName("");
    setShowModal(false);
  };

  return (
    <div className="p-0 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">

        <h1 className="text-xl font-semibold">
          Roles Management
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          + Create Role
        </button>

      </div>

      {/* Roles Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left px-4 py-3">Role Name</th>
              <th className="text-right px-4 py-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {roles.map((role) => (

              <tr
                key={role.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >

                <td className="px-4 py-3 font-medium">
                  {role.name}
                </td>

                <td className="px-4 py-3 text-right">

                  <button
                    onClick={() => setSelectedRole(role)}
                    className="text-blue-600 text-sm"
                  >
                    Manage Permissions
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Permission Table */}
      {/* {selectedRole && (
        <PermissionTable role={selectedRole} />
      )} */}

      {/* Create Role Modal */}
      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-96 p-6 rounded-lg">

            <h2 className="font-semibold mb-4">
              Create Role
            </h2>

            <input
              type="text"
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="border border-gray-200 w-full px-3 py-2 rounded-md mb-4"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={createRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}