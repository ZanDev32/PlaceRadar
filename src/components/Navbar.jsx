import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-fit">
      <div className="flex items-center justify-between gap-2 p-1.5 pl-5 pr-1.5 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/80">
        
        {/* KIRI: Logo & Menu */}
        <div className="flex items-center gap-6 mr-4">
          {/* Logo Icon */}
          <div className="flex items-center text-white">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/>
                <path d="M5 21V7l8-4 8 4v14"/>
                <path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
             </svg>
          </div>

          {/* Links: terdekat, kategori, terserah */}
          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Manifesto</a>
            <a href="#" className="hover:text-white transition-colors">Discover</a>
          </div>
        </div>

        {/* KANAN: Login & Sign up */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Log In
          </button>
          <button className="px-5 py-2 text-sm font-bold text-black bg-white rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;