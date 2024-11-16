import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

function Layout({ children }) {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            {/* Navbar at the top */}
            <NavBar />

            {/* Main content area with flex-grow */}
            <div className="flex-grow flex flex-col items-center">
                {children}
            </div>

            {/* Footer at the bottom */}
            <Footer />
        </div>
    );
}

<<<<<<< Updated upstream
export default Layout;
=======
export default Layout;
>>>>>>> Stashed changes
