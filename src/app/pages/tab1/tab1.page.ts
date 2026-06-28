import { Component, OnInit, viewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInfiniteScroll } from '@ionic/angular/standalone';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';
import { ArticlesComponent } from '../../components/articles/articles.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInfiniteScroll, ArticlesComponent],
})
export class Tab1Page implements OnInit {

  private readonly infiniteScroll = viewChild(IonInfiniteScroll);

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

  loadData(){
    const infiniteScroll = this.infiniteScroll();

    this.newsService.gettopHeadlines()
      .subscribe(articles => {
        if (!infiniteScroll) {
          return;
        }

        if (articles.length === this.articles.length) {
          infiniteScroll.disabled = true;
          return;
        }

        this.articles = articles;
        infiniteScroll.complete();
      });
  }
}
