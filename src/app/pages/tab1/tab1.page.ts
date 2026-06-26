import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';
import { ArticlesComponent } from "src/app/components/articles/articles.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ArticlesComponent],
})
export class Tab1Page implements OnInit {

  public articles: Article[] = [];
  public isLoading = true;
  public error: string | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.gettopHeadlines()
      .subscribe({
        next: (articles) => {
          this.articles = articles;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading articles:', error);
          this.error = 'Error cargando noticias';
          this.isLoading = false;
        },
        complete: () => {
          console.log('Articles loaded successfully');
        }
      });
  }
}
