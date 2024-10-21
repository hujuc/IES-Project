import NavBar from "./components/NavBar"
import PhotoCard from "./components/PhotoCard"

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
    </>
  )
}

export default App;
