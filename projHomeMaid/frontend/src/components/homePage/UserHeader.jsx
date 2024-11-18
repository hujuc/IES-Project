import NotificationDropdown from "./NotificationDropdown";
import SettingsDropdown from "./SettingsDropdown";

function UserHeader(props) {
    return (
        <div className="bg-transparent text-gray-300 p-5">
            <div className="flex justify-between items-start">
                <div>
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                            src={props.profilePicture}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex space-x-4">
                    {/* Notification Dropdown */}
                    <NotificationDropdown />

                    {/* Settings Dropdown */}
                    <SettingsDropdown />
                </div>
            </div>

            <div className="mt-4">
                <h1 className="text-xl font-semibold text-white">Hi, Maria</h1>
                <p className="text-sm text-gray-400">Monitor and Control your house</p>
            </div>
        </div>
    );
}

export default UserHeader;
