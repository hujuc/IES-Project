import React, { useState } from 'react';
import Layout from '../components/global/Layout';

function Help() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I sign up?",
            answer: "To sign up, click on the 'Sign Up' button at the top right corner of the page and fill in your contract code, name, email, and password. Once completed, click 'Sign Up' to create your account."
        },
        {
            question: "How do I reset my password?",
            answer: "To reset your password, click on 'Forgot Password?' on the login page. Enter your registered email address, and we will send you instructions to reset your password."
        },
        {
            question: "What should I do if my device is not responding?",
            answer: "If your device is not responding, try restarting it and checking your Wi-Fi connection. If the issue persists, refer to the device's troubleshooting guide or contact our support team for assistance."
        },
        {
            question: "How secure is my data with HomeMaid?",
            answer: "We prioritize your privacy and data security. HomeMaid uses advanced encryption to protect your personal data and follows industry-standard practices for data storage and management."
        },
        {
            question: "How do I contact support?",
            answer: "You can reach our support team via email at support@homemaid.com or call us at +1 (123) 456-7890. We’re available Monday to Friday from 9:00 AM to 6:00 PM."
        }
    ];

    return (
        <Layout>
            {/* Page Title */}
            <div className="flex flex-col items-center text-center py-8">
                <h1 className="text-5xl font-extrabold text-orange-500 drop-shadow-md mb-4">
                    Help Center
                </h1>
                <p className="text-lg italic text-gray-700">
                    Get the assistance you need to make the most of HomeMaid.
                </p>
            </div>

            {/* Help Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg">
                            <button
                                className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-bold hover:bg-gray-100 focus:outline-none"
                                onClick={() => toggleAccordion(index)}
                            >
                                <span>{faq.question}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === index && (
                                <div className="p-4 text-sm text-gray-700 border-t border-gray-200">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Help;
