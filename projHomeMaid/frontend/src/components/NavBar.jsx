function NavBar() {
  return (
    <div className="navbar bg-white shadow-lg px-4">
      {/* Navbar Start (Logo) */}
      <div className="navbar-start">
        {/* Logo */}
        <img src="/public/logo.png" className="w-20 h-20 lg:w-32 lg:h-32 mx-2" alt="HomeMaid Logo" />
      </div>

      {/* Navbar End (Buttons) */}
      <div className="navbar-end space-x-4">
        <a className="btn bg-orange-500 text-white hover:bg-orange-600 transition-all border-none">Sign Up</a>
        <a className="btn bg-white border border-orange-500 text-orange-500 hover:bg-orange-100 transition-all">Log In</a>
      </div>
    </div>
  );
}

export default NavBar;
