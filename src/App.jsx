import { useState, useEffect } from "react";
import InputComponent from "./components/InputComponent";
import ResponseComponent from "./components/ResponseComponent";
import Header from "./components/Header";
import LoadingComponent from "./components/LoadingComponent"
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const App = () => {
  const [response, setResponse] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [test, setTest] = useState("");
  const [distance, setDistance] = useState("5");
    const [loadingResponse, setLoadingResponse] = useState(false)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch(VITE_BASE_URL + '/', { method: 'GET' });
  //       // console.log(res);
  //       const data = await res.json();
  //       console.log(data)
  //       setTest(data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url(/backgroundImg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="h-screen w-full flex flex-col max-w-3xl z-20 justify-center items-center">
        <Header />
        <div
          id="components"
          className="flex flex-col w-full max-w-2xl gap-6 flex-grow overflow-hidden"
        >
          <InputComponent
            userInput={userInput}
            setUserInput={setUserInput}
            setResponse={setResponse}
            distance={distance}
            setDistance={setDistance}
            setLoadingResponse={setLoadingResponse}
            loadingResponse={loadingResponse}
          />

          {!loadingResponse ? <ResponseComponent response={response}/> : <LoadingComponent/>}
        </div>
      </div>
    </div>
  );
};

export default App;
