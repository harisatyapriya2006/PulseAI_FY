package com.springboot.Test.Model;

public class SentimentResult {
    private String text;
    private String category;

    public SentimentResult() {}

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
