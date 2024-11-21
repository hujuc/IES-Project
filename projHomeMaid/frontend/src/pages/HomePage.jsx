import UserHeader from "../components/homePage/UserHeader.jsx";
import CardSlider from "../components/homePage/CardSlider.jsx";

function HomePage() {
    return (
        <>
            <div className="bg-[#433F3C] min-h-screen">
                <UserHeader profilePicture="https://via.placeholder.com/150" userName="Maria" />

                {/* Specific Components */}
                <div className="p-3 flex flex-col space-y-6">
                    <CardSlider />
                </div>
            </div>
        </>
    );
}

export default HomePage;
