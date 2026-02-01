import { useState } from 'react';
import axios from 'axios';
import InputField from './components/InputField';
import PredictButton from './components/PredictButton';
import ResultDisplay from './components/ResultDisplay';
import './index.css';

function App() {
  // Initial state for weather parameters
  const initialState = {
    temp: "",
    humidity: "",
    clouds: "",
    pressure: ""
     };

  const [formData, setFormData] = useState(initialState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Updates specific fields in the state
  const handleChange = (name, value) => {
  // 1. Allow empty string so the user can clear the field
  if (value === "") {
    setFormData({ ...formData, [name]: "" });
    return;
  }

  // 2. Regex check: Only allow numbers and a single decimal point
  // This prevents letters or special characters from being typed
  const numericValue = value.replace(/[^0-9.]/g, '');

  // 3. Update state with the cleaned numeric string
  setFormData({ ...formData, [name]: numericValue });
};

  const handleReset = () => {
    setFormData(initialState);
    setResult(null);
  };

  // Sends data to your Python backend
  const handlePredict = async () => {
  setLoading(true);
  try {
    // Create a copy and convert any empty strings to 0 for the ML model
    const dataToSend = {
      temp: formData.temp === "" ? 0 : parseFloat(formData.temp),
      humidity: formData.humidity === "" ? 0 : parseFloat(formData.humidity),
      clouds: formData.clouds === "" ? 0 : parseFloat(formData.clouds),
      pressure: formData.pressure === "" ? 0 : parseFloat(formData.pressure)
    };

    const response = await axios.post('https://rain-backend-api-3lm8.onrender.com/predict', dataToSend);
    setResult(response.data);
  } catch (error) {
    console.error("Connection Error:", error);
    alert("Check your backend connection!");
  }
  setLoading(false);
};

  return (
    <div className="app-wrapper">
      <div className="rain-card">
        <header className="card-header">
          <div className="brand">
            <span className="brand-logo">🌧️</span>
            <h2>RainPredict AI</h2>
          </div>
          <p className="subtitle">Enter parameters to calculate probability of rain based on the following factors via our ML model.</p>
        </header>

        <div className="input-grid">
          <InputField label="TEMPERATURE" icon="🌡️" unit="°C" name="temp" value={formData.temp} onChange={handleChange} />
          <InputField label="HUMIDITY" icon="💧" unit="%" name="humidity" value={formData.humidity} onChange={handleChange} />
          <InputField label="AIR PRESSURE" icon="⏲️" unit="mb" name="pressure" value={formData.pressure} onChange={handleChange} />
          <InputField label="CLOUD COVERAGE" icon="☁️" unit="%" name="clouds" value={formData.clouds} onChange={handleChange} />
        </div>

        <div className="button-group">
          <PredictButton onClick={handlePredict} loading={loading} />
          <button className="reset-icon-btn" onClick={handleReset} title="Reset">
            🔄
          </button>
        </div>

        {result && <ResultDisplay data={result} />}
      </div>
    </div>
  );
}

export default App;