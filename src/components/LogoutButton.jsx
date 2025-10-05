// src/components/LogoutButton.jsx
import React from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router';

export default function LogoutButton() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();             // Clear auth context + localStorage
    navigate('/login');   // Redirect to login
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm shadow-[0_0_6px_rgba(255,255,255,0.3)] ring-1 ring-white/30 text-white text-sm">
      <span className="font-medium whitespace-nowrap">Hello, {user.name}</span>
      <button
        onClick={handleLogout}
        className="bg-[#cc3333] hover:bg-[#b82626] text-white px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-all active:translate-y-[1px] active:shadow-inner"
      >
        Logout
      </button>
    </div>
  );
}
