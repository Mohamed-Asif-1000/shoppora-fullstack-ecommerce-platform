import type { ChangeEvent } from "react";
import type { User } from "../../types";
import type { UserFormData } from "./adminTypes";

type Props = {
  filteredUsers: User[];
  userRoleFilter: "all" | "customer" | "seller" | "delivery";
  userForm: UserFormData;
  showUserForm: boolean;
  onChangeUserForm: (value: UserFormData) => void;
  onOpenUserForm: (user?: User) => void;
  onCancelUserForm: () => void;
  onSaveUser: () => Promise<void>;
  onDeleteUser: (id?: number) => Promise<void>;
  setUserRoleFilter: (role: "all" | "customer" | "seller" | "delivery") => void;
};

export default function UsersTab({
  filteredUsers,
  userRoleFilter,
  userForm,
  showUserForm,
  onChangeUserForm,
  onOpenUserForm,
  onCancelUserForm,
  onSaveUser,
  onDeleteUser,
  setUserRoleFilter,
}: Props): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400">
            Browse customers, sellers, and delivery agents.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          {(["all", "customer", "seller", "delivery"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setUserRoleFilter(role)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                userRoleFilter === role
                  ? "bg-pink-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {role === "all"
                ? "All"
                : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}

          <button
            onClick={() => onOpenUserForm()}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 md:ml-4"
          >
            Add User
          </button>
        </div>
      </div>

      {showUserForm && (
        <div className="mb-4 rounded-lg border border-slate-700 bg-slate-900/80 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              value={userForm.username}
              onChange={(e) =>
                onChangeUserForm({ ...userForm, username: e.target.value })
              }
              placeholder="Username"
              className="rounded-lg bg-slate-800 px-3 py-2 text-white"
            />
            <input
              value={userForm.email}
              onChange={(e) =>
                onChangeUserForm({ ...userForm, email: e.target.value })
              }
              placeholder="Email"
              className="rounded-lg bg-slate-800 px-3 py-2 text-white"
            />
            <select
              value={userForm.role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onChangeUserForm({
                  ...userForm,
                  role: e.target.value as UserFormData["role"],
                })
              }
              className="rounded-lg bg-slate-800 px-3 py-2 text-white"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="delivery">Delivery</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={userForm.approval_status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onChangeUserForm({
                  ...userForm,
                  approval_status: e.target
                    .value as UserFormData["approval_status"],
                })
              }
              className="rounded-lg bg-slate-800 px-3 py-2 text-white"
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="disabled">Disabled</option>
            </select>
            <input
              value={userForm.phone}
              onChange={(e) =>
                onChangeUserForm({ ...userForm, phone: e.target.value })
              }
              placeholder="Phone"
              className="rounded-lg bg-slate-800 px-3 py-2 text-white"
            />
            <input
              value={userForm.password}
              onChange={(e) =>
                onChangeUserForm({ ...userForm, password: e.target.value })
              }
              placeholder="Password (leave blank to keep)"
              className="rounded-lg bg-slate-800 px-3 py-2 text-white md:col-span-2"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onSaveUser}
                className="rounded-lg bg-pink-500 px-4 py-2 text-white"
              >
                Save
              </button>
              <button
                onClick={onCancelUserForm}
                className="rounded-lg bg-slate-700 px-4 py-2 text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-600 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-700 hover:bg-slate-700/30"
              >
                <td className="px-4 py-3 text-slate-300">
                  #{String(user.id).padStart(3, "0")}
                </td>
                <td className="px-4 py-3 text-white">{user.username}</td>
                <td className="px-4 py-3 text-slate-400">{user.email}</td>
                <td className="px-4 py-3 text-slate-300">{user.role}</td>
                <td className="px-4 py-3 text-slate-300">
                  {user.phone || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.approval_status === "approved"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : user.approval_status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {user.approval_status || user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenUserForm(user)}
                      className="rounded-md bg-blue-500 px-3 py-1 text-xs text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-xs text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <p className="mt-6 text-center text-slate-400">
          No users match this filter.
        </p>
      )}
    </div>
  );
}
