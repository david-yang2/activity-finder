import { postRequest } from '../utils/api';

const InputComponent = ({ userInput, setUserInput }) => {
   

    const handleSubmit = (e) => {
        e.preventDefault()
        postRequest(userInput);
    }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit"
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
               onClick={()=>handleSubmit()}>Submit</button>
      </form>
    </div>
  );
};

export default InputComponent;
