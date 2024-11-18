import React, { useState } from 'react';

function SignUpForm() {
    const [formData, setFormData] = useState({
        contractCode: '',
        name: '',  // Changed 'username' to 'name'
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., call an API
        console.log('Form data submitted:', formData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center bg-gray-100 p-8 shadow-lg rounded-lg w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-orange-500 text-center">Sign Up</h2>

            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text text-gray-700">Contract Code</span>
                </label>
                <input
                    type="text"
                    name="contractCode"
                    value={formData.contractCode}
                    onChange={handleChange}
                    placeholder="Enter your contract code"
                    className="input input-bordered w-full bg-gray-50"
                    required
                />
            </div>

            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text text-gray-700">Name</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}  // Using 'name' instead of 'username'
                    onChange={handleChange}
                    placeholder="Define your name"  // Updated placeholder
                    className="input input-bordered w-full bg-gray-50"
                    required
                />
            </div>

            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text text-gray-700">Email</span>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Define your email"
                    className="input input-bordered w-full bg-gray-50"
                    required
                />
            </div>

            <div className="form-control w-full mb-6 relative">
                <label className="label">
                    <span className="label-text text-gray-700">Password</span>
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Define your password"
                    className="input input-bordered w-full bg-gray-50"
                    required
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.307-3.376m3.823-2.53A10.052 10.052 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.307 3.376m-3.823 2.53A10.052 10.052 0 0112 19c-4.478 0-8.268-2.943-9.542-7" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 01-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </button>
            </div>

            <button type="submit" className="btn btn-primary w-full bg-orange-500 text-white border-none">Sign Up</button>
        </form>
    );
}

export default SignUpForm;
