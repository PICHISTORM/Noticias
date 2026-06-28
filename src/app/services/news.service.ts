import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Article, NewsResponse } from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// Define local type for category cache
type ArticlesByCategoryAndPage = { [key: string]: { page: number; articles: Article[]; loadedAll: boolean; totalResults?: number } };

const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor(private http: HttpClient) { }

  private topHeadlinesPage = 0;
  private topHeadlinesArticles: Article[] = [];
  private topHeadlinesLoadedAll = false;
  private readonly topHeadlinesPageSize = 20;

  gettopHeadlines(loadMore: boolean = false): Observable<Article[]> {
    if (!loadMore && this.topHeadlinesArticles.length > 0) {
      return of(this.topHeadlinesArticles);
    }

    if (loadMore && this.topHeadlinesLoadedAll) {
      return of(this.topHeadlinesArticles);
    }

    return this.fetchTopHeadlinesPage();
  }

  isTopHeadlinesLoadedCompletely(): boolean {
    return this.topHeadlinesLoadedAll;
  }

  private fetchTopHeadlinesPage(): Observable<Article[]> {
    const page = this.topHeadlinesPage + 1;

    return this.executeQuery<NewsResponse>(
      `/everything?q=tesla&sortBy=publishedAt&pageSize=${this.topHeadlinesPageSize}&language=en&page=${page}`
    ).pipe(
      map(({ articles }) => {
        if (!articles.length) {
          this.topHeadlinesLoadedAll = true;
          return this.topHeadlinesArticles;
        }

        this.topHeadlinesPage = page;
        this.topHeadlinesArticles = [...this.topHeadlinesArticles, ...articles];
        if (articles.length < this.topHeadlinesPageSize) {
          this.topHeadlinesLoadedAll = true;
        }

        return this.topHeadlinesArticles;
      })
    );
  }

  getTopHeadlinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]> {
    if (!this.articlesByCategoryAndPage[category]) {
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: [],
        loadedAll: false
      };
    }

    const cache = this.articlesByCategoryAndPage[category];

    if (loadMore) {
      if (cache.loadedAll) {
        return of(cache.articles);
      }
      return this.getArticlesByCategory(category);
    }

    if (cache.articles.length > 0) {
      return of(cache.articles);
    }

    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory(category: string): Observable<Article[]> {
    if (!this.articlesByCategoryAndPage[category]) {
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: [],
        loadedAll: false
      };
    }

    const cache = this.articlesByCategoryAndPage[category];
    const page = cache.page + 1;

    return this.executeQuery<NewsResponse>(
      `/top-headlines?country=us&category=${category}&page=${page}&pageSize=20`)
      .pipe(
        map(({ articles, totalResults }) => {
        console.log(
          category,
          page,
          articles.length,
          cache.loadedAll
        );


          if (!articles.length) {
            cache.loadedAll = true;
            return cache.articles;
          }

          cache.page = page;
          cache.articles = [...cache.articles, ...articles];
          cache.totalResults = totalResults;
          cache.loadedAll = articles.length !== 20;

          console.log(
            category,
            page,
            articles.length,
            cache.loadedAll
          );

          return cache.articles;
        })
      );
  }

  isCategoryLoadedCompletely(category: string): boolean {
    return !!this.articlesByCategoryAndPage[category]?.loadedAll;
  }

  private executeQuery<T>(endpoint: string): Observable<T> {
    console.log('Peticion HTTP Realizada')
    const url = `https://newsapi.org/v2${endpoint}&apiKey=${apiKey}`;
    return this.http.get<T>(url);
  }
}

