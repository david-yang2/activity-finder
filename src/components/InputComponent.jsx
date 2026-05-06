import { postRequest } from "../../utils/api";
const InputComponent = (props) => {
  const { userInput, setUserInput, setResponse, distance, setDistance, setLoadingResponse, loadingResponse } = props;


  // Function to handle form submission
  // send user prompt to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingResponse(true)
    console.log("beginning loading", loadingResponse)
    // array of object activities
    try {
      const activitySuggestions = await postRequest(userInput, distance);
      setResponse(activitySuggestions);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoadingResponse(false)
      console.log("finally", loadingResponse)
    }
  };

  return (
    <div className="w-full max-w-2xl bg-blue-300/30 rounded-lg shadow-lg p-2">
      {/* <div className="text-white text-xl">Ask away!</div> */}
      {/* Form for user prompt input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <textarea
          className="px-2 py-3 rounded-lg text-base placeholder:text-sm"
          type="text"
          placeholder="e.g. It's a sunny day in San Francisco, and I'm in the mood for something fun to do with friends. I want to be outside and enjoy the nice weather!"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="flex justify-between items-center gap-x-2">
          <div className="flex flex-row justify-start items-center">
            <label
              className="text-white text-base mr-2"
              htmlFor="distance-select"
            >
              Search within
            </label>
            <select
              id="distance-select"
              className="border border-gray-300 rounded-lg  p-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              <option value="5">5 miles</option>
              <option value="10">10 miles</option>
              <option value="15">15 miles</option>
              <option value="25">25 miles</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-1 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InputComponent;
