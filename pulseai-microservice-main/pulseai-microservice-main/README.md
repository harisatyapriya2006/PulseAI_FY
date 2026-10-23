To run the project.
1) for installtion of the library - pip install -r requirements.txt
2) execute train_model.py, to train the dataset.
    command - python train_model.py
3) run the microservice
    command -  uvicorn predict_service:app --host 0.0.0.0 --port 8000