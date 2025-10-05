// src/pages/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  listUsers,
  createUser,
  updateUser,
  softDeleteUser,
} from '../api/users';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/authContext';

const ROLES = ['super', 'manager', 'entry', 'accountant'];

export default function UsersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // restrict access: only super & manager
  if (
    !user ||
    !['super', 'manager'].includes((user.role || user.Role || '').toLowerCase())
  ) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        <div className="rounded border bg-white px-6 py-4 shadow">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    role: '',
    status: false,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUsers() {
    setLoading(true);
    const toastId = toast.loading('Loading users...');
    try {
      const arr = await listUsers();
      setUsers(arr);
      toast.success('Users loaded', { id: toastId });
    } catch (err) {
      toast.error('Failed to load users', { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(user) {
    setForm({
      username: user.username,
      password: '',
      name: user.name,
      role: user.role || '',
      status: !!user.status,
    });
    setEditingUser(user);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.username.trim()) return toast.error('Username is required');
    if (!form.name.trim()) return toast.error('Name is required');
    if (!form.role.trim()) return toast.error('Role is required');
    if (!editingUser && !form.password) {
      return toast.error('Password is required for new users');
    }

    const toastId = toast.loading(editingUser ? 'Updating user...' : 'Creating user...');
    try {
      if (editingUser) {
        await updateUser(form);
        toast.success('User updated', { id: toastId });
      } else {
        await createUser(form);
        toast.success('User created', { id: toastId });
      }
      resetForm();
      setShowForm(false);
      await loadUsers();
    } catch (err) {
      toast.error('Save failed', { id: toastId });
    }
  }

  async function handleDelete(uName) {
    const toastId = toast.loading('Deleting user...');
    try {
      await softDeleteUser(uName);
      toast.success('User deleted', { id: toastId });
      await loadUsers();
    } catch (err) {
      toast.error('Delete failed', { id: toastId });
    }
  }

  async function toggleStatus(user) {
    const toastId = toast.loading('Toggling status...');
    try {
      await updateUser({
        username: user.username,
        name: user.name,
        role: user.role,
        status: !user.status,
      });
      toast.success('Status updated', { id: toastId });
      await loadUsers();
    } catch (err) {
      toast.error('Status update failed', { id: toastId });
    }
  }

  function resetForm() {
    setForm({
      username: '',
      password: '',
      name: '',
      role: '',
      status: false,
    });
    setEditingUser(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header (keeps neutral look) */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
              title="Back"
            >
              Back
            </button>
            <h1 className="text-xl font-semibold">Manage Users</h1>
          </div>
          <button
            onClick={startCreate}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + Add New User
          </button>
        </div>
      </div>

      {/* Page Body (same visuals as modal content) */}
      <div className="mx-auto max-w-5xl px-4 py-5">
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium">All Users</h3>
          </div>

          <div className="p-4">
            {/* Users Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {loading && (
                <div className="col-span-full rounded border p-3 text-sm text-gray-600">
                  Loading…
                </div>
              )}
              {!loading && users.length === 0 && (
                <div className="col-span-full rounded border p-3 text-sm text-gray-600">
                  No users found.
                </div>
              )}
              {users.map((u) => (
                <div
                  key={u.username}
                  className="flex flex-col justify-between rounded-md border bg-white p-3 text-sm shadow-sm"
                >
                  {/* Name + Actions */}
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="text-base font-bold text-gray-800">{u.name}</h4>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(u)}
                        title="Edit"
                        className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Edit
                      </button>

                      {(user?.role || user?.Role || '').toLowerCase() === 'super' && (
                        <button
                          onClick={() => handleDelete(u.username)}
                          title="Delete"
                          className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Username + Role */}
                  <div className="mb-2">
                    <p className="text-gray-600">{u.username}</p>
                    <p className="font-semibold capitalize text-gray-800">{u.role}</p>
                  </div>

                  {/* Status & Toggle */}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.status
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                        }`}
                    >
                      {u.status ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleStatus(u)}
                      className={`rounded px-3 py-1 text-xs font-semibold transition ${u.status
                          ? 'bg-red-200 text-red-800 hover:bg-red-300'
                          : 'bg-green-200 text-green-800 hover:bg-green-300'
                        }`}
                    >
                      {u.status ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}

            </div>

            {/* Form */}
            {showForm && (
              <>
                <hr className="my-4 border-gray-200" />
                <h3 className="mb-4 text-lg font-medium">
                  {editingUser ? `Edit User: ${editingUser.username}` : 'Add New User'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className={`w-full rounded border p-2 ${editingUser ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                        }`}
                      autoComplete="username"
                      disabled={!!editingUser}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Password</label>
                    <div className="flex">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="flex-1 rounded-l border p-2"
                        autoComplete={editingUser ? 'new-password' : 'new-password'}
                        placeholder={editingUser ? 'Leave blank to keep current' : ''}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="rounded-r border border-l-0 bg-gray-50 px-3 py-2 hover:bg-gray-100"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded border p-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Role</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full rounded border p-2"
                    >
                      <option value="">Select a role</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="status"
                      type="checkbox"
                      name="status"
                      checked={form.status}
                      onChange={handleChange}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <label htmlFor="status" className="ml-2 text-sm font-medium">
                      Active
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        resetForm();
                        setShowForm(false);
                      }}
                      className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
                    >
                      {editingUser ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
