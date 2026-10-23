import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { SentimentService } from '../sentiment.service';
import { ChatData } from './chatRequest.model';
import { PredictResponse } from '../sentiment-response.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  constructor(private router:Router,private sentimentService:SentimentService) {}
  
  @Input() chatPage!: boolean;

  @Output() msgToDashboard = new EventEmitter<boolean>(); 

  message: string = '';
  // messages: string[] = [];
  messages: { text: string; from: 'user' | 'support' }[] = [];

  apiData !: ChatData;

  sentimentResponse!: PredictResponse ;


  ngOnInit(): void {
    console.log(this.chatPage);
  }

  backToDashboard() {
    this.chatPage=!this.chatPage;
    this.msgToDashboard.emit(this.chatPage);
    this.router.navigate(['/dashboard']);
  }

  sendMessage() {
    const trimmed = this.message.trim();
    if (trimmed) {
      // User message (right side)
      // this.apiData = trimmed;
      console.log('User typed:', trimmed);
      this.messages.push({ text: trimmed, from: 'user' });
      this.message = '';
      
      console.log(this.message);
      
      // Support message (left side) after 1 sec delay
      //api call
      this.getChatResponse(trimmed);
    }
  }

  getChatResponse(msg:string) {
    this.apiData = {
      chats: [
        {
          text: msg,
          user_id: "CHAT_1"
        }
      ]
    }
    this.sentimentService.analyzeByFilter(this.apiData).subscribe((res:PredictResponse )=>{
      this.sentimentResponse = res;
      console.log(res);
      
      this.messages.push({
        text: this.sentimentResponse.group_C.per_text_sentiment[0].sentiment,
        from: 'support',
      })
    })
  }

  scrollToBottom() {
    const messagesDiv = document.querySelector('.messages');
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }
}
