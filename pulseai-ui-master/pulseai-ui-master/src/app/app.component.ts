import { Component, OnInit} from '@angular/core';
import { ChartType, ChartEvent } from 'chart.js';
import { SentimentService } from './sentiment.service';
import { PredictResponse } from './sentiment-response.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import {
  Chart,
  registerables
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';


Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  title = 'Sentiment Analysis Dashboard';

  showUploadModal = false;
  selectedFile: File | null = null;

  chatChartOptions: any;
  twitterChartOptions: any;

  showModal = false;
  modalTitle = '';
  modalText = '';
  chatPage = false;
  sentimentLabel = '';

  jsonData: { chats: { text: string; user_id: string }[] } | null = null;

  // Filters
  startDate!: string;
  endDate!: string;
  today = new Date().toISOString().split('T')[0];
  labels = ['BETMGM', 'CORAL', 'LADBROKES', 'SportingBet'];
  selectedCountry = '';

  // Chart configs
  pieChartType: ChartType = 'pie';
  chatSentimentResponse!: PredictResponse;
  xSentimentResponse!: PredictResponse;

  // Chat chart data & state
  chatPieChartData: any;
  chatSelectedSentiment: string | null = null;
  chatAddictionUserIds: string[] = [];

  // Twitter chart data & state
  twitterPieChartData: any;
  twitterSelectedSentiment: string | null = null;
  twitterAddictionUserIds: string[] = [];
  lastPathSegment: string = '';
  source='';

  // Dummy chat data
  chatData = [
    {
      user_id: 'user123',
      text: "I'm addicted to this game!",
      sentiment: 'Addiction',
      date: '2025-07-10',
      country: 'USA',
    },
    {
      user_id: 'user456',
      text: 'The graphics are okay.',
      sentiment: 'Neutral',
      date: '2025-07-11',
      country: 'UK',
    },
    {
      user_id: 'user789',
      text: "I love the new features!",
      sentiment: 'Positive',
      date: '2025-07-13',
      country: 'USA',
    },
    {
      user_id: 'user789',
      text: "I love the new features!",
      sentiment: 'Negative',
      date: '2025-07-13',
      country: 'USA',
    },
  ];

  // Dummy twitter data
  twitterData = [
    {
      twitter_id: 'tw001',
      tweet: 'Not a fan of the update.',
      sentiment: 'Negative',
      date: '2025-07-09',
      country: 'India',
    },
    {
      twitter_id: 'tw002',
      tweet: "Totally hooked and can't stop playing.",
      sentiment: 'Addiction',
      date: '2025-07-12',
      country: 'USA',
    },
    {
      twitter_id: 'tw003',
      tweet: 'Pretty decent overall.',
      sentiment: 'Neutral',
      date: '2025-07-14',
      country: 'UK',
    },
  ];

  // Sentiment summaries for each dataset (precalculated on update)
  chatSentimentSummary: Record<string, string[]> = {};
  twitterSentimentSummary: Record<string, string[]> = {};

  constructor(private sentimentService: SentimentService,private router:Router) {}

  ngOnInit() {
    console.log(this.chatPage);
    
    const todayDate = new Date();
    const priorDate = new Date().setDate(todayDate.getDate() - 7);
    this.startDate = new Date(priorDate).toISOString().slice(0, 10);
    this.endDate = this.today;

    //call the api
    // this.getSentimentData();

    // Initialize charts with all data filtered by default filters
    // this.updateChatChart();
    // this.updateTwitterChart();
  }

  // getSentimentData() {
  //   this.sentimentService.analyzeByFilter('ehy').subscribe((res: SentimentResponse) => {
  //     this.sentimentResponse = res;
  //   });
  // }
  

  filteredChatData() {
    return this.chatData.filter(
      (item) =>
        item.date >= this.startDate &&
        item.date <= this.endDate &&
        (this.selectedCountry === '' || item.country === this.selectedCountry)
    );
  }

  filteredTwitterData() {
    return this.twitterData.filter(
      (item) =>
        item.date >= this.startDate &&
        item.date <= this.endDate &&
        (this.selectedCountry === '' || item.country === this.selectedCountry)
    );
  }

  getSentimentCounts(dataArray: any[]) {
    const counts: Record<string, number> = {
      Positive: 0,
      Neutral: 0,
      Negative: 0,
      Addiction: 0,
    };
    dataArray.forEach((item) => {
      counts[item.sentiment] = (counts[item.sentiment] || 0) + 1;
    });
    return counts;
  }

  getSummary(dataArray: any[]) {
    const summary: Record<string, string[]> = {};
    dataArray.forEach((item) => {
      if (!summary[item.sentiment]) summary[item.sentiment] = [];
      summary[item.sentiment].push(item.text || item.tweet);
    });
    return summary;
  }

  updateChatChart() {
    // const filtered = this.filteredChatData();
    const groupData = this.chatSentimentResponse.group_C;

    if (!groupData || !groupData.sentiment_counts) {
      console.warn('No sentiment_counts found for');
      return;
    }
  
    const counts = groupData.sentiment_counts;

    // const counts = this.getSentimentCounts(filtered);
    // this.chatSentimentSummary = this.getSummary(filtered);
    this.chatPieChartData = {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ['#FFD700', '#6c757d', '#ff0000', '#6f42c1'],
        },
      ],
    };
    this.chatChartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: false // 🚫 Disable hover tooltips
        },
        // datalabels: {
        //   formatter: (value: number) => value.toString(),
        //   color: '#fff',
        //   font: {
        //     weight: 'bold',
        //     size: 14,
        //   },
        // },
        
        datalabels: {
          display: false
        },

      },
    };
    this.chatSelectedSentiment = null;
    // this.chatAddictionUserIds = filtered
    //   .filter((x) => x.sentiment === 'Addiction')
    //   .map((x) => x.user_id);
  }

  updateTwitterChart() {
    const groupData = this.chatSentimentResponse.group_T;

    if (!groupData || !groupData.sentiment_counts) {
      console.warn('No sentiment_counts found for');
      return;
    }
  
    const counts = groupData.sentiment_counts;


    // const filtered = this.filteredTwitterData();
    // const counts = this.getSentimentCounts(filtered);
    // this.twitterSentimentSummary = this.getSummary(filtered);
    this.twitterPieChartData = {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ['#FFD700', '#6c757d', '#dc3545', '#6f42c1'],
        },
      ],
    };
    this.twitterChartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: false // 🚫 Disable hover tooltips
        },
        // datalabels: {
        //   formatter: (value: number) => value.toString(),
        //   color: '#fff',
        //   font: {
        //     weight: 'bold',
        //     size: 14,
        //   },
        // },
        
        datalabels: {
          display: false
        },

      },
    };
    this.twitterSelectedSentiment = null;
    // this.twitterAddictionUserIds = filtered
    //   .filter((x) => x.sentiment === 'Addiction')
    //   .map((x) => x.twitter_id);
  }

  // Called when user clicks Analyze buttons
  analyzeByChat() {
    this.updateChatChart();
  }

  analyzeByTwitter() {
    this.updateTwitterChart();
  }

  openModal(sentiment: string, source: 'chat' | 'twitter') {
    this.showModal = true;
    this.sentimentLabel = sentiment;
    this.modalTitle = `Sentiment: ${sentiment} (${source.toUpperCase()})`;

    // if (source === 'chat') {
    //   switch (sentiment) {
    //     case 'Addiction':
    //       this.modalText = `1. Welcome to the game! 2. This is the second line. 3. Third line with some detail.`;
    //       break;
    //     case 'Positive':
    //       this.modalText = 'CHAT: Users are enjoying the experience.';
    //       break;
    //     case 'Neutral':
    //       this.modalText = 'CHAT: Neutral or factual statements.';
    //       break;
    //     case 'Negative':
    //       this.modalText = 'CHAT: Users reported issues or dissatisfaction.';
    //       break;
    //     default:
    //       this.modalText = 'CHAT: No data.';
    //   }
    // } else if (source === 'twitter') {
    //   switch (sentiment) {
    //     case 'Addiction':
    //       this.modalText = 'TWITTER: Multiple tweets suggest compulsive behavior.';
    //       break;
    //     case 'Positive':
    //       this.modalText = 'TWITTER: Positive sentiment tweets detected.';
    //       break;
    //     case 'Neutral':
    //       this.modalText = 'TWITTER: Informational or neutral tweets.';
    //       break;
    //     case 'Negative':
    //       this.modalText = 'TWITTER: Tweets expressing criticism.';
    //       break;
    //     default:
    //       this.modalText = 'TWITTER: No data.';
    //   }
    // }
  }

  closeModal() {
    this.showModal = false;
  }

  onChartClick(event: { event?: ChartEvent; active?: {}[] }, source: 'chat' | 'twitter'): void {
    const activePoints: any = event.active;
    if (activePoints && activePoints.length > 0) {
      const chart: any = activePoints[0]['element']['$context']['chart'];
      const index = activePoints[0]['index'];
      const label = chart.data.labels[index];

      // 🔎 Show modal with info
      this.source=source;
      this.openModal(label, source);
    }
  }

  scrollToChat() {
    const el = document.getElementById('chat-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  openChatPage() {
    this.chatPage=!this.chatPage;
    this.router.navigate(['/chat']);
  }
  receiveMessage(msg: any) {
   this.chatPage=!this.chatPage
   console.log(this.chatPage);
   
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      this.selectedFile = file;
    } else {
      alert('Please select a valid .xlsx file');
    }
  }

  processFile() {

    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const bstr = e.target?.result;
      if (typeof bstr !== 'string') return;

      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data: any[] = XLSX.utils.sheet_to_json(ws);

      const chats = data.map(row => ({
        text: row['Data'] ?? '',
        user_id: row['AccountID'] ?? ''
      }));

      this.jsonData = { chats };
      console.log(this.jsonData);
      this.apiCall(this.jsonData);
    };

    reader.readAsBinaryString(this.selectedFile);
  }

  apiCall(jsonData:any){
    this.sentimentService.analyzeByFilter(jsonData).subscribe((res)=>{
      console.log(res);
      this.chatSentimentResponse  = res;
      this.closeUploadModal();
      this.updateChatChart();
      this.updateTwitterChart();
    })
  }
}
