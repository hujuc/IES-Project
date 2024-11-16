import React from 'react';

function Footer() {
    return (
        <div
            className="bg-white py-4 flex justify-center space-x-6 text-gray-600 text-sm"
            style={{ boxShadow: '0 -4px 6px -2px rgba(0, 0, 0, 0.1)' }} // Custom top shadow
        >
            <a href="#help" className="flex items-center hover:text-orange-500">
                <span className="mr-1">❓</span> Help
            </a>
            <span className="border-l border-gray-300 h-5"></span>
            <a href="#about" className="flex items-center hover:text-orange-500">
                <span className="mr-1">ℹ️</span> About Us
            </a>
        </div>
    );
}

export default Footer;