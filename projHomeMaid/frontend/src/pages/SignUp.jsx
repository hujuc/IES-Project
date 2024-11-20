import React from 'react';
import Layout from '../components/global/Layout';
import SignUpForm from '../components/SignUpPage/SignUpForm';

function SignUp() {
    return (
        <Layout>
            {/* Top Orange Stripe with Bottom Wave */}
            <div className="relative w-full">
                <div className="bg-orange-500 h-24 w-full"></div>
                <svg
                    className="absolute bottom-0 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    style={{ marginBottom: "-2px" }}
                >
                    <path
                        fill="#ffffff"
                        d="M0,256L60,245.3C120,235,240,213,360,197.3C480,181,600,171,720,186.7C840,203,960,245,1080,234.7C1200,224,1320,160,1380,128L1440,96L1440,320L0,320Z"
                    ></path>
                </svg>
            </div>

            {/* Centered Sign-Up Form */}
            <div className="flex-grow flex items-center justify-center">
                <SignUpForm />
            </div>

            {/* Bottom Orange Wave */}
            <div className="relative w-full">
                <svg
                    className="absolute top-0 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                >
                    <path
                        fill="#ffffff"
                        d="M0,256L60,245.3C120,235,240,213,360,197.3C480,181,600,171,720,186.7C840,203,960,245,1080,234.7C1200,224,1320,160,1380,128L1440,96L1440,0L0,0Z"
                    ></path>
                </svg>
                <div className="bg-orange-500 h-24 w-full"></div>
            </div>
        </Layout>
    );
}

export default SignUp;
