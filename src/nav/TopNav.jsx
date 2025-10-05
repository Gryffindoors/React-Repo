import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useNavItems } from "./useNavItems";

export default function TopNav() {
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

  // Close navbar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !open) return;

    const handleClickOutside = (event) => {
      const topnav = document.getElementById("app-topnav");
      const toggleBtn = document.getElementById("topnav-toggle-btn");
      
      if (topnav && 
          !topnav.contains(event.target) && 
          !toggleBtn?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, open]);

  return (
    <div className="w-full border-b border-gray-300 bg-gray-100 relative">
      {/* Floating toggle button - appears when navbar is hidden on mobile */}
      {isMobile && !open && (
        <button
          id="topnav-toggle-btn"
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-30 top-4 right-4 rounded-full w-12 h-12 bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
          aria-expanded={open}
          aria-controls="app-topnav"
          aria-label="Show navigation menu"
        >
          <span className="text-xl font-bold">☰</span>
        </button>
      )}

      <nav
        id="app-topnav"
        className={`transition-all duration-300 ease-in-out
        ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0 md:max-h-40 md:opacity-100"} overflow-hidden`}
      >
        <ul className="flex flex-col md:flex-row items-center justify-center gap-3 px-4 py-2">
          {navItems.map((item) => (
            <li key={item.path} className="w-full md:w-auto">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `inline-block w-full px-3 py-2 rounded-md text-sm font-medium text-center transition
                   ${isActive ? "bg-gray-300 text-gray-900" : "text-gray-700 hover:bg-gray-200"}`
                }
                onClick={() => {
                  if (isMobile) setOpen(false);
                }}
              >
                {item.name}
              </NavLink>
            </li>
          ))}

          {/* Toggle button inside navbar - only show on mobile */}
          {isMobile && open && (
            <li className="w-full md:w-auto md:hidden">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-800 shadow-sm hover:bg-gray-50 active:translate-y-[1px] transition text-center"
                aria-expanded={open}
                aria-controls="app-topnav"
                aria-label="Hide navigation menu"
              >
                <span className="text-xl font-bold">&times;</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}