import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';

const FloatingAdminButton = () => {
  const location = useLocation();
  const isOnAdmin = location.pathname === '/admin';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed bottom-6 right-6"
      style={{ zIndex: 2147483647, pointerEvents: 'auto' }}
    >
      <Link
        to={isOnAdmin ? '/' : '/admin'}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black shadow-2xl shadow-black/50 hover:bg-zinc-200 transition-colors"
        aria-label={isOnAdmin ? 'Back to Home' : 'Go to Admin'}
        title={isOnAdmin ? 'Back to Home' : 'Admin'}
      >
        {isOnAdmin ? 'Home' : 'Admin'}
      </Link>
    </div>,
    document.body
  );
};

export default FloatingAdminButton;
