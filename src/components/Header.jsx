const Header = () => {
  return (
    <div className="w-full max-w-2xl  bg-blue-300/30 rounded-lg shadow-lg p-2 mb-3">
      <div id="header" className="flex flex-col justify-center items-start">
        <h1 className="text-xl font-bold text-center text-white">
          Find your next activity
        </h1>
        <div className="text-white">
          Tell us your mood, city, day, and distance—let us handle the rest!
        </div>
      </div>
    </div>
  );
};

export default Header;
