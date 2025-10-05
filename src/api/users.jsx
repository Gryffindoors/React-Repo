// src/api/users.js
import client from './client';

/** Convert BE user → FE shape */
function toViewModel(u) {
  return {
    username: u.username ?? '',
    name: u.name ?? u.Name ?? '',
    role: u.role ?? u.Role ?? '',
    status: (u.status ?? u.Status ?? '').toLowerCase() === 'active', // boolean
    usability: u.usability ?? u.Usability ?? 'usable',
    _raw: u, // keep raw for debugging
  };
}

/** Convert FE form → BE payload */
function toPayload(form, action) {
  return {
    action, // always include action
    token: localStorage.getItem('authToken') || null,
    username: form.username,
    password: form.password || undefined,
    name: form.name,
    role: form.role,
    status: form.status ? 'active' : 'inactive',
  };
}

/** List all users */
export async function listUsers() {
  const { data } = await client.get('', { params: { action: 'users/list' } });
  console.log('📦 [listUsers] raw response:', data);
  const arr = Array.isArray(data?.users) ? data.users : [];
  return arr.map(toViewModel);
}

/** Get a single user */
export async function getUser(username) {
  const { data } = await client.get('', {
    params: { action: 'users/get', username },
  });
  console.log('📦 [getUser] raw response:', data);
  const u = Array.isArray(data?.users)
    ? data.users[0]
    : data?.user ?? data;
  return u ? toViewModel(u) : null;
}

/** Create user */
export async function createUser(form) {
  const payload = toPayload(form, 'users/create');
  const { data } = await client.post('', payload, {
    params: { action: 'users/create' },
  });
  console.log('📦 [createUser] raw response:', data);
  return data;
}

/** Update user */
export async function updateUser(form) {
  const payload = {
    action: 'users/update',
    token: localStorage.getItem('authToken') || null,
    username: form.username, // cannot change this
    updates: {
      Name: form.name,
      Role: form.role,
      Status: form.status ? 'active' : 'inactive',
      ...(form.password ? { Password: form.password } : {}),
      ...(form.usability ? { Usability: form.usability } : {}),
    },
  };

  const { data } = await client.post('', payload, {
    params: { action: 'users/update' },
  });

  console.log('📦 [updateUser] raw response:', data);
  return data;
}


/** Soft delete user */
export async function softDeleteUser(username) {
  const payload = {
    action: 'users/delete',
    token: localStorage.getItem('authToken') || null,
    username,
  };
  const { data } = await client.post('', payload, {
    params: { action: 'users/delete' },
  });
  console.log('📦 [softDeleteUser] raw response:', data);
  return data;
}
