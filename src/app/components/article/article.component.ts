import { CanShareResult } from './../../../../node_modules/@capacitor/share/dist/esm/definitions.d';
import { Component, Input} from '@angular/core';
import { IonCard, IonCardSubtitle, IonCardTitle, IonImg, IonCardContent, IonRow, IonCol, IonButton, IonIcon, ActionSheetController } from "@ionic/angular/standalone";
import { Article } from 'src/app/interfaces';
import { closeOutline, ellipsisVerticalOutline, heartOutline, paperPlaneOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

//Plugins
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { StorageService } from 'src/app/services/storage-service';

addIcons({
  ellipsisVerticalOutline,
  paperPlaneOutline,
  heartOutline,
  closeOutline,
  trashOutline
});

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  imports: [IonCard, IonCardSubtitle, IonCardTitle, IonImg, IonCardContent, IonRow, IonCol, IonButton, IonIcon],
})
export class ArticleComponent{



@Input({ required: true }) article!: Article;
@Input({ required: true }) index!: number;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private locaData: StorageService
  ) { }


  async openArticle() {
    if (!this.article.url) {
      return;
    }

    // Cuando se ejecuta con ionic serve
    if (window.location.protocol.startsWith('http')) {
      window.open(this.article.url, '_blank');
      return;
    }

    // Cuando se ejecuta como aplicación con Capacitor
    await Browser.open({
      url: this.article.url
    });
  }

  async  onOpenMenu(){
    const esFavorito = await this.locaData.isFavorito(this.article);

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Compartir',
          icon: 'paper-plane-outline',
          handler: () => this.onShareArticle()
        },
        {
          text: esFavorito ? 'Eliminar favorito' : 'Favorito',
          icon: esFavorito ? 'trash-outline' : 'heart-outline',
          handler: () => esFavorito ? this.onRemoveFavorite() : this.onToggleFavorite()
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  private async onRemoveFavorite() {
    await this.locaData.eliminarFavorito(this.article);
  }

  async onShareArticle() {

    if (!this.article.url) return;

    // Navegador
    if (window.location.protocol.startsWith('http')) {

      if (navigator.share) {
        await navigator.share({
          title: this.article.title,
          text: this.article.description ?? '',
          url: this.article.url
        });
      } else {
        await navigator.clipboard.writeText(this.article.url);
        alert('Enlace copiado al portapapeles');
      }

      return;
    }

    // Aplicación Android/iOS
    await Share.share({
      title: this.article.title,
      text: this.article.description ?? '',
      url: this.article.url,
      dialogTitle: 'Compartir noticia'
    });

  }

  async onToggleFavorite(){
    console.log('toggle favorite')
    await this.locaData.guardarFavorito(this.article)
  }

}
