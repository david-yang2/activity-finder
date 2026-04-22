const ResponseComponent = ({ response }) => {
    if (!response) return <div>Would you like to find some activities?</div>;
    
    if (response.error){
        return <div>{response.error}</div>
    }
    
    const renderResponse = response.map((activity, index) => (
        <div key={index}>
            <div>Activity {index + 1}:</div>
            <div>Activity Name: {activity["Activity Name"]}</div>
            <div>Description: {activity["Description"]}</div>
            <div>Location: {activity["Location"]}</div>
            <div>Weather Suitability: {activity["Weather Suitability"]}</div>
        </div>
    ))
    return (
        <div>
            {renderResponse}
        </div>
    );
}

export default ResponseComponent;