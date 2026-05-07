// import { sampleResponse as response } from "../../sample";
import ResponseComponentCard from "./ResponseComponentCard";

const ResponseComponent = ({ response }) => {

  // initial render, no response/error
  if (!response) return

  if (response.error) {
    return <div
    className="bg-white/50  px-3 py-5 rounded-md w-full h-[25%] text-xl text-red-700 font-bold flex justify-center items-center">{response.error}</div>;
  }
// const ResponseComponent = () => {
  const renderResponse = response.map((activity, index) => (
    <ResponseComponentCard key={index} activity={activity} index={index} />
  ));
  return (
    <div
      className="flex flex-col flex-grow gap-4 w-full max-w-2xl overflow-auto rounded-lg shadow-lg px-2 py-3">
      {renderResponse}
    </div>
  );
};

export default ResponseComponent;
