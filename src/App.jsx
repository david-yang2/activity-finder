import { useState, useEffect } from 'react';
import InputComponent from '../components/InputComponent';
import ResponseComponent from '../components/ResponseComponent';
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
import { postRequest } from '../utils/api';


const App = () => {
  const [response, setResponse] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [test, setTest] = useState('')


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(VITE_BASE_URL + '/', { method: 'GET' });
        // console.log(res);
        const data = await res.json();
        console.log(data)
        setTest(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Ready to find your next activity?</h1>
      <InputComponent 
          userInput={userInput}
          setUserInput={setUserInput} />
      <ResponseComponent response={response} />
      <button onClick={() => postRequest(userInput)}>Send POST Request</button>
    </div>
  );
};

export default App;