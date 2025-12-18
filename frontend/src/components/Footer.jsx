import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-6 text-center text-sm text-zinc-600">
            <p>&copy; {new Date().getFullYear()} PlaceRadar. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
