// import { sampleResponse as response } from "../../sample";
import ResponseComponentCard from "./ResponseComponentCard";

const ResponseComponent = ({ response, weatherData }) => {
  // initial render, no response/error
  if (!response) return;

  if (response.error) {
    return (
      <div className="bg-white/50  px-3 py-5 rounded-md w-full h-[25%] text-xl text-red-700 font-bold flex justify-center items-center">
        {response.error}
      </div>
    );
  }

  const { location, dates, temp_lows, temp_highs } = weatherData;
  console.log(location, dates, temp_lows, temp_highs);

  // convert yyyy-mm-dd to mm-dd-yyyy
  const convertDateFormat = (date) => {
    const newDate = new Date(date + "T00:00:00");
    return newDate.toLocaleDateString("en-us");
  };


  // display weather data
  const displayWeatherData = () => {
    const weatherContainerStyle = `bg-blue-500/30 px-3 py-4 rounded-md text-xl font-bold border-2 border-blue-600`;
    if (dates.length === 1) {
      return (
        <div className={weatherContainerStyle}>
          <div>{location.toUpperCase()}</div>
          <div className="text-lg font-normal">
            {convertDateFormat(dates)} H:{temp_highs}° and L:{temp_lows}°
            Fahrenheit
          </div>
        </div>
      );
    } else {
      return (
        <div className={weatherContainerStyle}>
          <div>{location.toUpperCase()}</div>
          {dates.map((date, i) => (
            <div key={i} className="text-lg font-normal">
              {convertDateFormat(date)} H:{temp_highs[i]}° and L:{temp_lows[i]}°
              Fahrenheit
            </div>
          ))}
        </div>
      );
    }
  };

  // const ResponseComponent = () => {
  const renderResponse = response.map((activity, index) => (
    <ResponseComponentCard key={index} activity={activity} index={index} />
  ));
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl max-h-[60vh] overflow-auto rounded-lg shadow-lg px-2 py-3">
      <div>{displayWeatherData()}</div>
      <div>{renderResponse}</div>
    </div>
  );
};

export default ResponseComponent;
