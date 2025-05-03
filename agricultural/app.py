from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load trained model and encoder (Ensure paths are correct)
model = joblib.load("C:/Users/Thato/Documents/crop_yield_model.pkl")
encoder = joblib.load("C:/Users/Thato/Documents/encoder.pkl")  # ✅ Load the encoder

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Convert input into DataFrame
    new_input = pd.DataFrame([data])

    # Apply One-Hot Encoding using the pre-trained encoder
    categorical_columns = ["region", "soil_type", "weather_condition", "crop"]
    encoded_input = encoder.transform(new_input[categorical_columns])
    encoded_df = pd.DataFrame(encoded_input, columns=encoder.get_feature_names_out())

    # Merge with numerical features
    final_input = pd.concat([new_input.drop(columns=categorical_columns), encoded_df], axis=1)

    # Ensure column order matches model training format
    expected_columns = ['Rainfall_mm', 'Temperature_Celsius', 'Days_to_Harvest', 'Region_East',
                        'Region_North', 'Region_South', 'Region_West', 'Soil_Type_Chalky',
                        'Soil_Type_Clay', 'Soil_Type_Loam', 'Soil_Type_Peaty', 'Soil_Type_Sandy',
                        'Soil_Type_Silt', 'Crop_Barley', 'Crop_Cotton', 'Crop_Maize', 'Crop_Rice',
                        'Crop_Soybean', 'Crop_Wheat', 'Weather_Condition_Cloudy',
                        'Weather_Condition_Rainy', 'Weather_Condition_Sunny', 
                        'Fertilizer_Used_False', 'Fertilizer_Used_True', 
                        'Irrigation_Used_False', 'Irrigation_Used_True']

    # Ensure correct feature order
    final_input = final_input.reindex(columns=expected_columns, fill_value=0)

    # Make prediction
    prediction = model.predict(final_input)

    return jsonify({"yield_prediction": prediction[0]})

# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True)
