package com.springboot.Test.service;
import com.springboot.Test.Model.Request;
import com.springboot.Test.Model.SentimentResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class SentimentService {
    private final RestTemplate restTemplate = new RestTemplate();

    // URL of your running FastAPI service
    private final String apiUrl = "http://localhost:8000/predict";

    public SentimentResponse analyzeSentiments(Request request) {
        System.out.println(request);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Request> entity = new HttpEntity<>(request, headers);

        return restTemplate.postForObject(apiUrl, entity, SentimentResponse.class);
    }
}
