import React from 'react';
import OurTeamImage from '../../assets/ourTeam.png'; // Import the image

function OurTeam() {
    return (
        <div className="w-full bg-gray-100 py-6"> {/* Ensures full width */}
            <h2 className="text-3xl font-bold text-orange-500 text-center mb-8">
                Meet Our Team
            </h2>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Team Member 1 */}
                <div className="text-center">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gray-300 mb-4">
                        <img src={OurTeamImage} alt="John Doe" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
                    <p className="text-gray-600">CEO & Founder</p>
                </div>

                {/* Team Member 2 */}
                <div className="text-center">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gray-300 mb-4">
                        <img src={OurTeamImage} alt="Jane Smith" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Jane Smith</h3>
                    <p className="text-gray-600">CTO</p>
                </div>

                {/* Team Member 3 */}
                <div className="text-center">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gray-300 mb-4">
                        <img src={OurTeamImage} alt="Mike Johnson" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Mike Johnson</h3>
                    <p className="text-gray-600">Lead Developer</p>
                </div>

                {/* Team Member 4 */}
                <div className="text-center">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gray-300 mb-4">
                        <img src={OurTeamImage} alt="Emily Davis" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Emily Davis</h3>
                    <p className="text-gray-600">Head of Marketing</p>
                </div>
            </div>
        </div>
    );
}

export default OurTeam;