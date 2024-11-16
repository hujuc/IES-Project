<<<<<<< Updated upstream
=======
// src/components/Global/NavBar.jsx
>>>>>>> Stashed changes
function NavBar() {
    return (
        <div className="navbar bg-white shadow-lg px-2 py-2 sticky top-0 z-50">
            <div className="navbar-start">
                <img src="/public/logo.png" className="w-12 h-12 lg:w-16 lg:h-16 mx-2" alt="HomeMaid Logo" />
            </div>

            <div className="navbar-end space-x-2">
                <a className="btn bg-orange-500 text-white hover:bg-orange-600 transition-all border-none px-3 py-1">Sign Up</a>
                <a className="btn bg-white border border-orange-500 text-orange-500 hover:bg-orange-100 transition-all px-3 py-1">Log In</a>
            </div>
        </div>
    );
}

export default NavBar;