export default function GetBackButton() {
    return (
        <button
            className="btn btn-circle"
            style={{
                backgroundColor: "#5A5654", // Slightly lighter than background
                border: "2px solid #FFFFFF", // White border for better contrast
                color: "#FFFFFF", // White icon color
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7" // Updated path for "<" arrow
                />
            </svg>
        </button>
    );
}
