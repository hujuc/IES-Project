import React from 'react';
import Layout from '../components/global/Layout';
import OurTeam from '..//components/aboutUsPage/OurTeam.jsx';

function AboutUs() {
    return (
        <Layout>
            {/* Page Title with Full-Width Orange Background */}
            <div className="bg-orange-500 w-full py-12 text-center">
                <h1 className="text-5xl font-extrabold text-white mb-4">
                    About HomeMaid
                </h1>
                <p className="text-lg text-white font-light mx-auto max-w-3xl">
                    Making your home smarter, simpler, and more comfortable.
                </p>
            </div>

            {/* Main Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-10">
                <section className="mb-8 text-center"> {/* Reduced bottom margin */}
                    <h2 className="text-3xl font-bold text-orange-500 mb-4">
                        HomeMaid at a Glance
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mx-auto max-w-xl">
                        HomeMaid is a cutting-edge smart home platform that gives you the power to monitor and control your home from the palm of your hand. With a seamless interface, HomeMaid integrates your entire home into one app, making it easier to manage everything from lighting and temperature to security and appliances. Whether you're at home or on the go, HomeMaid provides you with full control over your living space.
                    </p>
                </section>

                <section className="mb-8 text-center"> {/* Reduced bottom margin */}
                    <h2 className="text-3xl font-bold text-orange-500 mb-4">
                        Our Vision
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mx-auto max-w-xl">
                        Our goal is to redefine the way you interact with your home by offering an intuitive platform for home management. With HomeMaid, we aim to make smart homes more accessible and user-friendly, prioritizing convenience, ease of use, and improving your lifestyle. We believe that time saved managing your home is time you can spend doing what truly matters.
                    </p>
                </section>

                <section className="mb-8 text-center"> {/* Reduced bottom margin */}
                    <h2 className="text-3xl font-bold text-orange-500 mb-4">
                        How HomeMaid Works
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mx-auto max-w-xl">
                        HomeMaid connects all your smart home devices into one centralized platform. Access it via the web or mobile app to control everything from your lights and thermostat to security systems and appliances. Simplify home management without needing technical expertise. Just use the HomeMaid app, and enjoy a smarter, more comfortable living experience.
                    </p>
                </section>
            </div>

            <OurTeam />

        </Layout>
    );
}

export default AboutUs;
