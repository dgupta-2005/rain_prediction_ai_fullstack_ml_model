
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

from starlette.middleware.cors import CORSMiddleware

app= FastAPI()

@app.get("/")
def health_check():
    return {"status": "ok", "message": "RainPredict AI is online"}

# 1. Enable CORS for React (Port 5173)
origins = [
    "http://localhost:5173",                            # Local development
    "https://rain-prediction-frontend.onrender.com",             # Your LIVE frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,                              # Use the list above
    allow_credentials=True,
    allow_methods=["*"],                                # Allows GET, POST, etc.
    allow_headers=["*"],                                # Allows all headers
)
model_weights=joblib.load('model_weights.pkl')
scaler= joblib.load("scaler.pkl")

class WeatherData(BaseModel):
    temp :float
    humidity:float
    clouds: float
    pressure: float

@app.post("/predict")
def predict(data: WeatherData):
    bias_input_value = 1
    features=np.array([[data.temp, data.humidity, data.clouds, data.pressure]])
    scaled= scaler.transform(features).flatten()
    scaled_with_bias=np.insert(scaled,0,bias_input_value)
    z= np.dot(scaled_with_bias, model_weights)
    prob= 1/(1+np.exp(-z))

    # Calculate percentage for the string
    percentage =prob* 100
    p_val = prob

    # Determine the descriptive message
    if 0 <= p_val < 0.25:
        prediction_text = "Very low chances of rain"
    elif 0.25 <= p_val < 0.50:
        prediction_text = "Low chances of rain"
    elif 0.50 <= p_val < 0.75:
        prediction_text = "Moderate chances of rain"
    elif 0.75 <= p_val < 0.90:
        prediction_text = "High chances of rain"
    else:
        prediction_text = "Very high chances of rain"

    return {
        "probability": f"{percentage:.2f}%",
        "prediction": prediction_text
    }



