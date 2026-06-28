import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Article, NewsResponse } from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// Define local type for category cache
type ArticlesByCategoryAndPage = { [key: string]: { page: number; articles: Article[] } };

const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor(private http: HttpClient) { }

  gettopHeadlines(): Observable<Article[]> {
    return this.http.get<NewsResponse>(`https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&pageSize=20&language=en`, {
      params: { apiKey }
    }).pipe(
      map(({ articles }) => articles)
    );
  }

  getTopHeadlinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]> {
    if (loadMore) {
      return this.getArticlesByCategory(category);
    }

    if (this.articlesByCategoryAndPage[category]) {
      return of(this.articlesByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory(category: string): Observable<Article[]> {
    if (!this.articlesByCategoryAndPage[category]) {
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      };
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}&language=en`)
      .pipe(
        map(({ articles }) => {
          if (!articles.length) {
            return this.articlesByCategoryAndPage[category].articles;
          }

          this.articlesByCategoryAndPage[category] = {
            page,
            articles: [...this.articlesByCategoryAndPage[category].articles, ...articles]
          };

          return this.articlesByCategoryAndPage[category].articles;
        })
      );
  }

  private executeQuery<T>(endpoint: string): Observable<T> {
    const url = `https://newsapi.org/v2${endpoint}&apiKey=${apiKey}`;
    return this.http.get<T>(url);
  }
}

