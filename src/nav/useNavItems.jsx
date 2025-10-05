// src/nav/useNavItems.js
import { useAuth } from "../context/authContext";
import { NAV_ITEMS } from "./NavbarCentral";

export function useNavItems() {
  const { user } = useAuth();

  if (!user) return [];

  // Filter NAV_ITEMS based on user role
  return NAV_ITEMS.filter(item => item.roles.includes(user.role));
}
