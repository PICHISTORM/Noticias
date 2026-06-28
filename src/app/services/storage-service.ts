import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private favoritos: Article[] = [];
  private isLoaded = false;
  private favoritosSubject = new BehaviorSubject<Article[]>([]);
  public favoritos$ = this.favoritosSubject.asObservable();

  constructor() { }

  private async ensureLoaded() {
    if (this.isLoaded) {
      return;
    }

    const { value } = await Preferences.get({
      key: 'favoritos'
    });

    this.favoritos = value ? JSON.parse(value) : [];
    this.isLoaded = true;
    this.favoritosSubject.next(this.favoritos);
  }

  async guardarFavorito(article: Article) {
    await this.ensureLoaded();

    const existe = this.favoritos.find(a => a.url === article.url);

    if (existe) {
      return;
    }

    this.favoritos.unshift(article);

    await Preferences.set({
      key: 'favoritos',
      value: JSON.stringify(this.favoritos)
    });

    this.favoritosSubject.next(this.favoritos);
  }

  async cargarFavoritos(): Promise<Article[]> {
    await this.ensureLoaded();
    return this.favoritos;
  }

  async isFavorito(article: Article): Promise<boolean> {
    await this.ensureLoaded();
    return this.favoritos.some(a => a.url === article.url);
  }

  getFavoritos() {
    return this.favoritos;
  }

  async eliminarFavorito(article: Article) {
    await this.ensureLoaded();

    this.favoritos = this.favoritos.filter(
      a => a.url !== article.url
    );

    await Preferences.set({
      key: 'favoritos',
      value: JSON.stringify(this.favoritos)
    });

    this.favoritosSubject.next(this.favoritos);
  }

}
