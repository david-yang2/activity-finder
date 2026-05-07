const LoadingComponent = () => {
  return (
    <div className="flex flex-col w-full bg-blue-300/30 items-center justify-center py-8 px-3 rounded-md">
      <div className="w-full ">
        <div id="text-container" className=" p-2">
          <div className="text-2xl text-black font-bold text-center">
            {" "}
            Please Wait...
          </div>
          <p className="mb-4 text-lg ">
            Searching the web for activities. Thank you for your patience
          </p>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              animation: "progress 4s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
