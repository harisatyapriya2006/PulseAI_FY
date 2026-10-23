import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatData } from './chat/chatRequest.model';
import { PredictResponse } from './sentiment-response.model';

@Injectable({ providedIn: 'root' })
export class SentimentService {
  private apiUrl = 'http://localhost:8080/api/sentiment';

  constructor(private http: HttpClient) { }

  analyzeByFilter(data: ChatData): Observable<PredictResponse> {
    return this.http.post<PredictResponse>(
      this.apiUrl,
      data
    )
  }
}
