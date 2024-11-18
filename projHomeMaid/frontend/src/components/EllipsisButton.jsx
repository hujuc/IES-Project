export default function EllipsisButton() {
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
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
            </svg>
        </button>
    );
}
