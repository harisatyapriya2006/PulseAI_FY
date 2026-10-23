from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import joblib
import string
import nltk
import yake
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize
from collections import defaultdict, Counter

# Download NLTK resources
nltk.download('stopwords')
nltk.download('punkt')

# Preload stopwords and punctuation
stop_words = set(stopwords.words('english'))
punctuations = set(string.punctuation)

# Initialize FastAPI app
app = FastAPI()

# Load the trained pipeline model
model_pipeline = joblib.load('trained_result/sentiment_model.joblib')

# === Helper functions ===

def preprocess_text(text: str) -> str:
    text = text.lower()
    text = ''.join(ch for ch in text if ch not in punctuations)
    tokens = text.split()
    tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(tokens)

def extract_summary_sentences(texts: List[str], top_keywords: List[str], max_sentences: int) -> List[str]:
    candidate_sentences = []
    seen = set()
    for text in texts:
        sentences = sent_tokenize(text)
        for sent in sentences:
            sent_lower = sent.lower()
            if any(kw.lower() in sent_lower for kw in top_keywords):
                if sent not in seen:
                    candidate_sentences.append(sent.strip())
                    seen.add(sent)
                    if len(candidate_sentences) >= max_sentences:
                        return candidate_sentences
    return candidate_sentences

def summarize_per_sentiment_sentences(texts: List[str], predictions: List[str]) -> dict:
    grouped = defaultdict(list)
    for text, pred in zip(texts, predictions):
        grouped[pred].append(text)

    result_summary = {}
    for sentiment, group_texts in grouped.items():
        count = len(group_texts)
        if count == 0:
            continue

        if count >= 10:
            num = 5
        elif count >= 5:
            num = 3
        else:
            num = 1

        combined_text = " ".join(group_texts)
        kw_extractor = yake.KeywordExtractor(lan="en", n=1, top=20)
        keywords = kw_extractor.extract_keywords(combined_text)
        top_keywords = [kw for kw, _ in keywords]

        summary_sentences = extract_summary_sentences(group_texts, top_keywords, num)
        if not summary_sentences:
            summary_sentences = ["No summary available"]

        result_summary[sentiment] = summary_sentences

    return result_summary

# === Data Models ===

class ChatItem(BaseModel):
    text: str
    user_id: str

class ChatList(BaseModel):
    chats: List[ChatItem]

# === API Endpoint ===

@app.post("/predict")
def predict_sentiments(input_data: ChatList):
    # Split input into groups
    group_T = [chat for chat in input_data.chats if chat.user_id.startswith("XTWEET_")]
    group_C = [chat for chat in input_data.chats if chat.user_id.startswith("CHAT_")]

    def process_group(chats: List[ChatItem]) -> dict:
        if not chats:
            return {
                "sentiment_counts": {},
                "per_sentiment_summary": {},
                "per_text_sentiment": [],
                "addiction_user_ids": [],
                "total_texts": 0
            }

        texts = [chat.text for chat in chats]
        user_ids = [chat.user_id for chat in chats]

        # Preprocess
        preprocessed_texts = [preprocess_text(text) for text in texts]

        # Predict sentiments
        predictions = model_pipeline.predict(preprocessed_texts)

        # Count sentiments
        sentiment_counts = Counter(predictions)
        all_sentiments = ["Positive", "Neutral", "Negative", "Addiction"]
        full_counts = {sent: sentiment_counts.get(sent, 0) for sent in all_sentiments}

        # Generate summary
        summaries = summarize_per_sentiment_sentences(texts, predictions)

        # Find addiction users
        addiction_user_ids = [
            uid for uid, sentiment in zip(user_ids, predictions) if sentiment == "Addiction"
        ]

        # Match each text with its sentiment
        per_text_sentiment = [
            {"user_id": uid, "text": txt, "sentiment": sentiment}
            for uid, txt, sentiment in zip(user_ids, texts, predictions)
        ]

        return {
            "sentiment_counts": full_counts,
            "per_sentiment_summary": summaries,
            "per_text_sentiment": per_text_sentiment,
            "addiction_user_ids": addiction_user_ids,
            "total_texts": len(texts)
        }

    return {
        "group_T": process_group(group_T),
        "group_C": process_group(group_C)
    }
