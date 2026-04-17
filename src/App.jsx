import { useState, useEffect } from 'react';
import InputComponent from '../components/InputComponent';
import ResponseComponent from '../components/ResponseComponent';
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;



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
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/backgroundImg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 relative z-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Ready to find your next activity?
        </h1>
        
        <div className="flex flex-col gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <InputComponent 
                userInput={userInput}
                setUserInput={setUserInput} />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg min-h-40">
            <ResponseComponent response={response} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;