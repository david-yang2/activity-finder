import { postRequest } from "../utils/api";

const InputComponent = (props) => {
  const { userInput, setUserInput, setResponse } = props;

  // Function to handle form submission
  // send user prompt to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    // array of object activities
    try {
      const activitySuggestions = await postRequest(userInput);
      setResponse(activitySuggestions);
    } catch (error) {
      setResponse({ error: error.message });
    }
  };

  return (
    <div>
      {/* Form for user prompt input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InputComponent;
