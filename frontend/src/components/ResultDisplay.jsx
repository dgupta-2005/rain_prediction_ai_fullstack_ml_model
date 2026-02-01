import React from 'react';

const ResultDisplay = ({ data }) => {
  // Logic to determine color based on probability string
  const getIntensityClass = () => {
    if (data.prediction.includes("Very high")) return "high-risk";
    if (data.prediction.includes("High") || data.prediction.includes("Moderate")) return "mid-risk";
    return "low-risk";
  };

  return (
    <div className={`result-container ${getIntensityClass()}`}>
      <h3>{data.probability}</h3>
      <p>{data.prediction}</p>
    </div>
  );
};

export default ResultDisplay;