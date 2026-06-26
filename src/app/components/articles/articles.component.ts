import { Component, Input, OnInit } from '@angular/core';
import { IonGrid, IonRow, IonCard, IonCardSubtitle, IonCardTitle, IonImg, IonCardContent, IonCol } from "@ionic/angular/standalone";
import { Article } from 'src/app/interfaces';
import { ArticleComponent } from "../article/article.component";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  imports: [IonGrid, IonRow, IonCard, IonCardSubtitle, IonCardTitle, IonImg, IonCardContent, IonCol, ArticleComponent],
})
export class ArticlesComponent  implements OnInit {

  @Input() articles: Article[] = [];

  constructor() { }

  ngOnInit() {}

}
