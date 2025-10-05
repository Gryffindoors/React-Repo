# ⚙️ Google Apps Script Backend – Authentication & User Management API

## 📌 Overview
This backend is implemented in **Google Apps Script** and exposed as a Web App.  
It provides:
- Token-based authentication with salted + peppered password hashing.
- Role-based access control (super, admin, manager, entry, accountant).
- Full user management (CRUD) with soft-delete.
- Centralized JSON responses for consistent client handling.

---

## 📂 Project Structure

backend/
├─ 00 Consts.txt # Global constants (sheet names, token lifespan)
├─ 01 headers.txt # Spreadsheet headers & logging utilities
├─ 02 server.response.txt # Unified JSON response helpers
├─ 03 auth.easy.txt # Authentication, hashing, token handling
├─ 06 Users CRUD.txt # CRUD operations for users
├─ 08 Routers.txt # doGet/doPost router & endpoint definitions
└─ sheets.core.gs # Batch-first sheet helpers

markdown
Copy code

---

## 🔑 Key Components

### Constants (`00 Consts.txt`)
- `USERS_SHEET = 'Users'`
- `LOGS_SHEET = 'Logs'`
- `TOKEN_LIFESPAN_MS = 24h`:contentReference[oaicite:0]{index=0}

### Response Helpers (`02 server.response.txt`)
- `ok(data)` → success JSON  
- `error(msg, status)` → error JSON  
- `unauthorized()`, `forbidden()`, `notFound()` → standard errors:contentReference[oaicite:1]{index=1}

### Authentication (`03 auth.easy.txt`)
- **Password Hashing** → HMAC-SHA256 with username-based salt + global `AUTH_PEPPER`.  
- **Admin Override** → Stored in Script Properties for emergency access.  
- **Token** → `generateToken()`, signed with pepper, expires after `TOKEN_LIFESPAN_MS`.  
- **Validation** → `validateToken()` checks signature, expiry, and stored token.  
- **Session** → One active token per user; stored in sheet column `AuthToken`.:contentReference[oaicite:2]{index=2}

### CRUD (`06 Users CRUD.txt`)
- `createUser(user)` → Adds new user with hashed password.  
- `updateUser(username, updates)` → Updates user fields (except password).  
- `deleteUserSoft(username)` → Marks user as deleted (`Usability = 'deleted'`).  
- `deactivateUser(username)` → Temporarily locks user (`Status = 'inactive'`).  
- `getUserList(activeOnly)` → Lists users, filtering deleted/inactive.  
- `getAllUsersData()` → Lists users but strips sensitive fields (hash, token).:contentReference[oaicite:3]{index=3}

### Router (`08 Routers.txt`)
- **doGet** / **doPost** route all API requests.  
- Each route defines:
  - `handler` (function)
  - `authRequired` (boolean)
  - `allowedRoles` (array of roles):contentReference[oaicite:4]{index=4}

---

## 📡 API Endpoints

### 🔹 Authentication
| Endpoint | Method | Handler | Auth | Notes |
|----------|--------|---------|------|-------|
| `/login` | POST | `handleLogin` | No | Requires API Key in payload. Returns token + user data. |
| `/auth/status` | GET | `handleGetAuthStatus` | Yes | Quick check if token is valid. |
| `/users/me` | GET | `handleGetMe` | Yes | Returns details of logged-in user. |

### 🔹 User Management
| Endpoint | Method | Handler | Auth | Roles |
|----------|--------|---------|------|-------|
| `/users/list` | GET | `handleGetUsersList` | Yes | super, admin, manager |
| `/users/get` | GET | `handleGetUserByUsername` | Yes | super, admin, manager |
| `/users/create` | POST | `handlePostCreateUser` | Yes | super, admin |
| `/users/update` | POST | `handlePostUpdateUser` | Yes | super, admin |
| `/users/delete` | POST | `handlePostDeleteUser` | Yes | super, admin |
| `/users/password/reset` | POST | `handlePostPasswordReset` | Yes | super, admin |

---

## 🛠️ Setup & Configuration

### Script Properties
- `API_KEY` → Required for `/login`.  
- `AUTH_PEPPER` → Required for hashing & tokens.  
- `ADMIN_USER`, `ADMIN_PASS`, `ADMIN_NAME`, `ADMIN_ROLE` → Optional override.  

### Spreadsheet
**Users Sheet headers**:  
username | Name | Role | Status | PasswordHash | Usability | AuthToken

cpp
Copy code

**Logs Sheet headers** (optional, if logging enabled):  
Timestamp | Level | Action | User | Name | Role | Message | Details

yaml
Copy code

---

## 🔒 Security Model
- Passwords are never stored in plain text — only salted & peppered hashes.  
- Tokens are time-bound (24h default) and stored per-user.  
- Soft-delete ensures usernames remain immutable.  
- Role checks enforced by router; backend always validates regardless of frontend UI.  

---

## 🧩 Maintenance & Extension

### Add a New Role
1. Add role name to allowed routes in `08 Routers.txt`.  
2. Update frontend `ROLES` array and labels.  
3. (Optional) Add role-specific UI restrictions.  

### Extend User Fields
1. Add new column in **Users** sheet.  
2. Update `createUser()` and `updateUser()` in `06 Users CRUD.txt`.  
3. Return the new field in `getAllUsersData()`.  

### Adjust Token Policy
- Change `TOKEN_LIFESPAN_MS` in `00 Consts.txt`.  
- Update `validateToken()` accordingly.  

---

## 📜 Critical Rules
- **Username immutability** → cannot be updated; must soft-delete and recreate.  
- **Password updates** → only via `/users/password/reset`, never `/users/update`.  
- **Soft-delete** → sets `Usability = 'deleted'`, clears token.  
- **Log cleanup** → `cleanOldLogs()` purges entries older than 7 days.  

---

## ✅ Example Response
Successful login:
```json
{
  "success": true,
  "status": 200,
  "token": "eyJwYXlsb2FkIj...",
  "user": {
    "username": "jdoe",
    "name": "John Doe",
    "role": "manager",
    "status": "active",
    "usability": "usable"
  }
}
📌 Notes for Developers
Backend and frontend are decoupled.

Always validate API calls against role and usability.

Consider migrating to generated numeric UserIDs in future for scalability.