import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ArticlesComponent } from '../../components/articles/articles.component';
import { Article } from 'src/app/interfaces';
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ArticlesComponent],
})
export class Tab3Page implements OnInit, OnDestroy {
  public favorites: Article[] = [];
  public isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.storageService.favoritos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((favorites) => {
        this.favorites = favorites;
        this.isLoading = false;
      });
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    await this.storageService.cargarFavoritos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
