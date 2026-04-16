const InputComponent = ({ userInput, setUserInput }) => {
   

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(userInput)
    }

  return (
    <div>
      <form
        onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InputComponent;
