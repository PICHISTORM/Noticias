import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Article, NewsResponse } from '../interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class NewsService {

  constructor(private http: HttpClient) { }


  gettopHeadlines():Observable<Article[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.http.get<NewsResponse>(`https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&pageSize=20`,{
      params:{apiKey}
    }).pipe(
      map(({articles}) => articles)
    );
  }



}

