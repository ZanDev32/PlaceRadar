import React from 'react';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-white">
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;