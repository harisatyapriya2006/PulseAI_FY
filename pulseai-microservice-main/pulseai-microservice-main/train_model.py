import os
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import nltk
import joblib
import string
from nltk.corpus import stopwords

nltk.download('stopwords')

# Path to your single Excel file
input_path_1 = 'sample_data/chat_tweet_data.xlsx'  # change to your actual file
input_path_2 = 'sample_data/Live&Manual_Data.xlsx'
input_path_3 = 'sample_data/short_texts_data_training.xlsx'
input_path_4 = 'sample_data/betting_app_tweets_1000_mixed.xlsx'

output_dir = 'trained_result'
os.makedirs(output_dir, exist_ok=True)

stop_words = set(stopwords.words('english'))
punctuations = set(string.punctuation)

def preprocess_text(text):
    if pd.isnull(text):
        return ""
    text = text.lower()
    text = ''.join(ch for ch in text if ch not in punctuations)
    tokens = text.split()
    tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(tokens)

# Load data from single Excel file
print("Reading data from first Excel file...")
df1 = pd.read_excel(input_path_1)
print(f"Finished reading {input_path_1}, rows loaded: {len(df1)}")

print("Reading data from second Excel file...")
df2 = pd.read_excel(input_path_2)
print(f"Finished reading {input_path_2}, rows loaded: {len(df2)}")

print("Reading data from third Excel file...")
df3 = pd.read_excel(input_path_3)
print(f"Finished reading {input_path_3}, rows loaded: {len(df3)}")

print("Reading data from third Excel file...")
df4 = pd.read_excel(input_path_4)
print(f"Finished reading {input_path_4}, rows loaded: {len(df4)}")


print("Combining data from all files...")
df = pd.concat([df1, df2, df3, df4], ignore_index=True)
print(f"Total rows after merge: {len(df)}")

# Preprocess text column
df['clean_text'] = df['Data'].apply(preprocess_text)

X = df['clean_text']
y = df['PlayerSentiment']  # Assuming the label column is named 'label'

# Create pipeline (vectorizer + classifier)
model_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000)),
    ('clf', LogisticRegression(max_iter=1000))
])

# Train model pipeline
model_pipeline.fit(X, y)

# Save model pipeline to disk
joblib.dump(model_pipeline, os.path.join(output_dir, 'sentiment_model.joblib'))

print("Training complete. Model saved to 'trained_result/sentiment_model.joblib'")
