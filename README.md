# 🛠️ React Frontend – Authentication & User Management

## 📌 Overview
This project is a **React + Vite frontend** that connects to a Google Apps Script backend.  
It implements:
- Authentication (login/logout, token-based session management).
- Protected routes (only accessible by authenticated users).
- User management (CRUD for users with role-based access).
- Modular layout with reusable navigation and components.

Target audience: **developers** who want to understand, run, or extend the system.

---

## 📂 Project Structure

src/
├─ api/ # API clients and endpoints
│ ├─ auth.jsx # Login / logout requests
│ ├─ client.jsx # Axios client with interceptors
│ └─ users.jsx # User CRUD (list, create, update, delete)
│
├─ assets/ # Static assets (images, etc.)
│
├─ components/
│ ├─ LogoutButton.jsx
│ └─ PrivateRoute.jsx # Protects routes from unauthenticated access
│
├─ context/
│ └─ authContext.jsx # Provides user state & auth helpers across app
│
├─ layouts/
│ ├─ background.jsx # Background wrapper layout
│ └─ logoBadge.jsx
│
├─ nav/
│ ├─ NavbarCentral.jsx
│ ├─ SideNav.jsx
│ ├─ TopNav.jsx
│ └─ useNavItems.jsx # Central definition of nav items
│
├─ pages/
│ ├─ home.jsx
│ ├─ loginPage.jsx
│ └─ UsersPage.jsx # Manage users CRUD UI
│
├─ utils/
│ ├─ commonUtils.jsx # Helpers (e.g., number/date normalization)
│ └─ safeJson.jsx # JSON parse/stringify safe wrappers
│
├─ App.jsx # Main app routing
└─ index.css # Global styles

## 🔑 Key Modules

### API (`src/api/`)
- **client.jsx** → Axios instance with interceptors (attaches API key & token).  
- **auth.jsx** → Login/logout API functions.  
- **users.jsx** → CRUD operations (`listUsers`, `createUser`, `updateUser`, `softDeleteUser`).  

### Context (`src/context/authContext.jsx`)
- Provides authentication state (`user`, `token`).  
- Handles login/logout and stores token in `localStorage`.  
- Accessible across app via `useAuth()`.  

### Components
- **PrivateRoute.jsx** → Protects routes, redirects to login if not authenticated.  
- **LogoutButton.jsx** → Ends session and redirects to login.  

### Pages
- **loginPage.jsx** → Username/password login form.  
- **UsersPage.jsx** → User management UI:
  - Add/edit form  
  - Active/inactive toggle  
  - Delete (visible only if logged-in user role = `super`)  
- **home.jsx** → Basic landing page after login.  

### Navigation
- **TopNav / SideNav / NavbarCentral** → Navigation layouts.  
- **useNavItems.jsx** → Central config for navigation items (can be role-based).  

---

## 🔐 Auth Flow
1. User logs in → `auth.jsx` sends username/password to backend.  
2. Backend validates credentials and returns a token.  
3. `authContext.jsx` stores token in `localStorage`.  
4. `client.jsx` attaches token to all API requests automatically.  
5. `PrivateRoute.jsx` restricts access to protected pages.  

---

## ⚙️ Setup & Configuration

### Requirements
- Node.js 18+
- npm or yarn

### Install & Run
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
Environment Variables
Create a .env file in the project root:

ini
Copy code
VITE_GSCRIPT_API_KEY=your-api-key
VITE_GSCRIPT_BASE_URL=your-deployed-url
🛠️ Extending the Project
➕ Add a New Page
Create a new file in src/pages/ (e.g., ReportsPage.jsx).

Add a route in App.jsx.

Add a menu item in useNavItems.jsx.

👤 Add a New Role
Add role to ROLES array in UsersPage.jsx.

Update role-based access logic in authContext and backend checks.

(Optional) Add Arabic labels via a ROLE_LABELS mapping.

📝 Extend User Fields
Add the new field in UsersPage.jsx form.

Update API calls in users.jsx.

Update backend (Google Script & Sheets schema).

🔒 Security Notes
Secrets (API_KEY, PEPPER) must stay in .env (never in Git).

PrivateRoute ensures only logged-in users access protected pages.

Backend must also enforce role checks, since frontend checks can be bypassed.

📜 License
This project is part of a reusable starter kit. Adapt freely for your own projects.