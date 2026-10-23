// chat-sentiment.model.ts

export interface PredictResponse {
    group_T: SentimentGroup;
    group_C: SentimentGroup;
  }
  
  export interface SentimentGroup {
    sentiment_counts: SentimentCounts;
    per_sentiment_summary: Record<string, string[]>;
    per_text_sentiment: PerTextSentiment[];
    addiction_user_ids: string[];
    total_texts: number;
  }
  
  export interface SentimentCounts {
    Positive: number;
    Neutral: number;
    Negative: number;
    Addiction: number;
  }
  
  export interface PerTextSentiment {
    user_id: string;
    text: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Addiction';
  }
  