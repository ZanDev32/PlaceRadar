import React from 'react';
import Footer from './Footer';
import FloatingAdminButton from './FloatingAdminButton';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-white">
            <main>{children}</main>
            <FloatingAdminButton />
            <Footer />
        </div>
    );
};

export default Layout;