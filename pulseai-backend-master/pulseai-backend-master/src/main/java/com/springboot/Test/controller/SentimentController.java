package com.springboot.Test.controller;

import com.springboot.Test.Model.SentimentResponse;
import com.springboot.Test.service.SentimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.springboot.Test.Model.Request;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SentimentController {

    @Autowired
    private SentimentService sentimentService;
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/sentiment")
    public SentimentResponse analyze(@RequestBody Request texts) {
        return sentimentService.analyzeSentiments(texts);
    }

}
