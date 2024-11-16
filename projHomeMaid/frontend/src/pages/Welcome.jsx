import PhotoCard from '../components/welcomePage/PhotoCard';
import OurImpact from '../components/welcomePage/OurImpact';
import Layout from "../components/global/Layout.jsx";

function Welcome() {
    return (
        <Layout>
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center py-6"> {/* Reduced padding */}
                <h1 className="text-5xl font-extrabold text-orange-500 drop-shadow-md mb-1"> {/* Slightly reduced margin */}
                    HomeMaid
                </h1>
                <p className="text-lg italic text-gray-700 mb-2"> {/* Reduced bottom margin */}
                    Because smart homes deserve smarter care.
                </p>
            </div>

            {/* Centered Image Section */}
            <div className="flex justify-center mb-6"> {/* Further reduced bottom margin */}
                <PhotoCard />
            </div>

            {/* Impact Section */}
            <OurImpact />
        </Layout>
    );
}

export default Welcome;