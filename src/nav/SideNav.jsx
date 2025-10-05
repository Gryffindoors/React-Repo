import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useNavItems } from "./useNavItems";

export default function SideNav() {
  const navItems = useNavItems();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    
    const handleMediaChange = (e) => {
      const mobile = !e.matches;
      setIsMobile(mobile);
      
      // On mobile: start closed, on desktop: always open
      if (mobile) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    // Initial setup
    handleMediaChange(mq);
    
    // Add event listener
    mq.addEventListener?.("change", handleMediaChange);
    
    return () => mq.removeEventListener?.("change", handleMediaChange);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !open) return;

    const handleClickOutside = (event) => {
      const sidenav = document.getElementById("app-sidenav");
      const toggleBtn = document.getElementById("nav-toggle-btn");
      
      if (sidenav && 
          !sidenav.contains(event.target) && 
          !toggleBtn?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, open]);

  return (
    <>
      {/* Floating toggle button - always visible when navbar is hidden on mobile */}
      {isMobile && !open && (
        <button
          id="nav-toggle-btn"
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-30 top-20 left-4 rounded-full w-12 h-12 bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
          aria-expanded={open}
          aria-controls="app-sidenav"
          aria-label="Show navigation menu"
        >
          <span className="text-xl font-bold">☰</span>
        </button>
      )}

      <aside
        id="app-sidenav"
        className={`fixed md:static z-20 top-14 md:top-auto left-0 h-[calc(100vh-3.5rem)] md:h-auto w-56 bg-gray-100 border-r border-gray-300
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 overflow-y-auto`}
      >
        <nav className="flex flex-col gap-2 p-4">
          {/* Toggle button inside sidebar */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="self-end mb-2 rounded-md border border-gray-300 bg-white p-2 text-gray-800 shadow-sm hover:bg-gray-50 active:translate-y-[1px] transition md:hidden"
            aria-expanded={open}
            aria-controls="app-sidenav"
            aria-label="Hide navigation menu"
          >
            <span className="text-xl font-bold">&times;</span>
          </button>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-center text-sm font-medium transition
                 ${isActive ? "bg-gray-300 text-gray-900" : "text-gray-700 hover:bg-gray-200"}`
              }
              onClick={() => {
                if (isMobile) setOpen(false);
              }}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Spacer on md+ */}
      <div className="hidden md:block w-56 shrink-0" aria-hidden />
    </>
  );
}