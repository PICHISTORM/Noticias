import { Component, viewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonInfiniteScroll } from '@ionic/angular/standalone';
import { SegmentCustomEvent } from '@ionic/angular';
import { ArticlesComponent } from '../../components/articles/articles.component';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonInfiniteScroll, ArticlesComponent]
})
export class Tab2Page {

  private readonly infiniteScroll = viewChild(IonInfiniteScroll);

  public categories: string[]=[
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology'
  ];

  public selectedCategory: string=this.categories[0];
  public articles: Article[] = [];

  constructor(private newsService: NewsService) {
    this.loadCategoryArticles();
  }

  segmentChanged(category: SegmentCustomEvent){
    const value = category.detail.value;
    if (value && typeof value === 'string') {
      this.selectedCategory = value;
      this.articles = [];
      this.loadCategoryArticles();
    }
  }

  private loadCategoryArticles() {
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, false)
      .subscribe(articles => {
        this.articles = articles;
      });
  }

  loadData(){
    const infiniteScroll = this.infiniteScroll();

    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, true)
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
