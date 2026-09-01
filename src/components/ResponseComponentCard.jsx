const ResponseComponentCard = (props) => {
  const { activity, index } = props;

  const headerStyle =
    "text-base underline font-semibold text-slate-200 tracking-wide";
  

  const contentStyle = "text-sm text-slate-100 mb-1 bg-slate-200/30 text-black p-2 rounded-md";

  // convert date string to local date time format
  const formatDateString = (str) => {
    const dateObj = new Date(str)
    return dateObj.toLocaleString('en-US')
  }

  return (
    <div
      key={index}
      className="flex flex-col gap-1 border border-gray-300 rounded-lg p-4 bg-blue-400/30 shadow-md"
    >
      <div className="flex justify-between items-center ">

      <div className="text-lg font-semibold text-black border-slate-400">
        ACTIVITY {index + 1}:
      </div>
      <button className="bg-blue-400 px-2 py-1 rounded-md">Invite</button>
      </div>
      <div >
        <div className={`${headerStyle}`}>Activity Name</div>
        <div className={`${contentStyle}`}>{activity["Activity Name"]}</div>
      </div>

      <div>
        <div className={`${headerStyle}`}>Description</div>
        <div className={`${contentStyle}`}>{activity["Description"]}</div>
      </div>

      <div>
        <div className={`${headerStyle}`}>Location</div>
        <div className={`${contentStyle}`}>{activity["Location"]}</div>
      </div>

      <div>
        <div className={`${headerStyle}`}>Date and Time</div>
        <div className={`${contentStyle}`}>
          {formatDateString(activity["Date and Time Occurring"])}
        </div>
      </div>

      <div>
        <div className={`${headerStyle}`}>Cost</div>
        <div className={`${contentStyle}`}>{activity["Cost"]}</div>
      </div>
    </div>
  );
};

export default ResponseComponentCard;
