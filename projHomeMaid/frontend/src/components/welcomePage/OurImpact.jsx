function OurImpact() {
    return (
        <div className="w-full bg-gray-100 py-6"> {/* Ensures full width */}
            <h2 className="text-3xl font-bold text-center mb-6">Our Impact</h2>

            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                {/* Users Stat */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h3 className="text-4xl font-bold text-orange-500">15,000+</h3>
                    <p className="mt-1 text-sm text-gray-600">Happy Users</p>
                </div>

                {/* Completed Tasks Stat */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h3 className="text-4xl font-bold text-orange-500">50,000+</h3>
                    <p className="mt-1 text-sm text-gray-600">Tasks Completed</p>
                </div>

                {/* Satisfaction Rating Stat */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h3 className="text-4xl font-bold text-orange-500">98%</h3>
                    <p className="mt-1 text-sm text-gray-600">Customer Satisfaction</p>
                </div>
            </div>
        </div>
    );
}

export default OurImpact;