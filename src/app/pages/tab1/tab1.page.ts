import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';
import { ArticlesComponent } from '../../components/articles/articles.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, ArticlesComponent],
})
export class Tab1Page implements OnInit {

  public articles: Article[] = [];
  public isLoading = true;
  public error: string | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadInitialArticles();
  }

  private loadInitialArticles() {
    this.newsService.gettopHeadlines(false)
      .subscribe({
        next: (articles) => {
          this.articles = articles;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading articles:', error);
          this.error = 'Error cargando noticias';
          this.isLoading = false;
        }
      });
  }

  loadData(event: Event) {
    const infiniteScroll = event.target as HTMLIonInfiniteScrollElement;

    this.newsService.gettopHeadlines(true)
      .subscribe({
        next: (articles) => {
          this.articles = articles;
          infiniteScroll.complete();

          if (this.newsService.isTopHeadlinesLoadedCompletely()) {
            infiniteScroll.disabled = true;
          }
        },
        error: (error) => {
          console.error('Error loading more articles:', error);
          infiniteScroll.complete();
        }
      });
  }
}
