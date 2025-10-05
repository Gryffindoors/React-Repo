import React from 'react';

export default function LogoBadge() {
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-2 py-1 text-white">
      {/* Circle logo with 'HF' */}
      <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-sm bg-[#143D6D]">
        <span className="text-[0.9rem] sm:text-[1rem] font-serif italic font-bold leading-none text-white tracking-wide">
          HF
        </span>
      </div>

      {/* Text block (brand + version) */}
      <div className="flex flex-col justify-center leading-none text-white">
        <span className="text-[11px] sm:text-xs font-semibold tracking-wide">
          HF WebDev
        </span>
        <span className="text-[9px] text-slate-200">v3.0.0</span>
      </div>
    </div>
  );
}
