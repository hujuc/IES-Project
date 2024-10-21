import React from 'react';

function Home() {
    return (
        <div>
            {/* Navbar */}
            <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
                <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo"></img>
                        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                    </a>
                    <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button>
                        <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                            <span class="sr-only">Open main menu</span>
                            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a href="#" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
                            </li>
                            <li>
                                <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
                            </li>
                            <li>
                                <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


            {/* Main Banner */}
            <section className="text-center p-8">
                <div className="mb-8">
                    <img
                        src="https://example.com/home-automation.jpg"
                        alt="Home Automation"
                        className="mx-auto rounded-lg shadow-lg"
                    />
                </div>
                <h1 className="text-4xl font-bold text-orange-500 mb-4">HomeMaid</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Because smart homes deserve smarter care.
                </p>
                <p className="text-md text-gray-600 mb-8 max-w-2xl mx-auto">
                    HomeMaid is a system for monitoring and managing devices and conditions
                    in smart houses. Using consumption sensors, the platform collects real-time
                    data and identifies anomalous conditions. The system allows users to remotely
                    monitor and control the environment through a web portal.
                </p>
                <button className="animate-bounce">
                    <i className="fas fa-chevron-down text-2xl text-gray-500"></i>
                </button>
            </section>

            {/* Call to Action */}
            <section className="bg-orange-100 p-8 text-center rounded-xl mx-auto shadow-lg max-w-3xl">
                <h2 className="text-3xl font-bold mb-4 text-orange-500">Start now!</h2>
                <p className="text-lg text-gray-700 mb-6">
                    Create your account right now and start controlling your smart home.
                </p>
                <div className="mb-4">
                    <img
                        src="https://example.com/family-smart-home.jpg"
                        alt="Family controlling smart home"
                        className="mx-auto rounded-lg"
                    />
                </div>
                <button className="btn btn-outline text-orange-500 border-orange-500">
                    Sign in
                </button>
            </section>

            {/* Products Section */}
            <section className="bg-black text-white p-8 mt-8">
                <h2 className="text-2xl font-bold text-center mb-6">Thousands of devices. Endless possibilities.</h2>
                <div className="flex justify-center space-x-6">
                    <div className="text-center">
                        <img
                            src="https://example.com/device1.jpg"
                            alt="Device 1"
                            className="w-24 h-24 mx-auto"
                        />
                        <p className="mt-2">Smart Camera</p>
                    </div>
                    <div className="text-center">
                        <img
                            src="https://example.com/device2.jpg"
                            alt="Device 2"
                            className="w-24 h-24 mx-auto"
                        />
                        <p className="mt-2">Smart Bulb</p>
                    </div>
                    <div className="text-center">
                        <img
                            src="https://example.com/device3.jpg"
                            alt="Device 3"
                            className="w-24 h-24 mx-auto"
                        />
                        <p className="mt-2">Smart Plug</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
