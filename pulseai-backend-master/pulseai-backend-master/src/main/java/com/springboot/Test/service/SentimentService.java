package com.springboot.Test.service;

import com.springboot.Test.Model.Request;
import com.springboot.Test.Model.SentimentResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Service
public class SentimentService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String apiUrl =
            "https://pulseai-fy.onrender.com/predict";

    public SentimentResponse analyzeSentiments(Request request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Request> entity =
                new HttpEntity<>(request, headers);

        try {
            ResponseEntity<SentimentResponse> response =
                    restTemplate.postForEntity(
                            apiUrl,
                            entity,
                            SentimentResponse.class
                    );

            return response.getBody();

        } catch (RestClientResponseException e) {
            System.err.println(
                    "Python API HTTP status: " + e.getStatusCode()
            );
            System.err.println(
                    "Python API response: " + e.getResponseBodyAsString()
            );
            throw e;

        } catch (ResourceAccessException e) {
            System.err.println(
                    "Could not connect to Python API: " + e.getMessage()
            );
            throw e;
        }
    }
}
