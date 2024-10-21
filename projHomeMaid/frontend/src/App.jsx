import NavBar from "./components/NavBar"
import PhotoCard from "./components/PhotoCard"
import Stats from "./components/Stats";

function App() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/2 flex-grow">
          <PhotoCard />
        </div>

        <div className="w-full md:w-1/3 flex-grow flex flex-col justify-center items-center p-4 mx-auto bg-white text-black">
          <h1 className="text-3xl font-bold mb-2 text-orange-500 text-center">HomeMaid</h1>
          <p className="text-lg italic mb-4 text-center">Because smart homes deserve smarter care.</p>
          <p className="text-center">
            HomeMaid is a system for monitoring and managing devices and conditions in smart houses. Using consumption sensors, the platform collects real-time data and identifies anomalous conditions. The system allows users to remotely monitor and control the environment through a web portal.
          </p>
        </div>
      </div>

      <div>
        <Stats></Stats>
      </div>
    </>
  )
}

export default App;
