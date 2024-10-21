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

        <div className="w-full md:w-1/2 flex-grow">
          <PhotoCard />
        </div>
      </div>
      <div>
        <Stats></Stats>
      </div>
    </>
  )
}

export default App;
