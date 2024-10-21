function Stats() {
    return (
      <div className="bg-gray-100 py-12">
        <h2 className="text-4xl font-bold text-center mb-10">Our Impact</h2>
  
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Users Stat */}
          <div className="bg-white shadow-lg p-8 rounded-lg">
            <h3 className="text-5xl font-bold text-orange-500">15,000+</h3>
            <p className="mt-2 text-lg text-gray-600">Happy Users</p>
          </div>
  
          {/* Completed Tasks Stat */}
          <div className="bg-white shadow-lg p-8 rounded-lg">
            <h3 className="text-5xl font-bold text-orange-500">50,000+</h3>
            <p className="mt-2 text-lg text-gray-600">Tasks Completed</p>
          </div>
  
          {/* Satisfaction Rating Stat */}
          <div className="bg-white shadow-lg p-8 rounded-lg">
            <h3 className="text-5xl font-bold text-orange-500">98%</h3>
            <p className="mt-2 text-lg text-gray-600">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Stats;
  