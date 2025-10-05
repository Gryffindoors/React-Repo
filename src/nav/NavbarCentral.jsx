// src/nav/NavbarCentral.jsx

// 🔹 Define all roles in the system
export const ROLES = {
  OWNER: "super",
  MANAGER: "manager",   
  ENTRY: "entry",
  ACCOUNTANT: "accountant",
};

// 🔹 Pick which navbar style is active
// export const NAVBAR_TYPE = "side"; // or "top"
export const NAVBAR_TYPE = "top"; // or "side"

// 🔹 Define all navigation items
export const NAV_ITEMS = [
  {
    name: "Home",
    path: "/",
    icon: "home",
    roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ENTRY, ROLES.ACCOUNTANT],
  },
  {
    name: "Reports",
    path: "/reports",
    icon: "bar-chart",
    roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ACCOUNTANT],
  },
  {
    name: "Users",
    path: "/users",
    icon: "person",
    roles: [ROLES.OWNER, ROLES.MANAGER],
  },
];
