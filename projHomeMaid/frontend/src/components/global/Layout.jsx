import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

function Layout({ children }) {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <NavBar />

            <div className="flex-grow flex flex-col items-center">
                {children}
            </div>

            <Footer />
        </div>
    );
}

export default Layout;