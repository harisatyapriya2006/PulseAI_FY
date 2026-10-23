#!/bin/bash

# Run the model training script
echo "Starting model training..."
python3 train_model.py

# Check if the model was generated successfully
if [ -f "trained_result/sentiment_model.joblib" ]; then
    echo "Model training completed successfully."
else
    echo "Model training failed. Exiting."
    exit 1
fi

# Now, run the FastAPI app
echo "Starting PulseAI microservice app..."
uvicorn app:predict_service --host 0.0.0.0 --port 8000
