import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCardSubtitle, IonCard, IonCardTitle, IonImg, IonCardContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { NewsService } from '../../services/news.service';
import { Article, NewsResponse } from 'src/app/interfaces';
import { ArticlesComponent } from "src/app/components/articles/articles.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonGrid, IonRow, IonCol, IonCardSubtitle, IonCard, IonCardTitle, IonImg, IonCardContent, ArticlesComponent],
})
export class Tab1Page implements OnInit {


  public articles: Article[]= [];

  constructor(private newsService: NewsService) {}


ngOnInit() {
  this.newsService.gettopHeadlines()
    .subscribe({
      next: (articles) => {
        this.articles.push(...articles);
      },

    });
  }
}
