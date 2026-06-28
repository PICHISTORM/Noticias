import { Component, OnInit, viewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { SegmentCustomEvent } from '@ionic/angular';
import { ArticlesComponent } from '../../components/articles/articles.component';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';
import { ArticleComponent } from "src/app/components/article/article.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, ArticlesComponent, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class Tab2Page implements OnInit {

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

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadCategoryArticles();
  }

  segmentChanged(category: SegmentCustomEvent){
    const value = category.detail.value;
    const infinite = this.infiniteScroll();

    console.log(infinite?.disabled);

    if (!value || typeof value !== 'string') return;

    this.selectedCategory = value;
    this.articles = [];

    this.loadCategoryArticles();
  }

  private loadCategoryArticles(loadMore: boolean = false) {
    const category = this.selectedCategory;

    this.newsService.getTopHeadlinesByCategory(category, loadMore)
      .subscribe(articles => {

        console.log(
          this.selectedCategory,
          this.newsService.isCategoryLoadedCompletely(this.selectedCategory)
        );

        if(category !== this.selectedCategory){
          return;
        }

        this.articles = articles || [];

        const infiniteScroll = this.infiniteScroll();
        if(!infiniteScroll) return;

        infiniteScroll.disabled =
          this.newsService.isCategoryLoadedCompletely(category)

        console.log(
          category,
          'disabled:',
          infiniteScroll.disabled
        );
      });
  }

  loadData(){
    console.log('ION INFINITE');

    const infinite = this.infiniteScroll();

    if (!infinite) {
      return;
    }

    const category = this.selectedCategory;

    if (this.newsService.isCategoryLoadedCompletely(category)) {

      infinite.complete();
      infinite.disabled = true;

      return;
    }

    this.newsService
        .getTopHeadlinesByCategory(category, true)
        .subscribe(articles => {

          if (category !== this.selectedCategory) {
            infinite.complete();
            return;
          }

          this.articles = articles;

          infinite.complete();

          infinite.disabled =
            this.newsService.isCategoryLoadedCompletely(category);

        });
  }

}
