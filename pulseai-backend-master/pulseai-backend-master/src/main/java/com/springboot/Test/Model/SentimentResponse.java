package com.springboot.Test.Model;

import java.util.List;
import java.util.Map;

public class SentimentResponse {
    private GroupData group_T;
    private GroupData group_C;

    // Getters and setters
    public GroupData getGroup_T() {
        return group_T;
    }
    public void setGroup_T(GroupData group_T) {
        this.group_T = group_T;
    }
    public GroupData getGroup_C() {
        return group_C;
    }
    public void setGroup_C(GroupData group_C) {
        this.group_C = group_C;
    }

    public static class GroupData {
        private Map<String, Integer> sentiment_counts;
        private Map<String, List<String>> per_sentiment_summary;
        private List<PerTextSentiment> per_text_sentiment;
        private List<String> addiction_user_ids;
        private int total_texts;

        // Getters and setters
        public Map<String, Integer> getSentiment_counts() {
            return sentiment_counts;
        }
        public void setSentiment_counts(Map<String, Integer> sentiment_counts) {
            this.sentiment_counts = sentiment_counts;
        }
        public Map<String, List<String>> getPer_sentiment_summary() {
            return per_sentiment_summary;
        }
        public void setPer_sentiment_summary(Map<String, List<String>> per_sentiment_summary) {
            this.per_sentiment_summary = per_sentiment_summary;
        }
        public List<PerTextSentiment> getPer_text_sentiment() {
            return per_text_sentiment;
        }
        public void setPer_text_sentiment(List<PerTextSentiment> per_text_sentiment) {
            this.per_text_sentiment = per_text_sentiment;
        }
        public List<String> getAddiction_user_ids() {
            return addiction_user_ids;
        }
        public void setAddiction_user_ids(List<String> addiction_user_ids) {
            this.addiction_user_ids = addiction_user_ids;
        }
        public int getTotal_texts() {
            return total_texts;
        }
        public void setTotal_texts(int total_texts) {
            this.total_texts = total_texts;
        }
    }

    public static class PerTextSentiment {
        private String user_id;
        private String text;
        private String sentiment;

        // Getters and setters
        public String getUser_id() {
            return user_id;
        }
        public void setUser_id(String user_id) {
            this.user_id = user_id;
        }
        public String getText() {
            return text;
        }
        public void setText(String text) {
            this.text = text;
        }
        public String getSentiment() {
            return sentiment;
        }
        public void setSentiment(String sentiment) {
            this.sentiment = sentiment;
        }
    }
}
